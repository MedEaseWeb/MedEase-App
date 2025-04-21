# agenticActions.py
tools = [
    {
        "name": "add_reminder",
        "description": "Create a calendar event on the user's authenticated Google Calendar",
        "parameters": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string",
                    "description": "Title of the event"
                },
                "description": {
                    "type": "string",
                    "description": "Details about the event"
                },
                "location": {
                    "type": "string",
                    "description": "Where the event takes place"
                },
                "start_time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 start date-time"
                },
                "end_time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 end date-time"
                },
                "recurrence_days": {
                    "type": "integer",
                    "description": "Number of daily occurrences (including the first); omit for a one-off event"
                }
            },
            "required": ["summary", "start_time", "end_time"]
        }
    }
]
