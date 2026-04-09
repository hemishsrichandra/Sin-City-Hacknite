from typing import TypedDict, List, Annotated
import operator


class PlannerState(TypedDict):
    vices: List[str]
    budget_per_night: int
    days: int
    vibe: str
    party_size: int
    profile_summary: str            # output of ProfilerNode
    matched_activities: List[dict]  # output of ActivityMatcherNode
    itinerary: str                  # output of ItineraryBuilderNode
    messages: Annotated[List[str], operator.add]
