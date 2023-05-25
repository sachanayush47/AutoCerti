import puppeteer from "puppeteer";
import fs from "fs";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

import Certificate from "../models/Certificate.js";
import { google } from "googleapis";

const key = "./autocerti-3b574bd12097.json";

const SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
];

function imagesHaveLoaded() {
    return Array.from(document.images).every((i) => i.complete);
}

export const generatePdf = asyncHandler(async (req, res) => {
    const {
        htm,
        excelData,
        imageURL,
        height,
        width,
        email,
        password,
        title,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
    } = req.body;

    // Mandatory data fields
    if (!(htm && excelData && imageURL && height && width && email && password && title)) {
        res.status(400);
        throw new Error("Missing fields");
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: key,
        scopes: SCOPES,
    });

    const driveService = google.drive({ version: "v3", auth });

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("http://localhost:5173/print", { waitUntil: "networkidle0" });

    // Setting page configuration
    const divDimensions = await page.evaluate(
        (imageURL, height, width, paddingTop, paddingBottom, paddingLeft, paddingRight) => {
            const div = document.getElementsByClassName("ql-container")[0];
            div.style.background = `url(${imageURL})`;
            div.style.backgroundSize = "contain";
            div.style.backgroundRepeat = "no-repeat";
            div.style.height = `${height}px`;
            div.style.width = `${width}px`;
            div.style.paddingTop = `${paddingTop}px`;
            div.style.paddingBottom = `${paddingBottom}px`;
            div.style.paddingLeft = `${paddingLeft}px`;
            div.style.paddingRight = `${paddingRight}px`;
            return {
                width: div.offsetWidth,
                height: div.offsetHeight,
            };
        },
        imageURL,
        height,
        width,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight
    );

    // Getting variables
    let temp = htm;
    const regex = /{([^}]+)}/g;
    const matches = [];

    let match;
    while ((match = regex.exec(temp))) {
        matches.push(match[1]);
    }

    // Looping each row of excelData to create PDF for all.
    for (let i = 0; i < excelData.length; ++i) {
        // Adding entry to Database
        const cert = await Certificate.create({
            issuedBy: req.user.username,
            title: title,
            email: excelData[i].EMAIL,
        });

        excelData[i].ID = cert._id;

        // Filling data into the HTML
        for (let j = 0; j < matches.length; ++j) {
            temp = temp.replace(`{${matches[j]}}`, excelData[i][matches[j]]);
        }

        let qrCodeDataUrl;
        function qrCodePromise() {
            return new Promise((resolve, reject) => {
                QRCode.toFile(
                    `./qrcodes/${excelData[i].ID}.png`,
                    `${excelData[i].ID}`,
                    {
                        errorCorrectionLevel: "H",
                    },
                    function (err) {
                        if (err) throw err;
                        const image = fs.readFileSync(`./qrcodes/${excelData[i].ID}.png`);
                        const imageData = image.toString("base64");
                        qrCodeDataUrl = `data:image/png;base64,${imageData}`;
                        fs.unlinkSync(`./qrcodes/${excelData[i].ID}.png`);
                        if (qrCodeDataUrl) {
                            resolve(qrCodeDataUrl);
                        } else {
                            reject("Failed to generate qrcode");
                        }
                    }
                );
            });
        }

        const dsa = await qrCodePromise();
        console.log(dsa);

        // Setting PhotoID and QR code if requested by the certificate issuer
        await page.evaluate(
            (temp, excelDataRow, qrCodeDataUrl) => {
                document.getElementsByClassName("ql-editor")[0].innerHTML = JSON.parse(temp);

                // For PhotoID
                const photoid = document.getElementById("photoid");
                if (photoid) {
                    const idUrl = excelDataRow.PHOTOID.split("=")[1];
                    photoid.src = `https://lh3.googleusercontent.com/d/${idUrl}`;
                }

                // For QR Code
                const qrcode = document.getElementById("qrcode");
                if (qrcode) {
                    qrcode.src = qrCodeDataUrl;
                }
            },

            temp,
            excelData[i],
            qrCodeDataUrl
        );

        // Waiting for PhotoID to load
        await page.waitForFunction(imagesHaveLoaded);

        // Setting PDF page width and height
        await page.addStyleTag({
            content: `@page { size:${divDimensions.width + 2}px ${divDimensions.height + 2}px; }`,
        });

        // Creating PDF
        const screenshotBuffer = await page.pdf({
            printBackground: true,
            width: `${divDimensions.width}px`,
            height: `${divDimensions.height}px`,
        });

        // Writes the PDF to the file system
        fs.writeFileSync(`./pdf/${excelData[i].ID}.pdf`, screenshotBuffer);

        // PDF file metadata for google drive
        let fileMetaData = {
            name: `${excelData[i].EMAIL}_${excelData[i].ID}.pdf`,
            parents: ["136frpnJ1zfkixypNoToaLAAkWDFhjSuu"],
        };

        let media = {
            mimeType: "*/*",
            body: fs.createReadStream(`./pdf/${excelData[i].ID}.pdf`),
        };

        // Uploading to google drive
        let drivRes = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: "id",
        });

        // Making PDF public
        driveService.permissions.create({
            fileId: drivRes.data.id,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // Getting webview link of PDF. It will be sent of certificate holder email.
        const webViewLink = await driveService.files.get({
            fileId: drivRes.data.id,
            fields: "webViewLink",
        });

        // Updating "url" field in the databse with the "webViewLink"
        await Certificate.findByIdAndUpdate(cert.id, { url: webViewLink.data.webViewLink });

        // Sending mail to the certificate holder
        const mailOptions = {
            from: `"${req.user.name}" <${req.user.email}>`,
            to: excelData[i].EMAIL,
            subject: title,
            // text: "You are Awesome, But dumb as well",
            // html: `<a href=${webViewLink.data.webViewLink}>Download</a>`,
            html: `<p style="font-family: Arial, Helvetica, sans-serif;">Download your certificate by clicking on the Download button</p>
                    <div style="text-align: center;">
                        <a style="font: bold 20px Arial;
                            text-decoration: none;
                            color: white;
                            background-color: #3b82f6;
                            padding: 4px 8px 4px 8px;
                            border-radius: 4px;" href=${webViewLink.data.webViewLink}>Download</a>
                    </div>
                    <p style="font-family: Arial, Helvetica, sans-serif;">To verify your certificate please click <a style="background-color: blue; text-decoration: none; color: white; padding: 0px 5px;" href="">here</a></p>`,
            // attachments: [
            //     {
            //         filename: `${excelData[i].EMAIL}.pdf`,
            //         path: `./${excelData[i].EMAIL}.pdf`,
            //     },
            // ],
        };

        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: email,
                pass: password,
            },
        });

        try {
            let info = await transporter.sendMail(mailOptions);
            console.log(info.messageId);
        } catch (error) {
            res.status(401);
            await browser.close();
            throw new Error(error);
        }

        // Deleting the created PDF from the system
        fs.unlinkSync(`./pdf/${excelData[i].ID}.pdf`);
        temp = htm;
        console.log("Done " + excelData[i].EMAIL);
    }

    await browser.close();
    res.status(200).json({ message: "Job successfully completed." });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(req.params);
    const cert = await Certificate.findById(id);

    if (!cert) {
        res.status(400);
        throw new Error("Invalid Certificate ID");
    } else res.status(200).json({ message: cert });
});

export const getHistory = asyncHandler(async (req, res) => {
    const history = await Certificate.find({ issuedBy: req.user.username }).sort({ _id: -1 });
    res.status(200).json({ message: history });
});
