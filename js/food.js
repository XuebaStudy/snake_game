export class Food {
    constructor(game) {
        this.game = game;
        this.cellSize = game.cellSize;
        this.x = 0;
        this.y = 0;
        this.colors = ['#e74c3c', '#e67e22', '#f1c40f', '#9b59b6'];
        this.currentColor = this.colors[0];
    }
    
    generate() {
        // 确保食物不会生成在蛇身上
        let validPosition = false;
        while (!validPosition) {
            this.x = Math.floor(Math.random() * (this.game.canvas.width / this.cellSize)) * this.cellSize;
            this.y = Math.floor(Math.random() * (this.game.canvas.height / this.cellSize)) * this.cellSize;
            
            // 检查是否与蛇重叠
            validPosition = !this.game.snake.body.some(segment => 
                segment.x === this.x && segment.y === this.y
            );
        }
        
        // 随机选择颜色
        this.currentColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    draw(ctx) {
        ctx.fillStyle = this.currentColor;
        ctx.beginPath();
        const radius = this.cellSize / 2;
        ctx.arc(this.x + radius, this.y + radius, radius - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加高光效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x + radius * 0.7, this.y + radius * 0.7, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}