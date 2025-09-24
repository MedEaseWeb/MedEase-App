import os
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
from openai import OpenAI
from src.services.classifier_service import classifier, stream_classification_result
from src.database import medical_report_collection
from typing import AsyncGenerator
from datetime import datetime
from src.database import medical_report_collection
from fastapi import HTTPException


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



def extract_sections(full_text: str) -> tuple[str, str]:
    simplified_report = ""
    formatted_simplified_report = ""

    if "Step 3: Dynamic Summarization..." in full_text and "Step 4: Formatting Output..." in full_text:
        simplified_report = full_text.split("Step 3: Dynamic Summarization...")[1].split("Step 4: Formatting Output...")[0].strip()

    if "Step 4: Formatting Output..." in full_text and "--- Final Simplified Output ---" in full_text:
        formatted_simplified_report = full_text.split("Step 4: Formatting Output...")[1].split("--- Final Simplified Output ---")[0].strip()

    return simplified_report, formatted_simplified_report

async def stream_and_capture(prompt: str, user_id: str, report_id: str, user_email: str):
    yield "Starting simplification pipeline...\n"
    buffer = ""

    # Step 1: run the guardian (before streaming anything)
    is_valid = classifier.is_medical(prompt)

    # Still stream classification result (for frontend display)
    for chunk in stream_classification_result(prompt):
        buffer += chunk
        yield chunk

    if not is_valid:
        # User gave invalid input — stream warning but do not save
        msg = "\nPlease provide a medical report. Simplification terminated.\n"
        buffer += msg
        yield msg
        return

    # Step 2: Perform the simplification pipeline and collect output
    for chunk in stream_simplified_response(prompt):
        buffer += chunk
        yield chunk

    # Step 3: Extract and save only if input is valid
    simplified_report, formatted_simplified_report = extract_sections(buffer)

    await medical_report_collection.insert_one({
        "_id": ObjectId(),
        "user_id": user_id,
        "report_id": report_id,
        "user_email": user_email,
        "original_report": prompt,
        "simplified_report": simplified_report,
        "formatted_simplified_report": formatted_simplified_report,
        "date_created": datetime.utcnow()
    })




def stream_simplified_response(prompt: str):
    yield "Starting simplification pipeline...\n"
    """
    Full simplification pipeline (streaming only).
    Does NOT save output to the database.
    """
    final_output = ""
    yield from stream_classification_result(prompt)

    # if not classifier.is_medical(prompt):
    #     yield "\nPlease provide a medical report. Simplification terminated.\n"
    #     return

    yield "\n\nStep 1: Lexical Simplification...\n"
    lexical_text = ""
    for chunk in stream_openai(prompt, "Translate complex medical jargons into plain English, keeping sentence structures the same."):
        lexical_text += chunk
        yield chunk

    yield "\n\nStep 2: Syntactic Simplification...\n"
    syntactic_text = ""
    for chunk in stream_openai(lexical_text, "Simplify sentence structures while preserving meaning."):
        syntactic_text += chunk
        yield chunk

    yield "\n\nStep 3: Dynamic Summarization...\n"
    summarized_text = ""
    for chunk in stream_openai(syntactic_text, "Polish the text, fix grammar, and reorganize into clean readable flow."):
        summarized_text += chunk
        yield chunk

    yield "\n\nStep 4: Formatting Output...\n"
    formatted_text = ""
    for chunk in stream_openai(summarized_text, "Format this summary for a patient-friendly medical report. Use bullet points or clear sections if helpful."):
        formatted_text += chunk
        yield chunk

    yield "\nDone!\n"

    final_output = formatted_text
    yield "\n--- Final Simplified Output ---\n"
    yield final_output

async def fetch_reports_by_user(user_id: str):
    """
    Service layer: Retrieves all reports for a given user ID from the database.
    """
    try:
        # Validate ObjectId format
        ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Query reports
    cursor = medical_report_collection.find({"user_id": user_id})
    reports = []
    async for doc in cursor:
        # Use `date_created` if available, else fall back to ObjectId timestamp
        if "date_created" in doc:
            name = doc["date_created"].strftime("%Y-%m-%d %H:%M:%S")
        else:
            name = str(ObjectId(doc["_id"]).generation_time.strftime("%Y-%m-%d %H:%M:%S"))

        reports.append({
            "name": name,
            "original_report": doc.get("original_report", ""),
            "simplified_report": doc.get("simplified_report", ""),
            "formatted_simplified_report": doc.get("formatted_simplified_report", "")
        })

    return reports