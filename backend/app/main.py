import asyncio
import contextlib
import json
import random
from contextlib import asynccontextmanager
from collections import defaultdict
from datetime import datetime
from typing import Any, DefaultDict, Dict, Set

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.udp_runtime import UdpEventStore, create_udp_server, udp_roundtrip


UDP_HOST = "127.0.0.1"
UDP_PORT = 9999


@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = asyncio.get_running_loop()
    event_store = UdpEventStore()

    def on_udp_event(event: Dict[str, Any]) -> None:
        event_store.push(event)
        loop.create_task(manager.broadcast("udp-events", event))

    transport, _protocol = await create_udp_server(loop, UDP_HOST, UDP_PORT, on_udp_event)
    app.state.udp_transport = transport
    app.state.udp_host = UDP_HOST
    app.state.udp_port = UDP_PORT
    app.state.udp_event_store = event_store
    try:
        yield
    finally:
        transport.close()


app = FastAPI(
    title="UniApp Socket Lab Backend",
    description="给 UniApp 前端的 WebSocket 和 UDP 示例页提供本地测试服务。",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def now_text() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def json_dumps(payload: Dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False)


def parse_text_payload(text: str) -> Dict[str, Any]:
    try:
        data = json.loads(text)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass
    return {"raw": text}


class ConnectionManager:
    def __init__(self) -> None:
        self.groups: DefaultDict[str, Set[WebSocket]] = defaultdict(set)

    async def connect(self, group: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.groups[group].add(websocket)

    def disconnect(self, group: str, websocket: WebSocket) -> None:
        self.groups[group].discard(websocket)
        if not self.groups[group]:
            self.groups.pop(group, None)

    async def send_json(self, websocket: WebSocket, payload: Dict[str, Any]) -> bool:
        try:
            await websocket.send_text(json_dumps(payload))
            return True
        except (WebSocketDisconnect, RuntimeError):
            return False

    async def broadcast(self, group: str, payload: Dict[str, Any]) -> None:
        stale: Set[WebSocket] = set()
        for websocket in list(self.groups.get(group, set())):
            ok = await self.send_json(websocket, payload)
            if not ok:
                stale.add(websocket)
        for websocket in stale:
            self.disconnect(group, websocket)

    def count(self, group: str) -> int:
        return len(self.groups.get(group, set()))


manager = ConnectionManager()


class UdpSendPayload(BaseModel):
    host: str = Field(default=UDP_HOST, description="目标 UDP 主机")
    port: int = Field(default=UDP_PORT, description="目标 UDP 端口")
    message: str = Field(default="", description="发送内容")
    timeout_ms: int = Field(default=1500, description="等待响应超时时间")
    expect_response: bool = Field(default=True, description="是否等待服务端响应")


@app.get("/")
async def index() -> Dict[str, Any]:
    return {
        "name": "ws-lab-backend",
        "message": "FastAPI WebSocket test backend is running.",
        "docs": "/docs",
        "health": "/health",
        "udp_status": "/udp/status",
        "scenarios": [
            "/ws/echo",
            "/ws/chat",
            "/ws/heartbeat",
            "/ws/orders",
            "/ws/ticker",
            "/ws/presence",
            "/ws/udp-events",
        ],
    }


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok", "time": now_text()}


@app.get("/scenarios")
async def scenarios() -> Dict[str, Any]:
    return {
        "items": [
            {"key": "echo", "path": "/ws/echo", "description": "基础回声测试"},
            {"key": "chat", "path": "/ws/chat", "description": "聊天室消息广播"},
            {"key": "heartbeat", "path": "/ws/heartbeat", "description": "心跳与 pong 应答"},
            {"key": "orders", "path": "/ws/orders", "description": "订单状态自动推送"},
            {"key": "ticker", "path": "/ws/ticker", "description": "价格与库存波动流"},
            {"key": "presence", "path": "/ws/presence", "description": "在线人数状态同步"},
            {"key": "udp-events", "path": "/ws/udp-events", "description": "UDP 事件实时推送"},
        ]
    }


@app.get("/udp/status")
async def udp_status() -> Dict[str, Any]:
    return {
        "host": app.state.udp_host,
        "port": app.state.udp_port,
        "event_count": app.state.udp_event_store.count(),
        "events_path": "/udp/events",
        "stream_path": "/ws/udp-events",
        "time": now_text(),
    }


@app.get("/udp/events")
async def udp_events() -> Dict[str, Any]:
    return {
        "items": app.state.udp_event_store.list(),
        "count": app.state.udp_event_store.count(),
    }


@app.post("/udp/send")
async def udp_send(payload: UdpSendPayload) -> Dict[str, Any]:
    loop = asyncio.get_running_loop()
    message = payload.message or json.dumps(
        {"type": "udp", "scene": "echo", "time": now_text()},
        ensure_ascii=False,
    )
    result = await loop.run_in_executor(
        None,
        udp_roundtrip,
        payload.host,
        payload.port,
        message,
        payload.timeout_ms if payload.expect_response else 1,
    )
    return {
        "target_host": result.target_host,
        "target_port": result.target_port,
        "sent_text": result.sent_text,
        "response_text": result.response_text,
        "response_hex": result.response_hex,
        "response_from": result.response_from,
        "timeout": result.timeout,
        "time": now_text(),
    }


@app.websocket("/ws/echo")
async def websocket_echo(websocket: WebSocket) -> None:
    await websocket.accept()
    await websocket.send_text(
        json_dumps(
            {
                "event": "welcome",
                "scene": "echo",
                "message": "echo channel connected",
                "time": now_text(),
            }
        )
    )
    try:
        while True:
            text = await websocket.receive_text()
            payload = parse_text_payload(text)
            await websocket.send_text(
                json_dumps(
                    {
                        "event": "echo",
                        "scene": "echo",
                        "received": payload,
                        "time": now_text(),
                    }
                )
            )
    except WebSocketDisconnect:
        return


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket) -> None:
    room = websocket.query_params.get("room", "support-room-01")
    await manager.connect(f"chat:{room}", websocket)
    group = f"chat:{room}"
    await manager.broadcast(
        group,
        {
            "event": "system",
            "scene": "chat",
            "roomId": room,
            "message": "有新用户加入聊天室",
            "online": manager.count(group),
            "time": now_text(),
        },
    )
    try:
        while True:
            text = await websocket.receive_text()
            payload = parse_text_payload(text)
            await manager.broadcast(
                group,
                {
                    "event": "chat",
                    "scene": "chat",
                    "roomId": room,
                    "sender": payload.get("sender", "demo-user"),
                    "text": payload.get("text", payload.get("raw", "")),
                    "time": now_text(),
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(group, websocket)
        await manager.broadcast(
            group,
            {
                "event": "system",
                "scene": "chat",
                "roomId": room,
                "message": "有用户离开聊天室",
                "online": manager.count(group),
                "time": now_text(),
            },
        )


@app.websocket("/ws/heartbeat")
async def websocket_heartbeat(websocket: WebSocket) -> None:
    await websocket.accept()
    await websocket.send_text(
        json_dumps(
            {
                "event": "ready",
                "scene": "heartbeat",
                "message": "heartbeat channel connected",
                "time": now_text(),
            }
        )
    )
    try:
        while True:
            text = await websocket.receive_text()
            payload = parse_text_payload(text)
            await websocket.send_text(
                json_dumps(
                    {
                        "event": "pong",
                        "scene": "heartbeat",
                        "echo": payload,
                        "serverTs": now_text(),
                    }
                )
            )
    except WebSocketDisconnect:
        return


async def push_order_updates(websocket: WebSocket) -> None:
    steps = ["paid", "packed", "shipping", "delivered", "signed"]
    while True:
        await asyncio.sleep(4)
        await websocket.send_text(
            json_dumps(
                {
                    "event": "order_update",
                    "scene": "orders",
                    "orderNo": "DEMO-ORDER-20260711",
                    "step": random.choice(steps),
                    "time": now_text(),
                }
            )
        )


@app.websocket("/ws/orders")
async def websocket_orders(websocket: WebSocket) -> None:
    await websocket.accept()
    task = asyncio.create_task(push_order_updates(websocket))
    await websocket.send_text(
        json_dumps(
            {
                "event": "ready",
                "scene": "orders",
                "message": "order stream connected",
                "time": now_text(),
            }
        )
    )
    try:
        while True:
            text = await websocket.receive_text()
            payload = parse_text_payload(text)
            await websocket.send_text(
                json_dumps(
                    {
                        "event": "ack",
                        "scene": "orders",
                        "received": payload,
                        "time": now_text(),
                    }
                )
            )
    except WebSocketDisconnect:
        pass
    finally:
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task


async def push_ticker_updates(websocket: WebSocket) -> None:
    while True:
        await asyncio.sleep(3)
        await websocket.send_text(
            json_dumps(
                {
                    "event": "ticker",
                    "scene": "ticker",
                    "skuId": "SKU-8801",
                    "price": random.randint(169, 239),
                    "stock": random.randint(38, 120),
                    "time": now_text(),
                }
            )
        )


@app.websocket("/ws/ticker")
async def websocket_ticker(websocket: WebSocket) -> None:
    await websocket.accept()
    task = asyncio.create_task(push_ticker_updates(websocket))
    await websocket.send_text(
        json_dumps(
            {
                "event": "ready",
                "scene": "ticker",
                "message": "ticker stream connected",
                "time": now_text(),
            }
        )
    )
    try:
        while True:
            text = await websocket.receive_text()
            payload = parse_text_payload(text)
            await websocket.send_text(
                json_dumps(
                    {
                        "event": "subscribed",
                        "scene": "ticker",
                        "received": payload,
                        "time": now_text(),
                    }
                )
            )
    except WebSocketDisconnect:
        pass
    finally:
        task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await task


@app.websocket("/ws/presence")
async def websocket_presence(websocket: WebSocket) -> None:
    room = websocket.query_params.get("room", "collab-board")
    group = f"presence:{room}"
    await manager.connect(group, websocket)
    await manager.broadcast(
        group,
        {
            "event": "presence",
            "scene": "presence",
            "roomId": room,
            "online": manager.count(group),
            "message": "用户加入房间",
            "time": now_text(),
        },
    )
    try:
        while True:
            text = await websocket.receive_text()
            payload = parse_text_payload(text)
            await manager.broadcast(
                group,
                {
                    "event": "presence_update",
                    "scene": "presence",
                    "roomId": room,
                    "online": payload.get("online", manager.count(group)),
                    "user": payload.get("user", "demo-user"),
                    "time": now_text(),
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(group, websocket)
        await manager.broadcast(
            group,
            {
                "event": "presence",
                "scene": "presence",
                "roomId": room,
                "online": manager.count(group),
                "message": "用户离开房间",
                "time": now_text(),
            },
        )


@app.websocket("/ws/udp-events")
async def websocket_udp_events(websocket: WebSocket) -> None:
    await manager.connect("udp-events", websocket)
    try:
        await websocket.send_text(
            json_dumps(
                {
                    "event": "ready",
                    "scene": "udp",
                    "message": "udp events stream connected",
                    "status_path": "/udp/status",
                    "time": now_text(),
                }
            )
        )
        await websocket.send_text(
            json_dumps(
                {
                    "event": "history",
                    "scene": "udp",
                    "items": app.state.udp_event_store.list()[:12],
                    "time": now_text(),
                }
            )
        )
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect("udp-events", websocket)
