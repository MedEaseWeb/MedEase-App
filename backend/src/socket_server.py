# import socketio
# from openai import OpenAI
# from src.config import CHAT_GPT_API_KEY

# # Initialize OpenAI client
# client = OpenAI(api_key=CHAT_GPT_API_KEY)

# # Setup Socket.IO server
# sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*") # TODO: Enable CORS only for our frontend URL
# socket_app = socketio.ASGIApp(sio)

# # Optional: Define a system prompt for consistent behavior
# preprompt = (
#     "You are a friendly and knowledgeable caregiver assistant. "
#     "Answer questions helpfully and clearly, tailored to the user's needs."
# )

# # @sio.event
# # async def connect(sid, environ):
# #     print(f"Client connected: {sid}")

# @sio.event
# async def disconnect(sid):
#     print(f"Client disconnected: {sid}")

# @sio.event
# async def user_message(sid, text):
#     print(f"Message from user ({sid}): {text}")
#     try:
#         # Call OpenAI API with user message
#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {"role": "system", "content": preprompt},
#                 {"role": "user", "content": text},
#             ],
#         )

#         assistant_reply = response.choices[0].message.content
#         print(f"Response: {assistant_reply}")

#         # Send response back to client
#         await sio.emit("bot-message", assistant_reply, to=sid)

#     except Exception as e:
#         error_msg = "Sorry, something went wrong. Please try again."
#         print(f"Error: {e}")
#         await sio.emit("bot-message", error_msg, to=sid)

