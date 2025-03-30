# X AI Agent

X AI Agent is an AI web agent that interacts with tweets, built using [Browser Use](https://docs.browser-use.com/introduction) and [Browserbase](https://docs.browserbase.com/introduction/what-is-browserbase).

![Demo of X AI Agent](/path/to/screenshot.png)

## Features

- 🤖 AI-powered browser automation using LLMs
- 🌐 Integration with Browserbase for reliable browser session management
- 📱 Modern, responsive UI built with Next.js and Tailwind CSS
- 🔄 Agent browsing session playback

## Architecture

The project is divided into two main components:

### Client

A modern web application built with:
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling and responsive design
- **Radix UI** - Accessible UI components
- **Zustand** - State management
- **Framer Motion** - For animations and transitions

### Server

A Python backend built with:
- **FastAPI** - High-performance web framework for building APIs
- **Browser-use** - Library for browser automation with LLMs
- **Browserbase** - Browser infrastructure for reliable web automation
- **LangChain** - Framework for developing applications powered by language models
- **Playwright** - Under-the-hood browser automation library

## Getting Started

### Prerequisites

- (free) Browserbase API key + Browserbase Project ID (Get them at https://www.browserbase.com/settings)
- (free) OpenAI API (Get one at https://platform.openai.com/api-keys)

### Installation

#### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment variables (optional - can be done on the interface):
```bash
# Copy example env file
cp .env.example .env

# Then edit the .env file with your values:
OPENAI_API_KEY=
BROWSERBASE_API_KEY=
BROWSERBASE_PROJECT_ID=

NEXT_PUBLIC_BROWSERBASE_API_KEY=
NEXT_PUBLIC_BROWSERBASE_PROJECT_ID=
NEXT_PUBLIC_OPENAI_API_KEY=
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

5. The client will be available at http://localhost:3000

#### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create and activate a virtual environment using uv:
```bash
# Install uv if you don't have it
pip install uv

# Create and activate virtual environment
uv venv
source .venv/bin/activate  # On Windows, use .venv\Scripts\activate
```

3. Install dependencies with uv (faster):
```bash
uv pip install -r requirements.txt
```

4. Configure environment variables (optional - if you've configured them on the frontend):
```bash
# Copy example env file
cp .env.example .env

# Then edit the .env file with your values:
BROWSERBASE_API_KEY=your_browserbase_api_key
OPENAI_API_KEY=your_openai_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id
```

5. Start the FastAPI server:
```bash
uv run main.py
```

6. The server will be available at http://localhost:8000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Enter your Browserbase API key, project ID and Open AI key
3. Click "Run Agent" to start a browser automation session
4. Watch the session recording after task is completed (default task for AI agent is to reply to only 1 tweet - this can be changed)
5. Customise the agent at [utils.py](server/api/utils.py) in the server's api folder

## API Endpoints

The server provides several API endpoints:

- `POST http://localhost:8000/api/run-agent` - Run an automation agent with specified keys
- `POST http://localhost:8000/api/get-session` - Get details of a specific Browserbase session
- `POST http://localhost:3000/api/session` - Get session recording for session


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GPL License - see the LICENSE file for details. Please note the client directory has it's sub license (MIT) from [Agent-UI](https://github.com/agno-agi/agent-ui).

## Acknowledgments

- [Browserbase](https://browserbase.com) for browser infrastructure
- [Browser-use](https://github.com/browser-use/browser-use) for browser automation with LLMs
- [Agent-UI](https://github.com/agno-agi/agent-ui) for agent's UI interface

## Final note

Have fun tweeting!
