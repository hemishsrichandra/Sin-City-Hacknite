import sqlite3
import json
import os
from pathlib import Path

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "sincity.db")

def get_connection():
    """Get a SQLite connection with row_factory for dict-like access."""
    Path(os.path.dirname(DB_PATH)).mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create tables if they don't exist."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            avatar TEXT NOT NULL,
            coins INTEGER DEFAULT 1000,
            inventory TEXT DEFAULT '[]',
            bookings TEXT DEFAULT '[]'
        )
    """)
    conn.commit()
    conn.close()

# Call on import to ensure tables exist
init_db()


class UserCollection:
    """Mimic async MongoDB collection interface using SQLite."""

    async def find_one(self, query: dict):
        username = query.get("username")
        if not username:
            return None
        conn = get_connection()
        row = conn.execute(
            "SELECT * FROM users WHERE username = ?", (username,)
        ).fetchone()
        conn.close()
        if not row:
            return None
        return {
            "username": row["username"],
            "password": row["password"],
            "avatar": row["avatar"],
            "coins": row["coins"],
            "inventory": json.loads(row["inventory"]),
            "bookings": json.loads(row["bookings"]),
        }

    async def insert_one(self, doc: dict):
        conn = get_connection()
        conn.execute(
            """INSERT INTO users (username, password, avatar, coins, inventory, bookings)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                doc["username"],
                doc["password"],
                doc["avatar"],
                doc.get("coins", 1000),
                json.dumps(doc.get("inventory", [])),
                json.dumps(doc.get("bookings", [])),
            ),
        )
        conn.commit()
        conn.close()

    async def update_one(self, query: dict, update: dict):
        username = query.get("username")
        if not username:
            return
        fields = update.get("$set", {})
        set_clauses = []
        values = []
        if "coins" in fields:
            set_clauses.append("coins = ?")
            values.append(fields["coins"])
        if "inventory" in fields:
            set_clauses.append("inventory = ?")
            values.append(json.dumps(fields["inventory"]))
        if "bookings" in fields:
            set_clauses.append("bookings = ?")
            # bookings may be a list of Booking dicts or Booking objects
            bookings_raw = fields["bookings"]
            if bookings_raw and hasattr(bookings_raw[0], 'dict'):
                bookings_raw = [b.dict() for b in bookings_raw]
            values.append(json.dumps(bookings_raw))
        if not set_clauses:
            return
        values.append(username)
        conn = get_connection()
        conn.execute(
            f"UPDATE users SET {', '.join(set_clauses)} WHERE username = ?",
            values,
        )
        conn.commit()
        conn.close()


class FakeDB:
    def __init__(self):
        self.users = UserCollection()


_db = FakeDB()

def get_db():
    return _db
