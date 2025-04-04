# from openai import OpenAI
# from src.config import CHAT_GPT_API_KEY

# # GPT client
# client = OpenAI(api_key=CHAT_GPT_API_KEY)

# # System prompt
# preprompt = (
#     "You are a friendly and knowledgeable caregiver assistant. "
#     "Answer questions helpfully and clearly, tailored to the user's needs."
# )

# def register_socketio_events(socket_manager):
#     @socket_manager.on("disconnect")
#     async def handle_disconnect(sid, *args, **kwargs):
#         print(f"Client disconnected: {sid}")

#     @socket_manager.on("user-message")
#     async def handle_user_message(sid, data, *args, **kwargs):
#         print(f"Message from user ({sid}): {data}")
#         try:
#             response = client.chat.completions.create(
#                 model="gpt-4o-mini",
#                 messages=[
#                     {"role": "system", "content": preprompt},
#                     {"role": "user", "content": data},
#                 ],
#             )
#             reply = response.choices[0].message.content
#             print(f"GPT response: {reply}")
#             await socket_manager.emit("bot-message", reply, room=sid)
#         except Exception as e:
#             print(f"Error: {e}")
#             await socket_manager.emit("bot-message", "Sorry, something went wrong.", room=sid)
