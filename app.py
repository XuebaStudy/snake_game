from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import random
import time
import uvicorn

app = FastAPI()

# 配置模板引擎
templates = Jinja2Templates(directory="templates")

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# 游戏状态类
class GameState:
    def __init__(self):
        self.reset()
    
    def reset(self):
        self.snake = [(10, 10)]
        self.food = self.generate_food()
        self.direction = (1, 0)
        self.next_direction = (1, 0)
        self.score = 0
        self.game_over = False
        self.last_move_time = time.time()
    
    def generate_food(self):
        while True:
            food = (random.randint(0, 19), random.randint(0, 19))
            if food not in self.snake:
                return food

    def move_snake(self):
        if self.game_over:
            return {"status": "game_over"}
        
        current_time = time.time()
        if current_time - self.last_move_time < 0.15:  # 控制蛇的速度
            return {"status": "waiting"}
        
        self.last_move_time = current_time
        self.direction = self.next_direction
        
        # 计算新头部位置
        head_x, head_y = self.snake[0]
        dx, dy = self.direction
        new_head = ((head_x + dx) % 20, (head_y + dy) % 20)  # 20x20网格，支持穿墙
        
        # 检查是否撞到自己
        if new_head in self.snake:
            self.game_over = True
            return {"status": "game_over"}
        
        # 移动蛇
        self.snake.insert(0, new_head)
        
        # 检查是否吃到食物
        if new_head == self.food:
            self.score += 10
            self.food = self.generate_food()
        else:
            self.snake.pop()
        
        return {"status": "moved"}

    def change_direction(self, dx, dy):
        new_direction = (dx, dy)
        
        # 防止180度转弯
        if (new_direction[0] != -self.direction[0] or 
            new_direction[1] != -self.direction[1]):
            self.next_direction = new_direction
        
        return {"status": "success"}

    def get_state(self):
        return {
            "snake": self.snake,
            "food": self.food,
            "score": self.score,
            "game_over": self.game_over
        }

    def reset_game(self):
        self.reset()
        return {"status": "reset"}

# 全局游戏状态
game_state = GameState()

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/game_state")
async def get_game_state():
    return game_state.get_state()

@app.post("/change_direction")
async def change_direction(direction: dict):
    dx = direction.get("dx", 0)
    dy = direction.get("dy", 0)
    return game_state.change_direction(dx, dy)

@app.get("/move")
async def move_snake():
    return game_state.move_snake()

@app.get("/reset")
async def reset_game():
    return game_state.reset_game()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)