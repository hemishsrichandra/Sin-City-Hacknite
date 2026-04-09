from pydantic import BaseModel
from typing import List, Literal


class PlannerRequest(BaseModel):
    vices: List[str]                    # e.g. ["GAMBLING", "NIGHTLIFE"]
    budget_per_night: int               # e.g. 500
    days: int                           # e.g. 3
    vibe: Literal["WILD", "SOPHISTICATED", "LAID_BACK", "MYSTERY"]
    party_size: int                     # e.g. 2


class HealthResponse(BaseModel):
    status: str
    agent: str
