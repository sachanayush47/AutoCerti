import fs from "fs";
import { google } from "googleapis";
const key = "./autocerti-3b574bd12097.json";

const SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.metadata",
];

const auth = new google.auth.GoogleAuth({
    keyFile: key,
    scopes: SCOPES,
});

const createAndUploadFile = async (auth) => {
    const driveService = google.drive({ version: "v3", auth });

    let fileMetaData = {
        name: "react1.pdf",
        parents: ["1jNvNJpGhCCmkr14C3Y2SNA7X4CdIkT7X"],
    };

    let media = {
        mimeType: "*/*",
        body: fs.createReadStream("react.pdf"),
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

    // if (response.status == 200) console.log("Success " + res.data.id);
    // else console.log(res);
};

createAndUploadFile(auth);
