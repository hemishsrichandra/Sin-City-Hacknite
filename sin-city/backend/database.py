import os
from dotenv import load_dotenv
import motor.motor_asyncio

load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://hemishsrichandra_db_user:zJGj4cOowGgEfTeO@cluster0.znzjygp.mongodb.net/?appName=Cluster0"
)

_client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
_database = _client["sincity"]


class DB:
    def __init__(self, database):
        self.users = database["users"]


_db = DB(_database)


def get_db() -> DB:
    return _db
