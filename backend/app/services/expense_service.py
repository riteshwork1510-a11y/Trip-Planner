from datetime import datetime, timezone
from typing import Optional, List
from bson import ObjectId

from app.core.database import get_database


def format_expense(expense: dict) -> dict:
    return {
        "id": str(expense["_id"]),
        "user_id": expense.get("user_id", ""),
        "trip_id": expense.get("trip_id", ""),
        "category": expense.get("category", ""),
        "description": expense.get("description", ""),
        "amount": expense.get("amount", 0),
        "date": expense.get("date", ""),
        "currency": expense.get("currency", "INR"),
        "notes": expense.get("notes"),
        "created_at": expense.get("created_at"),
        "updated_at": expense.get("updated_at"),
    }


async def create_expense(user_id: str, data: dict) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)
    expense_doc = {
        "user_id": user_id,
        "trip_id": data["trip_id"],
        "category": data["category"],
        "description": data["description"],
        "amount": data["amount"],
        "date": data["date"],
        "currency": data.get("currency", "INR"),
        "notes": data.get("notes"),
        "created_at": now,
        "updated_at": now,
    }
    result = await db.expenses.insert_one(expense_doc)
    expense_doc["_id"] = result.inserted_id

    from app.services.trip_service import update_trip_spent
    await update_trip_spent(data["trip_id"])

    return format_expense(expense_doc)


async def get_user_expenses(user_id: str, trip_id: Optional[str] = None) -> List[dict]:
    db = get_database()
    query = {"user_id": user_id}
    if trip_id:
        query["trip_id"] = trip_id

    cursor = db.expenses.find(query).sort("date", -1)
    expenses = []
    async for exp in cursor:
        expenses.append(format_expense(exp))
    return expenses


async def get_expense_by_id(expense_id: str, user_id: str) -> Optional[dict]:
    db = get_database()
    try:
        expense = await db.expenses.find_one({"_id": ObjectId(expense_id), "user_id": user_id})
    except Exception:
        return None
    if expense:
        return format_expense(expense)
    return None


async def update_expense(expense_id: str, user_id: str, data: dict) -> Optional[dict]:
    db = get_database()
    allowed_fields = {"category", "description", "amount", "date", "currency", "notes"}
    update_fields = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

    if not update_fields:
        return await get_expense_by_id(expense_id, user_id)

    update_fields["updated_at"] = datetime.now(timezone.utc)

    await db.expenses.update_one(
        {"_id": ObjectId(expense_id), "user_id": user_id},
        {"$set": update_fields},
    )

    expense = await get_expense_by_id(expense_id, user_id)
    if expense:
        from app.services.trip_service import update_trip_spent
        await update_trip_spent(expense["trip_id"])
    return expense


async def delete_expense(expense_id: str, user_id: str) -> bool:
    db = get_database()
    expense = await get_expense_by_id(expense_id, user_id)
    if not expense:
        return False

    result = await db.expenses.delete_one({"_id": ObjectId(expense_id), "user_id": user_id})
    if result.deleted_count > 0:
        from app.services.trip_service import update_trip_spent
        await update_trip_spent(expense["trip_id"])
        return True
    return False


async def get_expense_stats(user_id: str) -> dict:
    db = get_database()
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": None,
                "total_expenses": {"$sum": 1},
                "total_spent": {"$sum": "$amount"},
            }
        },
    ]
    result = await db.expenses.aggregate(pipeline).to_list(length=1)

    category_pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {"_id": "$category", "total": {"$sum": "$amount"}, "count": {"$sum": 1}}},
    ]
    cat_results = await db.expenses.aggregate(category_pipeline).to_list(length=100)
    categories = {r["_id"]: {"total": r["total"], "count": r["count"]} for r in cat_results if r["_id"]}

    if result:
        return {
            "total_expenses": result[0]["total_expenses"],
            "total_spent": result[0]["total_spent"],
            "categories": categories,
        }
    return {
        "total_expenses": 0,
        "total_spent": 0,
        "categories": categories,
    }
