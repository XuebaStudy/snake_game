const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let snake = [];
let food = [];
let gameOver = false;

// 初始化游戏板
function initGameBoard() {
    gameBoard.innerHTML = '';
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${x}-${y}`;
            gameBoard.appendChild(cell);
        }
    }
}

// 渲染游戏状态
function renderGame() {
    // 清除所有单元格
    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
    });
    
    // 渲染蛇
    snake.forEach((segment, index) => {
        const [x, y] = segment;
        const cell = document.getElementById(`cell-${x}-${y}`);
        if (cell) {
            cell.classList.add('snake');
            if (index === 0) cell.classList.add('snake-head');
        }
    });
    
    // 渲染食物
    const [foodX, foodY] = food;
    const foodCell = document.getElementById(`cell-${foodX}-${foodY}`);
    if (foodCell) foodCell.classList.add('food');
}

// 获取游戏状态
async function updateGameState() {
    const response = await fetch('/game_state');
    const data = await response.json();
    snake = data.snake;
    food = data.food;
    scoreElement.textContent = data.score;
    gameOver = data.game_over;
    
    if (gameOver) {
        finalScoreElement.textContent = data.score;
        gameOverElement.style.display = 'block';
    } else {
        gameOverElement.style.display = 'none';
    }
    
    renderGame();
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    let dx = 0, dy = 0;
    
    switch(e.key) {
        case 'ArrowUp':    dy = -1; break;
        case 'ArrowDown':  dy = 1; break;
        case 'ArrowLeft':  dx = -1; break;
        case 'ArrowRight': dx = 1; break;
        default: return; // 忽略其他按键
    }
    
    fetch('/change_direction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({dx, dy})
    });
});

// 重新开始游戏
restartBtn.addEventListener('click', () => {
    fetch('/reset')
        .then(() => {
            updateGameState();
        });
});

// 游戏循环
function gameLoop() {
    if (!gameOver) {
        fetch('/move')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'game_over') {
                    gameOver = true;
                }
            });
    }
    
    updateGameState();
    setTimeout(gameLoop, 100);
}

// 初始化游戏
initGameBoard();
updateGameState();
gameLoop();