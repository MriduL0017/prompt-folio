import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PromptFolio AI Gateway")

CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JAVA_SERVICE_URL = os.getenv("JAVA_SERVICE_URL", "http://localhost:8080/api/v1/profile")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY is not set.")

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing")

    try:
        # Fetch profile data from Java Service
        async with httpx.AsyncClient() as client:
            response = await client.get(JAVA_SERVICE_URL)
            response.raise_for_status()
            profile_data = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch profile data from Java service: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    # Construct System Prompt
    system_prompt = f"""
You are PromptFolio, the interactive AI assistant for Mridul. Answer questions strictly using the provided JSON data. Do not hallucinate experience. Highlight backend focus, enterprise refactoring, and system architecture.

[PROFILE DATA JSON]
{json.dumps(profile_data, indent=2)}
"""

    try:
        # Call Gemini API
        # Using gemini-flash-latest as identified by your list_models.py script
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Combining system prompt and user message for stable execution across model versions
        full_prompt = f"{system_prompt}\n\nUser Question: {request.message}"
        gemini_response = model.generate_content(full_prompt)
        
        return {"response": gemini_response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate response from Gemini: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok"}
