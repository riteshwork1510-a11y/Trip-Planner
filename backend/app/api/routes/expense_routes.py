from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from app.schemas.expense_schema import ExpenseCreate, ExpenseUpdate
from app.services import expense_service
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new expense",
)
async def create_expense(data: ExpenseCreate, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        expense = await expense_service.create_expense(user_id, data.model_dump())
        return {
            "success": True,
            "message": "Expense created",
            "data": expense,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": str(e), "error_code": "INTERNAL_ERROR"},
        )


@router.get("", summary="Get expenses for current user")
async def get_expenses(
    trip_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        expenses = await expense_service.get_user_expenses(user_id, trip_id)
        return {
            "success": True,
            "message": "Expenses retrieved",
            "data": expenses,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.get("/stats", summary="Get expense statistics")
async def get_expense_stats(current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        stats = await expense_service.get_expense_stats(user_id)
        return {
            "success": True,
            "message": "Stats retrieved",
            "data": stats,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.get("/{expense_id}", summary="Get expense by ID")
async def get_expense(expense_id: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        expense = await expense_service.get_expense_by_id(expense_id, user_id)
        if not expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Expense not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Expense retrieved",
            "data": expense,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.put("/{expense_id}", summary="Update an expense")
async def update_expense(
    expense_id: str,
    data: ExpenseUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        expense = await expense_service.update_expense(expense_id, user_id, update_data)
        if not expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Expense not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Expense updated",
            "data": expense,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.delete("/{expense_id}", summary="Delete an expense")
async def delete_expense(expense_id: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        deleted = await expense_service.delete_expense(expense_id, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Expense not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Expense deleted",
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )
