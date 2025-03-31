const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const baseFolder = path.join(__dirname, 'private/wno3Glo6yZqHr4V/assets');
const effectFolder = path.join(baseFolder, 'effect');

function validateInput(input) {
    const validCombination = "01234567";
    return input === validCombination;
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
            animation: { frames: 10, frameRate: 100 }
        });
    } else {
        return res.json({ valid: false });
    }
});

function isValidFilePath(base, requested) {
    const normalizedPath = path.normalize(path.join(base, requested));
    return normalizedPath.startsWith(base);
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
    const { frame } = req.query;
    if (!frame || isNaN(frame)) {
        return res.status(400).json({ error: "Invalid frame number" });
    }

    const frameFile = `electro${frame}.png`;

    if (!isValidFilePath(effectFolder, frameFile)) {
        return res.status(403).json({ error: "Access denied" });
    }

    const filePath = path.join(effectFolder, frameFile);
    res.sendFile(filePath, (err) => {
        if (err) res.status(404).json({ error: "Frame not found" });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
