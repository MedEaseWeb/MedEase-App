import os
from dotenv import load_dotenv
from openai import OpenAI
from src.services.classifier_service import classifier  # reuse the singleton
from src.services.classifier_service import stream_classification_result


load_dotenv()
client = OpenAI(api_key=os.getenv("CHAT_GPT_API_KEY"))

def stream_simplified_response(prompt: str):
    # Stream classification
    yield from stream_classification_result(prompt)

    if not classifier.is_medical(prompt):
        yield "\nSimplification terminated.\n"
        return

    yield "\nStarting simplification...\n\n"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that simplifies complex medical text for patients."},
            {"role": "user", "content": prompt}
        ],
        stream=True
    )

    for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content