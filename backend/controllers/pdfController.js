import puppeteer from "puppeteer";
import fs from "fs";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
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
        top,
        left,
        size,
    } = req.body;

    if (!(htm && excelData && imageURL && height && email && password && title)) {
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
        const cert = await Certificate.create({
            issuedBy: req.user.username,
            title: title,
            email: excelData[i].EMAIL,
        });

        excelData[i].ID = cert._id;

        for (let j = 0; j < matches.length; ++j) {
            temp = temp.replace(`{${matches[j]}}`, excelData[i][matches[j]]);
        }

        await page.evaluate(
            (temp, excelDataRow, top, left, size) => {
                document.getElementsByClassName("ql-editor")[0].innerHTML = JSON.parse(temp);

                const photoid = document.getElementById("photoid");

                if (!photoid) {
                    console.log("Missing photo");
                    return;
                }

                const idUrl = excelDataRow.PHOTOID.split("=")[1];
                photoid.src = `https://lh3.googleusercontent.com/d/${idUrl}`;
                console.log(`https://lh3.googleusercontent.com/d/${idUrl}`);
                photoid.style.top = `${top}px`;
                photoid.style.left = `${left}px`;
                photoid.style.height = `${size}px`;
                photoid.style.width = `${size}px`;
            },
            temp,
            excelData[i],
            top,
            left,
            size
        );

        // Waiting for PhotoID to load.
        await page.waitForFunction(imagesHaveLoaded);

        // Setting PDF page width and height
        await page.addStyleTag({
            content: `@page { size:${divDimensions.width + 2}px ${divDimensions.height + 2}px; }`,
        });

        // Creates PDF
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

        // Updating PDF in the databse.
        await Certificate.findByIdAndUpdate(cert.id, { url: webViewLink.data.webViewLink });

        // Sending mail to the certificate holder
        const mailOptions = {
            from: `"${req.user.name}" <${req.user.email}>`,
            to: excelData[i].EMAIL,
            subject: title,
            // text: "But dumb as well",
            html: `<a href=${webViewLink.data.webViewLink}>Download</a>`,
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
    const history = await Certificate.find({ issuedBy: req.user.username });
    res.status(200).json({ message: history });
});
