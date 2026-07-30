import motor.motor_asyncio
from pymongo.errors import ConnectionFailure, PyMongoError
from app.core.config import get_settings

settings = get_settings()

client: motor.motor_asyncio.AsyncIOMotorClient = None
db = None


async def connect_to_database():
    global client, db
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=5000
        )
        db = client[settings.DATABASE_NAME]
        await client.admin.command("ping")
        await create_indexes()
        print(f"Connected to MongoDB database: {settings.DATABASE_NAME}")
    except (ConnectionFailure, PyMongoError) as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise


async def close_database_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")


async def create_indexes():
    await db.users.create_index("email", unique=True)
    await db.refresh_tokens.create_index("user_id")
    await db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.trips.create_index("user_id")
    await db.trips.create_index([("user_id", 1), ("status", 1)])
    await db.trips.create_index("created_at")
    await db.expenses.create_index("user_id")
    await db.expenses.create_index([("user_id", 1), ("trip_id", 1)])
    await db.expenses.create_index("trip_id")
    await db.destinations.create_index("name", unique=True)
    await db.destinations.create_index("categories")


def get_database():
    return db
