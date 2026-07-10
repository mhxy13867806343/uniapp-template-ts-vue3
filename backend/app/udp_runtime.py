import asyncio
import json
import socket
from collections import deque
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Deque, Dict, List, Optional, Tuple


def now_text() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def decode_payload(data: bytes) -> Dict[str, Any]:
    text = data.decode("utf-8", errors="replace")
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        parsed = None
    return {
        "text": text,
        "hex": data.hex(),
        "size": len(data),
        "json": parsed if isinstance(parsed, dict) else None,
    }


@dataclass
class UdpSendResult:
    target_host: str
    target_port: int
    sent_text: str
    response_text: Optional[str]
    response_hex: Optional[str]
    response_from: Optional[str]
    timeout: bool


class UdpEventStore:
    def __init__(self, limit: int = 80) -> None:
        self._events: Deque[Dict[str, Any]] = deque(maxlen=limit)

    def push(self, payload: Dict[str, Any]) -> None:
        self._events.appendleft(payload)

    def list(self) -> List[Dict[str, Any]]:
        return list(self._events)

    def count(self) -> int:
        return len(self._events)


class UdpEchoProtocol(asyncio.DatagramProtocol):
    def __init__(self, on_event) -> None:
        self.transport: Optional[asyncio.DatagramTransport] = None
        self.on_event = on_event

    def connection_made(self, transport: asyncio.BaseTransport) -> None:
        self.transport = transport  # type: ignore[assignment]

    def datagram_received(self, data: bytes, addr: Tuple[str, int]) -> None:
        payload = decode_payload(data)
        event = {
            "event": "udp_received",
            "scene": "udp",
            "from_host": addr[0],
            "from_port": addr[1],
            "payload": payload,
            "time": now_text(),
        }
        self.on_event(event)

        if self.transport:
            ack = json.dumps(
                {
                    "event": "udp_ack",
                    "message": "packet received",
                    "received": payload["text"],
                    "time": now_text(),
                },
                ensure_ascii=False,
            ).encode("utf-8")
            self.transport.sendto(ack, addr)

    def error_received(self, exc: Exception) -> None:
        self.on_event(
            {
                "event": "udp_error",
                "scene": "udp",
                "message": str(exc),
                "time": now_text(),
            }
        )


async def create_udp_server(loop: asyncio.AbstractEventLoop, host: str, port: int, on_event):
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: UdpEchoProtocol(on_event),
        local_addr=(host, port),
    )
    return transport, protocol


def udp_roundtrip(host: str, port: int, message: str, timeout_ms: int = 1500) -> UdpSendResult:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.bind(("127.0.0.1", 0))
        sock.settimeout(timeout_ms / 1000)
        payload = message.encode("utf-8")
        sock.sendto(payload, (host, port))
        try:
            data, addr = sock.recvfrom(4096)
            return UdpSendResult(
                target_host=host,
                target_port=port,
                sent_text=message,
                response_text=data.decode("utf-8", errors="replace"),
                response_hex=data.hex(),
                response_from=f"{addr[0]}:{addr[1]}",
                timeout=False,
            )
        except socket.timeout:
            return UdpSendResult(
                target_host=host,
                target_port=port,
                sent_text=message,
                response_text=None,
                response_hex=None,
                response_from=None,
                timeout=True,
            )
