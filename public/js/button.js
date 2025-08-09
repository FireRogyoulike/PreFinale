import { segmentList } from './segments.js';
import { state } from './visibility.js';

const button = document.getElementById("button");
const segmentCode = [
    document.getElementById("segment_1"),
    document.getElementById("segment_2"),
    document.getElementById("segment_3"),
    document.getElementById("segment_4"),
    document.getElementById("segment_5"),
    document.getElementById("segment_6"),
    document.getElementById("segment_7"),
    document.getElementById("segment_8"),
];

const defaultButtonSrc = button.src;
const successButtonSrc = "assets/buttonGreen.png";
const errorButtonSrc = "assets/buttonRed.png";

let isButtonActive = true;
let preloadedEffectFrames = [];
let preloadedAnimFrames = [];

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

function changeButtonSprite(isWillDelete, newSrc) {
    button.src = newSrc;
    button.style.pointerEvents = "none";
    setTimeout(() => {
        if (isWillDelete){
            document.querySelectorAll('.hidden').forEach(element => element.remove());
        } else {
            button.src = defaultButtonSrc;
            button.style.pointerEvents = "auto";
            isButtonActive = true;
        }
    }, 800);
}

// Новый вариант предзагрузки
function preloadAnimationFrames(type) {
    return fetch(`/get-animation?type=${type}`)
        .then(res => res.json())
        .then(data => {
            if (!data.frames) throw new Error(`No frames for type ${type}`);
            return Promise.all(
                data.frames.map(src => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = () => reject(new Error(`Failed to load ${src}`));
                        img.src = src;
                    });
                })
            );
        });
}

function applyChanges(doorFile, doorsStyle, buttonSrc, buttonPressedSrc, buttonStyle, effectStyle, animStyle) {
    const doors = document.getElementById("doors");
    const doorZ = window.getComputedStyle(doors).getPropertyValue('z-index');

    const effect = document.createElement("img");
    effect.id = "effect";
    effect.classList.add("pixel-art");
    Object.assign(effect.style, effectStyle);
    document.getElementById("flex-container").appendChild(effect);

    const anim = document.createElement("img");
    anim.id = "anim";
    anim.classList.add("pixel-art");
    Object.assign(anim.style, animStyle);
    document.getElementById("flex-container").appendChild(anim);

    const redButton = document.createElement("img");
    redButton.id = "red_button";
    redButton.src = `/get-image?file=${buttonSrc}`;
    redButton.style.zIndex = parseInt(doorZ) - 1;
    redButton.classList.add("pixel-art");
    Object.assign(redButton.style, buttonStyle);
    redButton.style.pointerEvents = 'none';
    
    Promise.all([
        preloadAnimationFrames('effect').then(frames => { preloadedEffectFrames = frames; }),
        preloadAnimationFrames('anim').then(frames => { preloadedAnimFrames = frames; })
    ]).then(() => {
        redButton.style.pointerEvents = 'auto';
        redButton.addEventListener("click", function() {
            redButton.src = "/get-image?file=" + buttonPressedSrc;
            startEffect();
            setTimeout(() => {
                redButton.src = "/get-image?file=" + buttonSrc;
            }, 1000);
        });
    }).catch(error => {
        console.error('Ошибка загрузки кадров:', error);
        redButton.style.pointerEvents = 'auto';
    });

    redButton.onload = function() {
        doors.src = `/get-image?file=${doorFile}`;
        Object.assign(doors.style, doorsStyle);
    }
    
    document.getElementById("flex-container").appendChild(redButton);

    const frameRate = 100;
    let animationPlayed = false;

    function startEffect() {
        if (animationPlayed) return;
        animationPlayed = true;
        let currentFrame = 0;
        const interval = setInterval(() => {
            if (currentFrame >= preloadedEffectFrames.length) {
                clearInterval(interval);
                effect.remove();
                startSecondAnimation();
                return;
            }
            effect.src = preloadedEffectFrames[currentFrame].src;
            currentFrame++;
        }, frameRate);
    }

    function startSecondAnimation() {
        let currentFrame = 0;
        document.getElementById("fly").remove();
        const interval = setInterval(() => {
            if (currentFrame >= preloadedAnimFrames.length) {
                clearInterval(interval);
                anim.remove();
                return;
            }
            anim.src = preloadedAnimFrames[currentFrame].src;
            currentFrame++;
        }, frameRate);
    }
}
