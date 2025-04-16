from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import random
import time
import uvicorn
from uuid import uuid4

app = FastAPI()

# 配置模板引擎
templates = Jinja2Templates(directory="templates")

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")

# 存储每个用户的游戏状态
game_states = {}

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

class Direction(BaseModel):
    dx: int
    dy: int

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = str(uuid4())
        game_states[session_id] = GameState()
    response = templates.TemplateResponse("index.html", {"request": request})
    response.set_cookie("session_id", session_id)
    return response

@app.get("/game_state")
async def get_game_state(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in game_states:
        raise HTTPException(status_code=404, detail="Game not found")
    game_state = game_states[session_id]
    return {
        "snake": game_state.snake,
        "food": game_state.food,
        "score": game_state.score,
        "game_over": game_state.game_over
    }

@app.post("/change_direction")
async def change_direction(direction: Direction, request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in game_states:
        raise HTTPException(status_code=404, detail="Game not found")
    game_state = game_states[session_id]
    new_direction = (direction.dx, direction.dy)
    
    # 防止180度转弯
    if (new_direction[0] != -game_state.direction[0] or 
        new_direction[1] != -game_state.direction[1]):
        game_state.next_direction = new_direction
    
    return {"status": "success"}

@app.get("/move")
async def move_snake(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in game_states:
        raise HTTPException(status_code=404, detail="Game not found")
    game_state = game_states[session_id]
    if game_state.game_over:
        raise HTTPException(status_code=400, detail="Game Over")
    
    current_time = time.time()
    if current_time - game_state.last_move_time < 0.15:  # 控制蛇的速度
        return {"status": "waiting"}
    
    game_state.last_move_time = current_time
    game_state.direction = game_state.next_direction
    
    # 计算新头部位置
    head_x, head_y = game_state.snake[0]
    dx, dy = game_state.direction
    new_head = ((head_x + dx) % 20, (head_y + dy) % 20)  # 20x20网格，支持穿墙
    
    # 检查是否撞到自己
    if new_head in game_state.snake:
        game_state.game_over = True
        return {"status": "game_over"}
    
    # 移动蛇
    game_state.snake.insert(0, new_head)
    
    # 检查是否吃到食物
    if new_head == game_state.food:
        game_state.score += 10
        game_state.food = game_state.generate_food()
    else:
        game_state.snake.pop()
    
    return {"status": "moved"}

@app.get("/reset")
async def reset_game(request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id or session_id not in game_states:
        raise HTTPException(status_code=404, detail="Game not found")
    game_states[session_id].reset()
    return {"status": "reset"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)