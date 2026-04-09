import json
import os
import numpy as np
from typing import List

# Try to load sentence-transformers, fall back to keyword matching
try:
    from sentence_transformers import SentenceTransformer
    _model = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_EMBEDDINGS = True
except Exception:
    _model = None
    HAS_EMBEDDINGS = False


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))


def embed_text(text: str) -> np.ndarray:
    """Embed a text string using sentence-transformers."""
    if _model is None:
        return np.zeros(384)
    return _model.encode(text, show_progress_bar=False)


def match_activities_by_embedding(
    profile_summary: str,
    activities: List[dict],
    top_k: int = 20
) -> List[dict]:
    """Match activities to user profile using semantic similarity."""
    if not HAS_EMBEDDINGS or _model is None:
        # Fallback to keyword matching
        return match_activities_by_keyword(profile_summary, activities, top_k)

    profile_embedding = embed_text(profile_summary)

    scored = []
    for act in activities:
        desc = f"{act['name']} {act['description']} {' '.join(act.get('tags', []))}"
        act_embedding = embed_text(desc)
        score = cosine_similarity(profile_embedding, act_embedding)
        scored.append((score, act))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [act for _, act in scored[:top_k]]


def match_activities_by_keyword(
    profile_summary: str,
    activities: List[dict],
    top_k: int = 20
) -> List[dict]:
    """Fallback keyword-based matching."""
    profile_lower = profile_summary.lower()
    scored = []

    for act in activities:
        score = 0
        for tag in act.get("tags", []):
            if tag.lower() in profile_lower:
                score += 2
        for vibe in act.get("vibe_match", []):
            if vibe.lower() in profile_lower:
                score += 1
        if act.get("name", "").lower() in profile_lower:
            score += 1
        scored.append((score, act))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [act for _, act in scored[:top_k]]
