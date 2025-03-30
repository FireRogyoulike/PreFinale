const lock = document.getElementById("doors");
const hidden = document.querySelectorAll('.hidden');
export let state = false;

// Переключает интерфейс
lock.addEventListener('click', () => {
    if (state) {
        hidden.forEach(sprite => {
            sprite.style.display = 'none';
        });
    } else {
        hidden.forEach(sprite => {
            sprite.style.display = 'block';
        });
    }
    state = !state;
});














