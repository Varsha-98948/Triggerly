from fastapi import APIRouter, Request, HTTPException

from services.automation_service import (
    get_automation_by_token,
)

from services.execution_service import (
    create_execution_log,
)

router = APIRouter()


@router.post("/webhook/{token}")
async def receive_webhook(
    token: str,
    request: Request,
):
    try:
        payload = await request.json()
    except:
        payload = {}

    automation = get_automation_by_token(token)

    if not automation:
        raise HTTPException(
            status_code=404,
            detail="Automation not found",
        )

    create_execution_log(
        automation["id"],
        payload,
        "received",
    )

    return {
        "success": True,
        "automation_id": automation["id"],
    }