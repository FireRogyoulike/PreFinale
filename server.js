const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const baseFolder = path.join(__dirname, 'private/wno3Glo6yZqHr4V/assets');

function validateInput(input) {
    const validCombination = "46572301";
    return input.length === validCombination.length && input === validCombination;
}

app.post('/check-code', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'No input provided' });
    }

    if (validateInput(message)) {
        return res.json({
            valid: true,
            door: "doorsOpened.png",
            doorsStyle: { right: "324px", top: "50px" },
            red_button: "redButton.png",
            red_button_pressed: "redButtonPressed.png",
            buttonStyle: { right: "364px", top: "50px" },
            effectStyle: { left: "122px", top: "52px" },
            animStyle: { left: "462px", bottom: "78px" },
        });
    } else {
        return res.json({ valid: false });
    }
});

function isValidFilePath(base, requested) {
    const normalizedPath = path.resolve(base, requested);
    return normalizedPath.startsWith(base + path.sep);
}

app.get('/get-image', (req, res) => {
    const { file } = req.query;
    if (!file || !isValidFilePath(baseFolder, file)) {
        return res.status(403).json({ error: "Access denied" });
    }
    const filePath = path.join(baseFolder, file);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: "File not found" });
    });
});

app.get('/get-frame', (req, res) => {
    const { frame, type } = req.query;
    if (!frame || isNaN(frame) || !type) {
        return res.status(400).json({ error: "Invalid frame number or missing type" });
    }

    let folderPath;
    let fileName;

    if (type === "effect") {
        folderPath = path.join(baseFolder, 'effect');
        fileName = `electro${frame}.png`;
    } else if (type === "anim") {
        folderPath = path.join(baseFolder, 'anim');
        fileName = `flyСharged${frame}.png`;
    } else {
        return res.status(400).json({ error: "Invalid animation type" });
    }

    if (!isValidFilePath(folderPath, fileName)) {
        return res.status(403).json({ error: "Access denied" });
    }

    const filePath = path.join(folderPath, fileName);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: "Frame not found" });
    });
});

// Новый эндпоинт, отдающий список безопасных путей к кадрам
app.get('/get-animation', (req, res) => {
    const { type } = req.query;
    if (!type || !['effect', 'anim'].includes(type)) {
        return res.status(400).json({ error: "Invalid animation type" });
    }

    let frameCount;
    if (type === "effect") {
        frameCount = 10;
    } else {
        frameCount = 12;
    }

    // Отдаём безопасные URL, которые всё равно идут через /get-frame
    const frames = [];
    for (let i = 0; i < frameCount; i++) {
        frames.push(`/get-frame?frame=${i}&type=${type}`);
    }

    res.json({ frames });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
