const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));

// Проверка на соответствие определённой строке
function validateInput(input) {
    const validCombination = "01234567"; // Определённая комбинация, с которой должен совпасть входной текст
    return input === validCombination; // Проверяем, совпадает ли input с validCombination
}

app.post('/check-code', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'No input provided' });
    }

    if (validateInput(message)) {
        return res.json({
            valid: true
        });
    } else {
        return res.json({ valid: false});
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
