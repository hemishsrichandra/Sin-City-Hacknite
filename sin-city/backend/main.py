from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models.schemas import PlannerRequest
from agent.graph import run_planner_agent
import json

app = FastAPI(title="Sin City AI Planner", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/plan")
async def generate_plan(request: PlannerRequest):
    """Generate a personalized Sin City itinerary via streaming SSE."""
    async def stream():
        async for chunk in run_planner_agent(request):
            yield f"data: {json.dumps({'text': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "alive", "agent": "sin-city-concierge-v1"}
