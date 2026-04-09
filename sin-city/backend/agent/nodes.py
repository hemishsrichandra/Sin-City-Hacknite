import json
import os
from typing import List
from agent.state import PlannerState
from agent.prompts import ITINERARY_PROMPT
from services.embeddings_service import match_activities_by_embedding
from services.ollama_service import generate_ollama


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def load_activities() -> List[dict]:
    """Load activities from the JSON data file."""
    path = os.path.join(DATA_DIR, "activities.json")
    with open(path, "r") as f:
        return json.load(f)


# ─── Node 1: Profile Node ──────────────────────────────────────
async def profile_node(state: PlannerState) -> dict:
    """Construct a natural language profile from the request fields."""
    vibe_map = {
        "WILD": "WILD & RECKLESS",
        "SOPHISTICATED": "SOPHISTICATED & CLASSY",
        "LAID_BACK": "LAID BACK & CHILL",
        "MYSTERY": "MYSTERIOUS & DANGEROUS",
    }
    vibe_desc = vibe_map.get(state["vibe"], state["vibe"])
    vices = ", ".join(state["vices"])

    profile = (
        f"The user wants a {vibe_desc} {state['days']}-day trip for "
        f"{state['party_size']} people with ${state['budget_per_night']}/night budget. "
        f"Primary interests: {vices}. "
        f"They want an unforgettable Las Vegas experience."
    )

    return {
        "profile_summary": profile,
        "messages": [f"Profile created: {vibe_desc} trip, {state['days']} days, ${state['budget_per_night']}/night"],
    }


# ─── Node 2: Activity Matcher Node ─────────────────────────────
async def activity_matcher_node(state: PlannerState) -> dict:
    """Match activities to user profile using embeddings or keywords."""
    activities = load_activities()

    # Filter by vice tags first
    vice_filtered = []
    for act in activities:
        for tag in act.get("tags", []):
            if tag.upper() in [v.upper() for v in state["vices"]]:
                vice_filtered.append(act)
                break

    # If too few matches, include all activities
    if len(vice_filtered) < 10:
        vice_filtered = activities

    # Use embeddings to rank
    matched = match_activities_by_embedding(
        state["profile_summary"],
        vice_filtered,
        top_k=20
    )

    return {
        "matched_activities": matched,
        "messages": [f"Matched {len(matched)} activities to your profile"],
    }


# ─── Node 3: Budget Filter Node ────────────────────────────────
async def budget_filter_node(state: PlannerState) -> dict:
    """Filter activities by budget and ensure geographic diversity."""
    budget = state["budget_per_night"]
    activities = state["matched_activities"]

    # Filter by budget
    affordable = [
        act for act in activities
        if act.get("cost_per_person", 0) <= budget * 0.6  # single activity shouldn't exceed 60% of nightly budget
    ]

    # If too strict, relax
    if len(affordable) < 8:
        affordable = activities

    # Ensure district diversity
    district_counts = {}
    diverse = []
    for act in affordable:
        district = act.get("district", "Unknown")
        if district_counts.get(district, 0) < 5:
            diverse.append(act)
            district_counts[district] = district_counts.get(district, 0) + 1

    return {
        "matched_activities": diverse,
        "messages": [f"Filtered to {len(diverse)} activities within budget"],
    }


# ─── Node 4: Itinerary Builder Node ────────────────────────────
async def itinerary_builder_node(state: PlannerState) -> dict:
    """Build the itinerary using Ollama LLM or fallback."""
    activities_text = "\n".join([
        f"- {act['name']} ({act['district']}) - ${act['cost_per_person']}/person, "
        f"{act['duration_hours']}hrs - {act['description']}"
        for act in state["matched_activities"]
    ])

    prompt = ITINERARY_PROMPT.format(
        profile_summary=state["profile_summary"],
        activities_list=activities_text,
        days=state["days"],
    )

    # Try Ollama first
    itinerary = await generate_ollama(prompt)

    # Fallback if Ollama returns nothing
    if not itinerary or len(itinerary.strip()) < 50:
        itinerary = generate_fallback_itinerary(state)

    return {
        "itinerary": itinerary,
        "messages": ["Itinerary generated successfully"],
    }


def generate_fallback_itinerary(state: PlannerState) -> str:
    """Generate a hardcoded but personalized fallback itinerary."""
    days_content = []
    activities = state["matched_activities"]
    vibe = state["vibe"]

    day_titles = [
        "THE GRAND ARRIVAL",
        "DOUBLE DOWN",
        "THE LAST HURRAH",
        "GOING DEEPER",
        "THE FINAL ACT",
        "ONE MORE ROUND",
        "THE GRAND GOODBYE",
    ]

    closers = [
        "Tonight was just the appetiser.",
        "The house always wins. But tonight, you're the house.",
        "What happens in Sin City... you already know the rest.",
        "Sleep is optional. Regret is prohibited.",
        "The night is still young. You are not.",
        "Another chapter in the book of bad decisions.",
        "Go out with a bang, not a whimper.",
    ]

    for day_num in range(1, min(state["days"] + 1, 8)):
        title = day_titles[day_num - 1] if day_num <= len(day_titles) else f"DAY {day_num}"

        day_text = f"DAY {day_num}: {title}\n\n"

        # Pick 3-4 activities per day
        start_idx = (day_num - 1) * 4 % max(len(activities), 1)
        day_acts = []
        for j in range(4):
            idx = (start_idx + j) % max(len(activities), 1)
            if idx < len(activities):
                day_acts.append(activities[idx])

        times = ["7:00 PM", "9:00 PM", "11:00 PM", "1:00 AM"]
        for k, act in enumerate(day_acts):
            time = times[k] if k < len(times) else f"{k+7}:00 PM"
            day_text += (
                f"{time} — {act['name']}\n"
                f"[District: {act['district']}] [Estimated cost: ${act['cost_per_person']}]\n"
                f"{act['description']}\n\n"
            )

        closer = closers[day_num - 1] if day_num <= len(closers) else "The night continues..."
        day_text += f"{closer}\n"
        days_content.append(day_text)

    return "\n".join(days_content)
