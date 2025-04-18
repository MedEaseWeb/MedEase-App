from src.config import CHAT_GPT_API_KEY
from openai import OpenAI
import json

async def extract_medication_info(text):
    
    preprompt = """
You are an AI assistant tasked with processing unstructured medical notes. Extract key information following schema structure below. For missing information, infer and generate relevant data based on common medical knowledge. Only give me JSON output. Output should be humanized and professional, it should offer specific guidance based on the medication type and patient potential needs. especially in areas like "action_if_run_out" and "pharmacy_tip," and safety information should be detailed with practical advice.
Output Schema:
{
    "medication_name": "string",  
    "common_name": "string", 
    "purpose": "string",  
    "schedule": {
        "dosage": "string", 
        "instructions": ["string"]  
    },
    "prescription_details": {
        "start_date": "datetime", 
        "end_date": "datetime",  
        "prescribed_by": "string", 
        "quantity": "string",  
        "duration": "string", 
        "action_if_run_out": ["string"]  
    },
    "pharmacy": {
        "name": "string",  
        "location": "string",  
        "number": "string",
        "pharmacy_tip": ["string"]  
    },
    "safety_info": {
        "addiction_risk": ["string"],  
        "side_effects": ["string"],  
        "overdose_symptoms": ["string"],  
        "disposal_instructions": ["string"],  
        "storage_instructions": ["string"]  
    },
    "patient_guidance": {
        "follow_up_steps": ["string"],  
        "lifestyle_tips": ["string"],  
        "emergency_contacts": ["string"],  
        "questions_for_doctor": ["string"]  
    }
}
"""  
    client = OpenAI(api_key=CHAT_GPT_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": preprompt}, {"role": "user", "content": text}],
    )
    
    extracted_data = response.choices[0].message.content
    extracted_json = json.loads(extracted_data)  
    
    return extracted_json