const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction = '';
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
};

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').innerText = `High Score: ${highScore}`;

const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', resetGame);

document.addEventListener('keydown', changeDirection);

const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

upButton.addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});

downButton.addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});

leftButton.addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});

rightButton.addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#00FF00' : '#FFF';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = '#000';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    if (
        snakeX < 0 || snakeX >= canvas.width || 
        snakeY < 0 || snakeY >= canvas.height || 
        collision(newHead, snake)
    ) {
        clearInterval(game);
        restartButton.style.display = 'block';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = `High Score: ${highScore}`;
        }
        return;
    }

    snake.unshift(newHead);

    ctx.fillStyle = '#FFF';
    ctx.font = '45px Arial';
    ctx.fillText(score, 2 * box, 1.5 * box);
}

function resetGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    direction = '';
    score = 0;
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
    };
    restartButton.style.display = 'none';
    game = setInterval(draw, 100);
}

let game = setInterval(draw, 100);
