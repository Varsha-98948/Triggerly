from fastapi import APIRouter, Request, HTTPException

from services.automation_service import (
    get_automation_by_token,
)

from services.execution_service import (
    create_execution_log,
    update_execution_status,
)

from services.action_service import (
    execute_action,
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

    execution_log = create_execution_log(
        automation["id"],
        payload,
        "received",
    )

    try:
        result = execute_action(
            automation,
            payload,
        )

        update_execution_status(
            execution_log["id"],
            "completed",
        )

    except Exception as e:
        update_execution_status(
            execution_log["id"],
            "failed",
            str(e),
        )

        raise

    return {
        "success": True,
        "automation_id": automation["id"],
        "action_result": result,
    }