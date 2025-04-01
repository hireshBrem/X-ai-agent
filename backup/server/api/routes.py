from fastapi import APIRouter, HTTPException, Request
from api.utils import setup_browser, setup_agent
import requests

router = APIRouter()

@router.post("/get-session", status_code=201)
async def get_session(request: Request):
    data = await request.json()

    browserbase_key = data.get("browserbase_key")
    session_id = data.get("session_id")

    print(browserbase_key, session_id)

    url = f"https://api.browserbase.com/v1/sessions/{session_id}"

    headers = {"X-BB-API-Key": browserbase_key}

    response = requests.request("GET", url, headers=headers)

    print(response.text)

    return response.text

@router.post("/run-agent" , status_code=201)
async def run_agent(request: Request):
    data = await request.json()
    browserbase_key = data.get("browserbase_key")
    browserbase_project_id = data.get("browserbase_project_id")
    openai_key = data.get("openai_key")
    contextId = data.get("contextId")
    email = data.get("email")
    password = data.get("password")

    print(browserbase_key, browserbase_project_id, openai_key, contextId, email, password)

    # Setup browser and context
    browser, context, bb_session = await setup_browser(
        browserbase_key, 
        browserbase_project_id,
        contextId
    )

    # Get session
    session = await context.get_session()

    try:
        # Setup agent
        agent = await setup_agent(browser, context, openai_key)

        # Run agent
        await agent.run()

    finally: 
        # Close browser
        await browser.close()


    print("Session: ", session)
    print("BB Session: ", bb_session)

    # Return session 
    return bb_session

@router.post("/login-x" , status_code=201)
async def login_x(request: Request):
    data = await request.json()
    browserbase_key = data.get("browserbase_key")
    browserbase_project_id = data.get("browserbase_project_id")
    openai_key = data.get("openai_key")
    contextId = data.get("contextId")
    email = data.get("email")
    password = data.get("password")

    print(browserbase_key, browserbase_project_id, openai_key, contextId, email, password)

    # Setup browser and context
    browser, context, bb_session = await setup_browser(
        browserbase_key, 
        browserbase_project_id,
        contextId
    )

    # Get session
    session = await context.get_session()

    try:
        # Setup agent
        agent = await setup_agent(browser, context, openai_key, email, password)

        # Run agent
        await agent.run()

    finally: 
        # Close browser
        await browser.close()


    print("Session: ", session)
    print("BB Session: ", bb_session)

    # Return session 
    return bb_session

# @router.post("/get-live-url" , status_code=201)
# async def get_live_url(request: Request):
#     data = await request.json()

#     browserbase_key = data.get("browserbase_key")
#     session_id = data.get("session_id")

#     url = f"https://api.browserbase.com/v1/sessions/{session_id}/debug"

#     headers = {"X-BB-API-Key": browserbase_key}

#     response = requests.get(url, headers=headers)

#     print("URL: ", response.text)

#     return response.text

# @router.post("/get-session-recording" , status_code=201)
# async def get_session_recording(request: Request):
#     data = await request.json()

#     browserbase_key = data.get("browserbase_key")
#     session_id = data.get("session_id")

#     print(browserbase_key, session_id)

#     url = f"https://api.browserbase.com/v1/sessions/{session_id}/recording"

#     headers = {"X-BB-API-Key": browserbase_key}

#     response = requests.get(url, headers=headers)

#     print(response.text)

#     return response.text[0]

# @router.post("/get-session-download" , status_code=201)
# async def get_session_download(request: Request):
#     data = await request.json()

#     browserbase_key = data.get("browserbase_key")
#     session_id = data.get("session_id")

#     url = f"https://api.browserbase.com/v1/sessions/{session_id}/downloads"

#     headers = {"X-BB-API-Key": browserbase_key}

#     response = requests.request("GET", url, headers=headers)

#     print(response.text)

#     return response.text
        
