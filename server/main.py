from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from api.routes import router as api_router
import os
from browserbase import Browserbase
from browser_use import Agent, Browser, BrowserConfig
from browser_use.browser.context import BrowserContext, BrowserContextConfig, BrowserSession
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from models import UseBrowserbaseContext
from dotenv import load_dotenv
import asyncio
import requests

load_dotenv()
app = FastAPI(
    title="Simple FastAPI",
    description="A simple and neat FastAPI application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Include routers
app.include_router(api_router, prefix="/api", tags=["items"])

@app.post("/", tags=["root"])
async def root(request: Request):
    data = await request.json()
    print(data)
    """Root endpoint."""
    return {
        "message": "Welcome to the Simple FastAPI!",
        "docs": "/docs",
        "redoc": "/redoc"
    }

#     data = await request.json()

#     browserbase_key = data.get("browserbase_key")
#     session_id = data.get("session_id")

#     url = f"https://api.browserbase.com/v1/sessions/{session_id}/recording"

#     headers = {"X-BB-API-Key": browserbase_key}

#     response = requests.get(url, headers=headers)

#     print(response.text)

#     return response.text

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 