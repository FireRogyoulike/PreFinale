export const segmentList = [
    'black.png',
    'brown.png',
    'red.png',
    'orange.png',
    'yellow.png',
    'green.png',
    'blue.png',
    'purple.png'
]

const segments = document.querySelectorAll('.segment')

segments.forEach(sprite => {
    sprite.addEventListener('click', () => {
        
        let currentSegment = sprite.src.split('/').pop().split('?')[0]; // Имя файла
        let currentIndex = segmentList.indexOf(currentSegment);

        // Следующий индекс, циклически
        let nextIndex = (currentIndex + 1) % segmentList.length;

        // Добавление "assets/" к пути и смена изображения
        sprite.src = 'assets/' + segmentList[nextIndex];
    });
});
