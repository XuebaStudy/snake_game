export class Score {
    constructor() {
        this.currentScore = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.updateDisplay();
    }
    
    increase(points) {
        this.currentScore += points;
        this.updateDisplay();
    }
    
    reset() {
        this.currentScore = 0;
        this.updateDisplay();
    }
    
    updateHighScore() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = `分数: ${this.currentScore}`;
        document.getElementById('high-score').textContent = `最高分: ${this.highScore}`;
    }
}