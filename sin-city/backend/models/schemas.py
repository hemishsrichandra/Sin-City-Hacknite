from pydantic import BaseModel
from typing import List, Literal, Optional


class PlannerRequest(BaseModel):
    vices: List[str]                    # e.g. ["GAMBLING", "NIGHTLIFE"]
    budget_per_night: int               # e.g. 500
    days: int                           # e.g. 3
    vibe: Literal["WILD", "SOPHISTICATED", "LAID_BACK", "MYSTERY"]
    party_size: int                     # e.g. 2


class HealthResponse(BaseModel):
    status: str
    agent: str

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Booking(BaseModel):
    id: str
    name: str
    type: str           # "show", "escort", "cabaret", "substance"
    district: str       # "Shows", "Nightlife", "Cloud 9"
    date: str           # ISO date string
    coins_spent: int
    status: str         # "confirmed", "completed", "cancelled"
    details: Optional[dict] = None  # seat type, venue, reference number, etc.

class SyncStoreRequest(BaseModel):
    coins: int
    inventory: List[str]
    bookings: Optional[List[Booking]] = None

class UserResponse(BaseModel):
    username: str
    avatar: str
    coins: int
    inventory: List[str]
    bookings: Optional[List[Booking]] = []

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
