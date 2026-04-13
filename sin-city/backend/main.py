from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models.schemas import PlannerRequest, UserCreate, UserLogin, TokenResponse, SyncStoreRequest, UserResponse, Booking, EscapeRequest, EscapeResponse
from agent.graph import run_planner_agent
import json
import random
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models.schemas import UserResponse
from services.auth import get_password_hash, verify_password, create_access_token, decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    db = get_db()
    user = await db.users.find_one({"username": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

app = FastAPI(title="Sin City AI Planner", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for cross-device access
    allow_credentials=False,  # Must be False when allow_origins=["*"]
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


@app.post("/api/escape", response_model=EscapeResponse)
async def getaway_grid_v3(request: EscapeRequest):
    """
    AI-driven game engine for 'Sin City Escape' (Grid Based).
    Calculates routes and narrates the chase in Noir style.
    """
    import google.generativeai as genai
    
    master_prompt = f"""
    You are the narrator and AI engine of "Sin City Escape" — a fictional city simulation game. 
    The player is navigating a neon-lit, fictional metropolis called "Nova Inferno."

    GAME STATE (GRID COORDINATES X, Y):
    - Player Grid Pos: ({request.player_x}, {request.player_y})
    - Extraction Point: ({request.dest_x}, {request.dest_y})
    - Heat Level: {request.heat_level}
    - Police Grid Positions: {request.police_positions}

    Your job is to:
    1. Provide real-time escape route narration in a dramatic noir style.
    2. Suggest a tactical route (array of grid waypoints) to avoid current police positions.
    3. Update the heat level (1-5) based on the proximity and density of the chase.
    4. Mention fictional checkpoints or landmarks in Nova Inferno (e.g., "The Void", "Carbon Slums").

    Always respond in PURE JSON format with:
    - escape_route: [array of waypoints with {{"x": int, "y": int}}]
    - heat_level: 1-5
    - police_eta_seconds: number (estimated time until interception)
    - narrative: string (noir-style flavor text)
    - checkpoints_ahead: [array of strings (fictional location names)]
    
    The city is entirely fictional. Always stay in character.
    """

    model = genai.GenerativeModel('gemini-2.5-flash')
    response = await model.generate_content_async(master_prompt)
    
    try:
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_text)
        return data
    except Exception as e:
        return {
            "escape_route": [{"x": request.player_x + 1, "y": request.player_y}],
            "heat_level": request.heat_level,
            "police_eta_seconds": 60,
            "narrative": "The static in the comms is getting louder. You're on your own, kid.",
            "checkpoints_ahead": ["The Carbon Gate"]
        }


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "alive", "agent": "sin-city-concierge-v1"}

AVATARS = ['🎭', '🃏', '👑', '💀', '🐍', '🦊', '🎲', '🔮', '💎', '🌙', '🍸', '🎯']

@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user: UserCreate):
    db = get_db()
    if await db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    avatar = random.choice(AVATARS)
    new_user = {
        "username": user.username,
        "password": get_password_hash(user.password),
        "avatar": avatar,
        "coins": 1000,
        "inventory": [],
        "bookings": []
    }
    await db.users.insert_one(new_user)
    
    token = create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"username": user.username, "avatar": avatar, "coins": 1000, "inventory": [], "bookings": []}
    }

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db = get_db()
    db_user = await db.users.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": db_user["username"],
            "avatar": db_user["avatar"],
            "coins": db_user["coins"],
            "inventory": db_user.get("inventory", []),
            "bookings": db_user.get("bookings", [])
        }
    }

@app.post("/api/user/sync", response_model=UserResponse)
async def sync_store(req: SyncStoreRequest, current_user: dict = Depends(get_current_user)):
    db = get_db()
    update_fields = {"coins": req.coins, "inventory": req.inventory}
    if req.bookings is not None:
        update_fields["bookings"] = [b.dict() for b in req.bookings]
    await db.users.update_one(
        {"username": current_user["username"]},
        {"$set": update_fields}
    )
    return {
        "username": current_user["username"],
        "avatar": current_user["avatar"],
        "coins": req.coins,
        "inventory": req.inventory,
        "bookings": req.bookings or current_user.get("bookings", [])
    }

@app.get("/api/user/bookings")
async def get_bookings(current_user: dict = Depends(get_current_user)):
    return {"bookings": current_user.get("bookings", [])}
