def execute_action(
    automation,
    payload,
):
    action_type = automation["action_type"]

    if action_type == "telegram":
        print("Telegram action triggered")

        return {
            "success": True,
            "message": "Telegram action executed",
        }

    return {
        "success": False,
        "message": f"Unsupported action: {action_type}",
    }