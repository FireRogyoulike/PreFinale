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
const successButtonSrc = "assets/buttonGreen.png"; // Изображение при успешном ответе
const errorButtonSrc = "assets/buttonRed.png"; // Изображение при ошибке

let isButtonActive = true; 

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
        if (data.valid) {
            changeButtonSprite(data.valid, successButtonSrc);
            applyChanges(data.door, data.doorsStyle, data.red_button, data.red_button_pressed, data.buttonStyle, data.effectStyle, data.animStyle);
        } else {
            changeButtonSprite(data.valid, errorButtonSrc);
        }
    })
    .catch(error => {  
        console.error('Ошибка:', error);
    });
}

// Функция смены спрайта кнопки
function changeButtonSprite(isWillDelete, newSrc) {
    button.src = newSrc;
    button.style.pointerEvents = "none";
    setTimeout(() => {
        if (isWillDelete){
            document.querySelectorAll('.hidden').forEach(element => element.remove());
        } else {
        button.src = defaultButtonSrc; // Возвращение кнопки в исходное состояние
        button.style.pointerEvents = "auto"; // Разблокировка кнопки
        isButtonActive = true; // Кнопка снова активна
        }
    }, 800);
}

// Применение серверных изменений
function applyChanges(doorFile, doorsStyle, buttonSrc, buttonPressedSrc, buttonStyle, effectStyle, animStyle) {
    const doors = document.getElementById("doors");
    const doorZ = window.getComputedStyle(doors).getPropertyValue('z-index');

    // Эффект
    const effect = document.createElement("img");
    effect.id = "effect";
    effect.classList.add("pixel-art");
    for (const style in effectStyle) {
        if (effectStyle.hasOwnProperty(style)) {
            effect.style[style] = effectStyle[style];
        }
    }
    document.getElementById("flex-container").appendChild(effect);

    // Анимация
    const anim = document.createElement("img");
    anim.id = "anim";
    anim.classList.add("pixel-art");
    for (const style in animStyle) {
        if (animStyle.hasOwnProperty(style)) {
            anim.style[style] = animStyle[style];
        }
    }
    document.getElementById("flex-container").appendChild(anim);

    // Красная кнопка
    const redButton = document.createElement("img");
    redButton.id = "red_button";
    redButton.src = `/get-image?file=${buttonSrc}`;
    redButton.style.zIndex = parseInt(doorZ) - 1;
    redButton.classList.add("pixel-art");
    for (const style in buttonStyle) {
        if (buttonStyle.hasOwnProperty(style)) {
            redButton.style[style] = buttonStyle[style];
        }
    }
    
    // Отложенная загрузка двери, что бы кнопка прогрузилась
    redButton.onload = function() {
        doors.src = `/get-image?file=${doorFile}`;
        for (const style in doorsStyle) {
            if (doorsStyle.hasOwnProperty(style)) {
                doors.style[style] = doorsStyle[style]; 
            }
        }
    }
    
    // Анимация красной кнопки
    redButton.addEventListener("click", function () {
        redButton.src = "/get-image?file=" + buttonPressedSrc;
        startEffect();
        setTimeout(() => {
            redButton.src = "/get-image?file=" + buttonSrc;
        }, 1000);
    });

    document.getElementById("flex-container").appendChild(redButton);

    const frameRate = 100;
    // Обработка анимации эффекта
    let animationPlayed = false;

    function startEffect() {
        const effectframeCount = 10; 
        if (animationPlayed) return;
        const effect = document.getElementById("effect");
    
        let currentFrame = 0;
    
        const animationInterval = setInterval(() => {
            if (currentFrame >= effectframeCount) {
                clearInterval(animationInterval);
                effect.remove();
                startSecondAnimation();
                return;
            }
            
            effect.src = `/get-frame?frame=${currentFrame}&type=effect`;
            currentFrame++;
        }, frameRate);
    }

    function startSecondAnimation() {
        
        let currentFrame = 0;
        const animFrameCount = 12; 
        
        document.getElementById("fly").remove();

        const animationInterval = setInterval(() => {
            if (currentFrame >= animFrameCount) {
                clearInterval(animationInterval);
                anim.remove();
                return;
            }
    
            anim.src = `/get-frame?frame=${currentFrame}&type=anim`;
            currentFrame++;
        }, frameRate);
    }
}