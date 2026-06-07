from supabase_client import supabase


def create_execution_log(
    automation_id,
    payload,
    status="received"
):
    response = (
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

    return response.data[0]


def update_execution_status(
    execution_log_id,
    status,
    error_message=None,
):
    return (
        supabase.table("execution_logs")
        .update(
            {
                "status": status,
                "error_message": error_message,
            }
        )
        .eq("id", execution_log_id)
        .execute()
    )   