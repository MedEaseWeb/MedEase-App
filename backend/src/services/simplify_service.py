import os
from dotenv import load_dotenv
from openai import OpenAI
from src.services.classifier_service import classifier, stream_classification_result

load_dotenv()
client = OpenAI(api_key=os.getenv("CHAT_GPT_API_KEY"))

def call_openai(prompt: str, system_prompt: str) -> str:
    """
    Helper: sends a prompt to OpenAI and returns full response text.
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


def stream_openai(prompt: str, system_prompt: str):
    """
    Helper: streams OpenAI response in chunks.
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        stream=True
    )
    for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def stream_simplified_response(prompt: str):
    """
    Full simplification pipeline:
    1. Classification
    2. Lexical simplification
    3. Syntactic simplification
    4. Dynamic summarization
    5. Formatting

    Each streamed live. Final output is saved internally.
    """
    final_output = ""
    yield from stream_classification_result(prompt)

    if not classifier.is_medical(prompt):
        yield "\nPlease provide a medical report. Simplification terminated.\n"
        return

    ### 1. Lexical Simplification
    yield "\n\nStep 1: Lexical Simplification...\n"
    lexical_text = ""
    for chunk in stream_openai(prompt, "Translate complex medical jargons into plain English, keeping sentence structures the same."):
        lexical_text += chunk
        yield chunk

    ### 2. Syntactic Simplification
    yield "\n\nStep 2: Syntactic Simplification...\n"
    syntactic_text = ""
    for chunk in stream_openai(lexical_text, "Simplify sentence structures while preserving meaning."):
        syntactic_text += chunk
        yield chunk

    ### 3. Dynamic Summarization
    yield "\n\nStep 3: Dynamic Summarization...\n"
    summarized_text = ""
    for chunk in stream_openai(syntactic_text, "Polish the text, fix grammar, and reorganize into clean readable flow."):
        summarized_text += chunk
        yield chunk

    ### 4. Output Formatting
    yield "\n\nStep 4: Formatting Output...\n"
    formatted_text = ""
    for chunk in stream_openai(summarized_text, "Format this summary for a patient-friendly medical report. Use bullet points or clear sections if helpful."):
        formatted_text += chunk
        yield chunk

    yield "\nDone!\n"

    # Store for separate access if needed
    final_output = formatted_text

    # For now, just yield it again with a separator
    yield "\n--- Final Simplified Output ---\n"
    yield final_output

