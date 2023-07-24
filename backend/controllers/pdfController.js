import puppeteer from "puppeteer";
import fs from "fs";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { google } from "googleapis";
import mongoose from "mongoose";

import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

const key = "./autocerti-3b574bd12097.json";

const SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
];

// To check all the images are completly loaded on the page.
function imagesHaveLoaded() {
    return Array.from(document.images).every((i) => i.complete);
}

// REGREX for email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// @desc    Creates certificate PDF, send emails and deducted credits
// @route   POST /api/pdf/screenshot
// @access  Private
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

    // Checking if user have enough credits.
    if (req.user.credit < excelData.length) {
        throw new Error("Insufficient credits, please buy credits");
    }

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
    await page.goto("http://localhost:5173/print", { timeout: 0, waitUntil: "networkidle0" });

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

    // Setting PDF page width and height
    await page.addStyleTag({
        content: `@page { size:${divDimensions.width + 2}px ${divDimensions.height + 2}px; }`,
    });

    // Getting variables of PDF
    let temp = htm;
    const regex = /{([^}]+)}/g;
    const matches = [];

    let match;
    while ((match = regex.exec(temp))) {
        matches.push(match[1]);
    }

    let creditsUsed = 0;

    // Looping each row of excelData to create PDF for all.
    for (let i = 0; i < excelData.length; ++i) {
        if (excelData[i].EMAIL == "" || !excelData[i].EMAIL || !isValidEmail(excelData[i].EMAIL)) {
            continue;
        }

        ++creditsUsed;

        // Adding entry to Database
        const cert = await Certificate.create({
            issuedBy: req.user.username,
            title: title,
            email: excelData[i].EMAIL,
        });

        excelData[i].ID = cert._id;

        // Populating data into the HTML
        for (let j = 0; j < matches.length; ++j) {
            temp = temp.replace(`{${matches[j]}}`, excelData[i][matches[j]]);
        }

        // Create of QR code of certificate ID
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

        await qrCodePromise();

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
            html: `<p style="font-family: Arial, Helvetica, sans-serif;">Download your certificate by clicking on the Download button</p>
                    <div style="text-align: center;">
                        <a style="font: bold 20px Arial;
                            text-decoration: none;
                            color: white;
                            background-color: #3b82f6;
                            padding: 4px 8px 4px 8px;
                            border-radius: 4px;" href=${webViewLink.data.webViewLink}>Download</a>
                    </div>
                    <p style="font-family: Arial, Helvetica, sans-serif;">To verify your certificate please click <a style="background-color: blue; text-decoration: none; color: white; padding: 0px 5px;" href="https://autocerti-ver.vercel.app/">here</a></p>`,
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

    await User.findByIdAndUpdate(req.user.id, { $inc: { credit: -creditsUsed } }, { new: true });

    res.status(200).json({ message: `Job successfully completed, ${creditsUsed} credits used` });
});

// @desc    Fetches the certificate details using ID
// @route   GET /api/pdf/verify/:id
// @access  Public
export const verifyCertificate = asyncHandler(async (req, res) => {
    res.status(404);
    const id = req.params.id;

    const isValidRegrexId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidRegrexId) {
        res.status(400);
        throw new Error("Invalid Certificate ID");
    }

    const cert = await Certificate.findById(id);

    if (!cert) {
        throw new Error("Invalid Certificate ID");
    } else res.status(200).json({ message: cert });
});

// @desc    Get all the certficates issued by admin
// @route   GET /api/pdf/history
// @access  Private
export const getHistory = asyncHandler(async (req, res) => {
    const history = await Certificate.find({ issuedBy: req.user.username }).sort({ _id: -1 });
    res.status(200).json({ message: history });
});
