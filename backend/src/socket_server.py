# socket_server.py
from openai import OpenAI
from src.config import CHAT_GPT_API_KEY

# GPT client
client = OpenAI(api_key=CHAT_GPT_API_KEY)

# System prompt for the assistant
preprompt = (
    "You are a friendly and knowledgeable caregiver assistant. "
    "Answer questions helpfully and clearly, tailored to the user's needs."
)

def register_socketio_events(sio):
    @sio.event
    async def disconnect(sid):
        print(f"Client disconnected: {sid}")

    @sio.event
    async def user_message(sid, data):
        print(f"Message from user ({sid}): {data}")
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": preprompt},
                    {"role": "user", "content": data},
                ],
            )
            reply = response.choices[0].message.content
            print(f"GPT response: {reply}")
            await sio.emit("bot-message", reply, room=sid)
        except Exception as e:
            print(f"Error: {e}")
            await sio.emit("bot-message", "Sorry, something went wrong.", room=sid)
