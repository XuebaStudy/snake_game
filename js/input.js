export function setupInput(game) {
    document.addEventListener('keydown', (e) => {
        if (game.isPaused || game.gameOver) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (game.snake.direction !== 'DOWN') game.snake.nextDirection = 'UP';
                break;
            case 'ArrowDown':
                if (game.snake.direction !== 'UP') game.snake.nextDirection = 'DOWN';
                break;
            case 'ArrowLeft':
                if (game.snake.direction !== 'RIGHT') game.snake.nextDirection = 'LEFT';
                break;
            case 'ArrowRight':
                if (game.snake.direction !== 'LEFT') game.snake.nextDirection = 'RIGHT';
                break;
            case ' ':
                game.togglePause();
                break;
        }
    });
    
    // 触摸控制 (移动端支持)
    let touchStartX = 0;
    let touchStartY = 0;
    
    game.canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    game.canvas.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY || game.isPaused || game.gameOver) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // 确定主要滑动方向
        if (Math.abs(dx) > Math.abs(dy)) {
            // 水平滑动
            if (dx > 0 && game.snake.direction !== 'LEFT') {
                game.snake.nextDirection = 'RIGHT';
            } else if (dx < 0 && game.snake.direction !== 'RIGHT') {
                game.snake.nextDirection = 'LEFT';
            }
        } else {
            // 垂直滑动
            if (dy > 0 && game.snake.direction !== 'UP') {
                game.snake.nextDirection = 'DOWN';
            } else if (dy < 0 && game.snake.direction !== 'DOWN') {
                game.snake.nextDirection = 'UP';
            }
        }
        
        // 重置起点
        touchStartX = 0;
        touchStartY = 0;
        e.preventDefault();
    }, false);
}