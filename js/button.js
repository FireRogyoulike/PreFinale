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

button.addEventListener('click', () => {
    if (state) {
        let code = "";
        segmentCode.forEach((segment) => {
            const segment_src = segment.src.split('/').pop();
            const segmentIndex = segmentList.indexOf(segment_src); 
            code += segmentIndex;
    });
    console.log(code);
    sendToServer(code);
    }
});

function sendToServer(code) {
    fetch('/your-server-endpoint', {  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ message: dataString })
    })
    .then(response => response.json())  // Преобразуем ответ в JSON
    .then(data => {  
        console.log('Успех:', data);  // Выводим успешный ответ
    })
    .catch(error => {  
        console.error('Ошибка:', error);  // Выводим ошибку, если что-то пошло не так
    });
}