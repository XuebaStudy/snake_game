import { Snake } from './snake.js';
import { Food } from './food.js';
import { setupInput } from './input.js';
import { Score } from './score.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        this.cellSize = 20;
        this.gameSpeed = 150; // 毫秒
        
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.score = new Score();
        
        this.gameOver = false;
        this.isPaused = false;
        this.gameLoopId = null;
        
        this.init();
    }
    
    init() {
        // 设置输入控制
        setupInput(this);
        
        // 按钮事件
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        
        // 初始绘制
        this.drawGrid();
        this.food.generate();
    }
    
    startGame() {
        if (this.gameLoopId) return;
        
        this.gameOver = false;
        document.getElementById('game-over').classList.add('hidden');
        this.gameLoop();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pause-btn');
        btn.textContent = this.isPaused ? '继续' : '暂停';
    }
    
    restartGame() {
        clearInterval(this.gameLoopId);
        this.gameLoopId = null;
        
        this.snake.reset();
        this.food.generate();
        this.score.reset();
        
        document.getElementById('game-over').classList.add('hidden');
        this.gameOver = false;
        this.isPaused = false;
        
        this.startGame();
    }
    
    gameLoop() {
        this.gameLoopId = setInterval(() => {
            if (this.isPaused || this.gameOver) return;
            
            this.update();
            this.draw();
        }, this.gameSpeed);
    }
    
    update() {
        this.snake.move();
        
        // 检查是否吃到食物
        if (this.snake.checkFoodCollision(this.food)) {
            this.snake.grow();
            this.food.generate();
            this.score.increase(10);
        }
        
        // 检查碰撞
        if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
            this.endGame();
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.food.draw(this.ctx);
        this.snake.draw(this.ctx);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;
        
        // 垂直网格线
        for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平网格线
        for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    endGame() {
        clearInterval(this.gameLoopId);
        this.gameLoopId = null;
        this.gameOver = true;
        
        document.getElementById('final-score').textContent = this.score.currentScore;
        document.getElementById('game-over').classList.remove('hidden');
        
        this.score.updateHighScore();
    }
}

// 启动游戏
const game = new Game();