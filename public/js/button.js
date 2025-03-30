import { segmentList } from './segments.js';
import { state } from './visibility.js';

const button = document.getElementById("button")
const segmentCode = [
    document.getElementById("segment_1"),
    document.getElementById("segment_2"),
    document.getElementById("segment_3"),
    document.getElementById("segment_4"),
    document.getElementById("segment_5"),
    document.getElementById("segment_6"),
    document.getElementById("segment_7"),
    document.getElementById("segment_8"),
]

const defaultButtonSrc = button.src; // Исходное изображение кнопки
const successButtonSrc = "assets/button_green.png"; // Изображение при успешном ответе
const errorButtonSrc = "assets/button_red.png"; // Изображение при ошибке

let isButtonActive = true; // Флаг активности кнопки

button.addEventListener('click', () => {
    if (state && isButtonActive) {
        isButtonActive = false;
        let code = "";
        segmentCode.forEach((segment) => {
            const segment_src = segment.src.split('/').pop();
            const segmentIndex = segmentList.indexOf(segment_src);
            code += segmentIndex;
        });
        sendToServer(code);
    }
});

function sendToServer(code) {
    fetch('/check-code', {  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ message: code })
    })
    .then(response => response.json())
    .then(data => {  
        console.log('Ответ сервера:', data);

        if (data.valid) {
            changeButtonSprite(successButtonSrc);
        } else {
            changeButtonSprite(errorButtonSrc);
        }
    })
    .catch(error => {  
        console.error('Ошибка:', error);
        changeButtonSprite(errorButtonSrc);
    });
}

// Функция смены спрайта кнопки
function changeButtonSprite(newSrc) {
    button.src = newSrc;
    button.style.pointerEvents = "none"; // Блокируем кнопку
    setTimeout(() => {
        button.src = defaultButtonSrc; // Возвращение кнопки в исходное состояние
        button.style.pointerEvents = "auto"; // Разблокировка кнопки
        isButtonActive = true; // Кнопка снова активна
    }, 800);
}