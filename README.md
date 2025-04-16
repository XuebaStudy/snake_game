

## How to run
- 根目录终端运行 `python app.py`
- 浏览器打开 localhost:8001 即可

## 关闭相关进程（以uvicorn为例，python同理）（建议正常`<CTRL>+C`关闭进程后再关闭终端，否则容易后台运行）

#### Linux
- 终端运行 `ps aux | grep uvicorn`
- 找到 uvicorn 进程的 PID，然后运行 `kill -9 PID`

#### Windows
- 终端运行 `tasklist | findstr uvicorn`
- 找到 uvicorn 进程的 PID，然后运行 `taskkill /PID PID /F`