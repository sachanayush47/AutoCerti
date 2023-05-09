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

export const generatePdf = asyncHandler(async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: key,
        scopes: SCOPES,
    });

    const driveService = google.drive({ version: "v3", auth });

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();
    await page.goto("http://localhost:5173/print", { waitUntil: "networkidle0" });
    const { htm, excelData, imageURL, height, width, email, password } = req.body;

    // Set page configuration
    const divDimensions = await page.evaluate(
        (imageURL, height, width) => {
            const div = document.getElementsByClassName("ql-container")[0];
            div.style.background = `url(${imageURL})`;
            div.style.backgroundSize = "contain";
            div.style.backgroundRepeat = "no-repeat";
            div.style.height = `${height}px`;
            div.style.width = `${width}px`;
            return {
                width: div.offsetWidth,
                height: div.offsetHeight,
            };
        },
        imageURL,
        height,
        width
    );

    // Get variables
    let temp = htm;
    const regex = /{([^}]+)}/g;
    const matches = [];

    let match;

    while ((match = regex.exec(temp))) {
        matches.push(match[1]);
    }

    // Generate pdf
    for (let i = 0; i < excelData.length; ++i) {
        const cert = await Certificate.create({
            issuedBy: req.user.username,
            title: "Test",
            email: excelData[i].EMAIL,
        });

        excelData[i].ID = cert._id;

        for (let j = 0; j < matches.length; ++j) {
            temp = temp.replace(`{${matches[j]}}`, excelData[i][matches[j]]);
        }

        await page.evaluate((temp) => {
            document.getElementsByClassName("ql-editor")[0].innerHTML = JSON.parse(temp);
        }, temp);

        await page.addStyleTag({
            content: `@page { size:${divDimensions.width + 2}px ${divDimensions.height + 2}px; }`,
        });

        const screenshotBuffer = await page.pdf({
            printBackground: true,
            width: `${divDimensions.width}px`,
            height: `${divDimensions.height}px`,
        });

        fs.writeFileSync(`./pdf/${excelData[i].ID}.pdf`, screenshotBuffer);

        let fileMetaData = {
            name: `${excelData[i].EMAIL}_${excelData[i].ID}.pdf`,
            parents: ["136frpnJ1zfkixypNoToaLAAkWDFhjSuu"],
        };

        let media = {
            mimeType: "*/*",
            body: fs.createReadStream(`./pdf/${excelData[i].ID}.pdf`),
        };

        let res = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: "id",
        });

        driveService.permissions.create({
            fileId: res.data.id,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const webViewLink = await driveService.files.get({
            fileId: res.data.id,
            fields: "webViewLink",
        });

        await Certificate.findByIdAndUpdate(cert.id, { url: webViewLink.data.webViewLink });

        // Send mail
        const mailOptions = {
            from: `"${req.user.name}" <${req.user.email}>`,
            to: excelData[i].EMAIL,
            subject: "You are awesome",
            text: "But dumb as well",
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

        fs.unlinkSync(`./pdf/${excelData[i].ID}.pdf`);
        temp = htm;
        console.log("Done " + excelData[i].EMAIL);
    }

    await browser.close();
    res.status(200).json({ message: "Job successfully completed." });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const cert = await Certificate.findById(id);

    if (!cert) {
        res.status(400);
        throw new Error("Invalid Certificate ID");
    } else res.json({ message: cert });
});

export const getHistory = asyncHandler(async (req, res) => {
    const history = await Certificate.find({ issuedBy: req.user.username });
    res.status(200).json({ message: history });
});
