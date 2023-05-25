import fs from "fs";

QRCode.toFile(
    "file.png",
    "https://code-daily.vercel.app/645b622e4ad4e084031c823b",
    {
        errorCorrectionLevel: "H",
    },
    function (err) {
        if (err) throw err;
        const image = fs.readFileSync("./file.png");
        const imageData = image.toString("base64");
        const dataUrl = `data:image/png;base64,${imageData}`;
        console.log(dataUrl);

        console.log("QR code saved!");
    }
);
