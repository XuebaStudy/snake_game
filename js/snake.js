export class Snake {
    constructor(game) {
        this.game = game;
        this.cellSize = game.cellSize;
        
        this.reset();
    }
    
    reset() {
        this.body = [
            { x: 5 * this.cellSize, y: 5 * this.cellSize },
            { x: 4 * this.cellSize, y: 5 * this.cellSize },
            { x: 3 * this.cellSize, y: 5 * this.cellSize }
        ];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.growthPending = 0;
    }
    
    move() {
        // 更新方向
        this.direction = this.nextDirection;
        
        // 计算新头部位置
        const head = { ...this.body[0] };
        
        switch (this.direction) {
            case 'UP': head.y -= this.cellSize; break;
            case 'DOWN': head.y += this.cellSize; break;
            case 'LEFT': head.x -= this.cellSize; break;
            case 'RIGHT': head.x += this.cellSize; break;
        }
        
        // 添加新头部
        this.body.unshift(head);
        
        // 如果有增长，不移除尾部
        if (this.growthPending > 0) {
            this.growthPending--;
        } else {
            this.body.pop();
        }
    }
    
    grow() {
        this.growthPending += 1;
    }
    
    checkFoodCollision(food) {
        const head = this.body[0];
        return head.x === food.x && head.y === food.y;
    }
    
    checkWallCollision() {
        const head = this.body[0];
        return (
            head.x < 0 ||
            head.x >= this.game.canvas.width ||
            head.y < 0 ||
            head.y >= this.game.canvas.height
        );
    }
    
    checkSelfCollision() {
        const head = this.body[0];
        return this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }
    
    draw(ctx) {
        this.body.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#27ae60' : '#2ecc71'; // 头部和身体不同颜色
            ctx.fillRect(segment.x, segment.y, this.cellSize, this.cellSize);
            
            // 添加边框使蛇更清晰
            ctx.strokeStyle = '#16a085';
            ctx.strokeRect(segment.x, segment.y, this.cellSize, this.cellSize);
            
            // 绘制眼睛(头部)
            if (index === 0) {
                const eyeSize = this.cellSize / 5;
                const leftEye = { x: 0, y: 0 };
                const rightEye = { x: 0, y: 0 };
                
                // 根据方向确定眼睛位置
                switch(this.direction) {
                    case 'UP':
                        leftEye.x = segment.x + this.cellSize / 4;
                        leftEye.y = segment.y + this.cellSize / 4;
                        rightEye.x = segment.x + this.cellSize * 3/4 - eyeSize;
                        rightEye.y = segment.y + this.cellSize / 4;
                        break;
                    case 'DOWN':
                        leftEye.x = segment.x + this.cellSize / 4;
                        leftEye.y = segment.y + this.cellSize * 3/4 - eyeSize;
                        rightEye.x = segment.x + this.cellSize * 3/4 - eyeSize;
                        rightEye.y = segment.y + this.cellSize * 3/4 - eyeSize;
                        break;
                    case 'LEFT':
                        leftEye.x = segment.x + this.cellSize / 4;
                        leftEye.y = segment.y + this.cellSize / 4;
                        rightEye.x = segment.x + this.cellSize / 4;
                        rightEye.y = segment.y + this.cellSize * 3/4 - eyeSize;
                        break;
                    case 'RIGHT':
                        leftEye.x = segment.x + this.cellSize * 3/4 - eyeSize;
                        leftEye.y = segment.y + this.cellSize / 4;
                        rightEye.x = segment.x + this.cellSize * 3/4 - eyeSize;
                        rightEye.y = segment.y + this.cellSize * 3/4 - eyeSize;
                        break;
                }
                
                ctx.fillStyle = 'white';
                ctx.fillRect(leftEye.x, leftEye.y, eyeSize, eyeSize);
                ctx.fillRect(rightEye.x, rightEye.y, eyeSize, eyeSize);
            }
        });
    }
}