import asyncio
from typing import AsyncGenerator

from agent.state import PlannerState
from agent.nodes import (
    profile_node,
    activity_matcher_node,
    budget_filter_node,
    itinerary_builder_node,
)
from models.schemas import PlannerRequest


async def run_planner_agent(request: PlannerRequest) -> AsyncGenerator[str, None]:
    """Run the planner agent pipeline and stream results."""
    initial_state: PlannerState = {
        "vices": request.vices,
        "budget_per_night": request.budget_per_night,
        "days": request.days,
        "vibe": request.vibe,
        "party_size": request.party_size,
        "profile_summary": "",
        "matched_activities": [],
        "itinerary": "",
        "messages": [],
    }

    # Step 1: Profile
    yield "INITIALISING SIN CITY CONCIERGE...\n"
    await asyncio.sleep(0.5)

    profile_result = await profile_node(initial_state)
    state = {**initial_state, **profile_result}

    yield "ANALYSING YOUR PREFERENCES...\n"
    await asyncio.sleep(0.3)

    # Step 2: Match activities
    matcher_result = await activity_matcher_node(state)
    state = {**state, **matcher_result}

    yield f"MATCHING ACTIVITIES TO YOUR PROFILE... ({len(state['matched_activities'])} found)\n"
    await asyncio.sleep(0.3)

    # Step 3: Budget filter
    budget_result = await budget_filter_node(state)
    state = {**state, **budget_result}

    yield "CALCULATING OPTIMAL ROUTE...\n"
    await asyncio.sleep(0.3)

    # Step 4: Build itinerary
    yield "BUILDING YOUR ITINERARY...\n\n"
    await asyncio.sleep(0.2)

    builder_result = await itinerary_builder_node(state)
    state = {**state, **builder_result}

    # Stream the itinerary word by word
    for word in state["itinerary"].split(" "):
        yield word + " "
        await asyncio.sleep(0.03)  # 30ms between words for streaming effect
