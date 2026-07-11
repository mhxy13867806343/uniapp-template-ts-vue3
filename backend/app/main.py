import asyncio
import base64
import contextlib
import json
import random
import uuid
from contextlib import asynccontextmanager
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, DefaultDict, Dict, Set

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.udp_runtime import UdpEventStore, create_udp_server, udp_roundtrip


UDP_HOST = "127.0.0.1"
UDP_PORT = 9999
BACKEND_ROOT = Path(__file__).resolve().parents[1]
TRANSFER_ROOT = BACKEND_ROOT / "storage" / "transfer"
TRANSFER_UPLOAD_ROOT = TRANSFER_ROOT / "uploads"
TRANSFER_SAMPLE_FILE = TRANSFER_ROOT / "sample-transfer-demo.txt"
TRANSFER_SAMPLE_CHUNK_SIZE = 128 * 1024


def ensure_transfer_sample_file() -> None:
    TRANSFER_ROOT.mkdir(parents=True, exist_ok=True)
    TRANSFER_UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    if TRANSFER_SAMPLE_FILE.exists():
        return

    sample_block = (
        "UniApp transfer worker demo | chunk upload | chunk download | "
        "multi-thread like concurrency | fastapi backend | "
        "web worker preprocessing | "
        "这是一个用于分片上传下载联调的样例文件。\n"
    )
    repeated = sample_block * 9000
    TRANSFER_SAMPLE_FILE.write_text(repeated, encoding="utf-8")


def bytes_to_base64(data: bytes) -> str:
    return base64.b64encode(data).decode("utf-8")


def base64_to_bytes(data: str) -> bytes:
    return base64.b64decode(data.encode("utf-8"))


def file_checksum(data: bytes) -> int:
    return sum(data) % 1000000007


@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = asyncio.get_running_loop()
    event_store = UdpEventStore()
    ensure_transfer_sample_file()

    def on_udp_event(event: Dict[str, Any]) -> None:
        event_store.push(event)
        loop.create_task(manager.broadcast("udp-events", event))

    transport, _protocol = await create_udp_server(loop, UDP_HOST, UDP_PORT, on_udp_event)
    app.state.udp_transport = transport
    app.state.udp_host = UDP_HOST
    app.state.udp_port = UDP_PORT
    app.state.udp_event_store = event_store
    app.state.transfer_sessions = {}
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


class TransferInitPayload(BaseModel):
    filename: str = Field(default="demo-upload.txt", description="原始文件名")
    size_bytes: int = Field(default=0, description="文件大小")
    chunk_size: int = Field(default=TRANSFER_SAMPLE_CHUNK_SIZE, description="分片大小")
    total_chunks: int = Field(default=1, description="分片数量")


class TransferChunkPayload(BaseModel):
    upload_id: str = Field(description="上传会话 ID")
    index: int = Field(description="分片索引")
    data: str = Field(description="base64 编码的分片内容")


class TransferCompletePayload(BaseModel):
    upload_id: str = Field(description="上传会话 ID")


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


@app.get("/transfer/manifest")
async def transfer_manifest(chunk_size: int = TRANSFER_SAMPLE_CHUNK_SIZE) -> Dict[str, Any]:
    ensure_transfer_sample_file()
    size_bytes = TRANSFER_SAMPLE_FILE.stat().st_size
    normalized_chunk_size = max(16 * 1024, chunk_size)
    total_chunks = max(1, (size_bytes + normalized_chunk_size - 1) // normalized_chunk_size)
    return {
        "file_id": "sample-transfer-demo",
        "filename": TRANSFER_SAMPLE_FILE.name,
        "size_bytes": size_bytes,
        "chunk_size": normalized_chunk_size,
        "total_chunks": total_chunks,
        "checksum": file_checksum(TRANSFER_SAMPLE_FILE.read_bytes()),
        "download_chunk_path": "/transfer/download-chunk",
        "time": now_text(),
    }


@app.get("/transfer/download-chunk")
async def transfer_download_chunk(index: int, chunk_size: int = TRANSFER_SAMPLE_CHUNK_SIZE) -> Dict[str, Any]:
    ensure_transfer_sample_file()
    normalized_chunk_size = max(16 * 1024, chunk_size)
    file_bytes = TRANSFER_SAMPLE_FILE.read_bytes()
    total_chunks = max(1, (len(file_bytes) + normalized_chunk_size - 1) // normalized_chunk_size)

    if index < 0 or index >= total_chunks:
        return {
            "ok": False,
            "message": f"chunk index {index} out of range",
            "total_chunks": total_chunks,
            "time": now_text(),
        }

    start = index * normalized_chunk_size
    end = min(len(file_bytes), start + normalized_chunk_size)
    chunk = file_bytes[start:end]
    return {
        "ok": True,
        "index": index,
        "chunk_size": normalized_chunk_size,
        "size": len(chunk),
        "total_chunks": total_chunks,
        "filename": TRANSFER_SAMPLE_FILE.name,
        "data": bytes_to_base64(chunk),
        "time": now_text(),
    }


@app.post("/transfer/upload/init")
async def transfer_upload_init(payload: TransferInitPayload) -> Dict[str, Any]:
    upload_id = uuid.uuid4().hex[:16]
    upload_dir = TRANSFER_UPLOAD_ROOT / upload_id
    upload_dir.mkdir(parents=True, exist_ok=True)

    app.state.transfer_sessions[upload_id] = {
        "upload_id": upload_id,
        "filename": payload.filename,
        "size_bytes": payload.size_bytes,
        "chunk_size": payload.chunk_size,
        "total_chunks": payload.total_chunks,
        "received_chunks": set(),
        "upload_dir": str(upload_dir),
        "merged_path": "",
        "created_at": now_text(),
    }

    return {
        "upload_id": upload_id,
        "filename": payload.filename,
        "total_chunks": payload.total_chunks,
        "chunk_size": payload.chunk_size,
        "time": now_text(),
    }


@app.post("/transfer/upload/chunk")
async def transfer_upload_chunk(payload: TransferChunkPayload) -> Dict[str, Any]:
    session = app.state.transfer_sessions.get(payload.upload_id)
    if not session:
        return {
            "ok": False,
            "message": "upload session not found",
            "time": now_text(),
        }

    upload_dir = Path(session["upload_dir"])
    part_path = upload_dir / f"{payload.index:06d}.part"
    chunk_bytes = base64_to_bytes(payload.data)
    part_path.write_bytes(chunk_bytes)
    session["received_chunks"].add(payload.index)

    return {
        "ok": True,
        "upload_id": payload.upload_id,
        "index": payload.index,
        "received_count": len(session["received_chunks"]),
        "total_chunks": session["total_chunks"],
        "chunk_size": len(chunk_bytes),
        "time": now_text(),
    }


@app.get("/transfer/upload/status/{upload_id}")
async def transfer_upload_status(upload_id: str) -> Dict[str, Any]:
    session = app.state.transfer_sessions.get(upload_id)
    if not session:
        return {
            "ok": False,
            "message": "upload session not found",
            "time": now_text(),
        }

    return {
        "ok": True,
        "upload_id": upload_id,
        "filename": session["filename"],
        "received_count": len(session["received_chunks"]),
        "total_chunks": session["total_chunks"],
        "size_bytes": session["size_bytes"],
        "merged_path": session["merged_path"],
        "created_at": session["created_at"],
        "time": now_text(),
    }


@app.post("/transfer/upload/complete")
async def transfer_upload_complete(payload: TransferCompletePayload) -> Dict[str, Any]:
    session = app.state.transfer_sessions.get(payload.upload_id)
    if not session:
        return {
            "ok": False,
            "message": "upload session not found",
            "time": now_text(),
        }

    total_chunks = session["total_chunks"]
    missing = [index for index in range(total_chunks) if index not in session["received_chunks"]]
    if missing:
        return {
            "ok": False,
            "message": "missing chunks",
            "missing": missing[:12],
            "time": now_text(),
        }

    upload_dir = Path(session["upload_dir"])
    merged_path = upload_dir / f"merged-{session['filename']}"
    with merged_path.open("wb") as merged_file:
        for index in range(total_chunks):
            part_path = upload_dir / f"{index:06d}.part"
            merged_file.write(part_path.read_bytes())

    merged_bytes = merged_path.read_bytes()
    session["merged_path"] = str(merged_path)

    return {
        "ok": True,
        "upload_id": payload.upload_id,
        "filename": session["filename"],
        "merged_size": len(merged_bytes),
        "checksum": file_checksum(merged_bytes),
        "merged_path": str(merged_path),
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
