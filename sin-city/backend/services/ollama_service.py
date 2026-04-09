import httpx
import json
from typing import AsyncGenerator
import os

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL = os.getenv("OLLAMA_MODEL", "llama3")


async def stream_ollama(prompt: str) -> AsyncGenerator[str, None]:
    """Stream tokens from Ollama local LLM."""
    async with httpx.AsyncClient(timeout=120) as client:
        try:
            async with client.stream("POST", OLLAMA_URL, json={
                "model": MODEL,
                "prompt": prompt,
                "stream": True,
            }) as response:
                async for line in response.aiter_lines():
                    if line:
                        data = json.loads(line)
                        if not data.get("done"):
                            yield data.get("response", "")
        except (httpx.ConnectError, httpx.ReadTimeout):
            # Ollama not available — yield nothing, fallback will handle it
            yield ""


async def generate_ollama(prompt: str) -> str:
    """Non-streaming generation from Ollama."""
    result = []
    async for token in stream_ollama(prompt):
        result.append(token)
    return "".join(result)
