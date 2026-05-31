from supabase_client import supabase


def create_execution_log(
    automation_id,
    payload,
    status="received"
):
    return (
        supabase.table("execution_logs")
        .insert(
            {
                "automation_id": automation_id,
                "payload": payload,
                "status": status,
            }
        )
        .execute()
    )