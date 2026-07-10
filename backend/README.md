# FastAPI WebSocket 测试后端

这个目录和 `src` 同级，专门给前端的 `pages/framework/websocket` 做本地联调。

## 目录

- `app/main.py`：FastAPI 应用入口
- `requirements.txt`：依赖清单

## 安装

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 启动

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## 可用地址

- 健康检查：`http://127.0.0.1:8001/health`
- 文档：`http://127.0.0.1:8001/docs`

## WebSocket 场景

- `ws://127.0.0.1:8001/ws/echo`
- `ws://127.0.0.1:8001/ws/chat`
- `ws://127.0.0.1:8001/ws/heartbeat`
- `ws://127.0.0.1:8001/ws/orders`
- `ws://127.0.0.1:8001/ws/ticker`
- `ws://127.0.0.1:8001/ws/presence`
