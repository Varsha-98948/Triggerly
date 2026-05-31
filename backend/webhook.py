from fastapi import APIRouter, Request, HTTPException
from supabase_client import supabase

router = APIRouter()

@router.post("/webhook/{token}")
async def receive_webhook(token: str, request: Request):

    try:
     payload = await request.json()
    except:
     payload = {}

    automation_response = (
        supabase.table("automations")
        .select("*")
        .eq("webhook_token", token)
        .execute()
    )

    if not automation_response.data:
        raise HTTPException(
            status_code=404,
            detail="Automation not found"
        )

    automation = automation_response.data[0]

    supabase.table("execution_logs").insert(
        {
            "automation_id": automation["id"],
            "payload": payload,
            "status": "received"
        }
    ).execute()

    return {
        "success": True,
        "automation_id": automation["id"]
    }