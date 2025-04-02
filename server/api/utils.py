from browserbase import Browserbase
from browser_use import Agent, Browser, BrowserConfig, BrowserContextConfig
from models import UseBrowserbaseContext
from dotenv import load_dotenv
import asyncio
import requests
from langchain_openai import ChatOpenAI

load_dotenv()

async def setup_browser(browserbase_key: str, browserbase_project_id: str, contextId: str) -> tuple[Browser, UseBrowserbaseContext]:
    """Set up browser and context configurations.

    Returns:
        tuple[Browser, UseBrowserbaseContext]: Configured browser and context.
    """
    bb = Browserbase(api_key=browserbase_key)
    bb_session = bb.sessions.create(
        project_id=browserbase_project_id,
        browser_settings={
        "context": {
          "id": contextId,
          "persist": True
        }
      }
    )

    browser = Browser(config=BrowserConfig(cdp_url=bb_session.connect_url, chrome_instance_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"))
    context = UseBrowserbaseContext(
        browser,
        BrowserContextConfig(
            wait_for_network_idle_page_load_time=10.0,
            highlight_elements=True,
        )
    )

    return browser, context, bb_session

async def setup_agent(browser: Browser, context: UseBrowserbaseContext, openai_key: str, email: str | None = None, password: str | None = None) -> Agent:
    """Set up the browser automation agent.

    Args:
        browser: Configured browser instance
        context: Browser context for the agent
        email: Email or username for the agent
        password: Password for the agent

    Returns:
        Agent: Configured automation agent
    """

    llm = ChatOpenAI(
        model_name="gpt-4o",
        temperature=0.0,
        timeout=100,
        openai_api_key=openai_key
    )

    if email and password:
        sensitive_data = {'x_name': email, 'x_password': password}

        task = f"""
            Go to https://x.com/home and login with x_name and x_password.
        """

        return Agent(
            task=task,
            llm=llm,
            browser=browser,
            browser_context=context,
            sensitive_data=sensitive_data
        )
    
    else:
        task = f"""
            Go to https://x.com/home and find an interesting post and write a relevant comment and click Reply button.
        """

        return Agent(
            task=task,
            llm=llm,
            browser=browser,
            browser_context=context,
        )