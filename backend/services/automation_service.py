from supabase_client import supabase


def get_automation_by_token(token: str):
    response = (
        supabase.table("automations")
        .select("*")
        .eq("webhook_token", token)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]