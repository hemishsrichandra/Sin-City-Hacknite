import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Fix DNS resolution on restrictive macOS sandbox environments
# where /etc/resolv.conf is inaccessible
try:
    import dns.resolver
    try:
        with open('/etc/resolv.conf', 'r'):
            pass
    except (PermissionError, FileNotFoundError, OSError):
        # System DNS resolver is blocked; manually configure dnspython  
        resolver = dns.resolver.Resolver(configure=False)
        resolver.nameservers = ['8.8.8.8', '8.8.4.4', '1.1.1.1']
        dns.resolver.default_resolver = resolver
except ImportError:
    pass

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=10000)
db = client.sin_city_db

def get_db():
    return db
