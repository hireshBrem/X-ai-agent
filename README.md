# X-Browser-Agent

X-Browser-Agent is a web automation platform that allows AI agents to interact with web browsers to complete tasks. The project consists of a React-based frontend client and a FastAPI-based backend server that integrates with Browserbase for browser automation.

![Demo of X-Browser-Agent](/path/to/screenshot.png)

## Features

- 🤖 AI-powered browser automation using large language models
- 🌐 Integration with Browserbase for reliable browser session management
- 📱 Modern, responsive UI built with Next.js and Tailwind CSS
- 🔄 Real-time session recording and playback
- 🔌 Extensible architecture supporting various LLMs (OpenAI, Anthropic)

## Architecture

The project is divided into two main components:

### Client (@client)

A modern web application built with:
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling and responsive design
- **Radix UI** - Accessible UI components
- **Zustand** - State management
- **Framer Motion** - For animations and transitions

### Server (@server)

A Python backend built with:
- **FastAPI** - High-performance web framework for building APIs
- **Browser-use** - Library for browser automation with LLMs
- **Browserbase** - Browser infrastructure for reliable web automation
- **LangChain** - Framework for developing applications powered by language models
- **Playwright** - Browser automation library

## Getting Started

### Prerequisites

- Node.js 18.0+ (Client)
- Python 3.10+ (Server)
- Browserbase API key
- OpenAI API key or Anthropic API key

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

3. Configure environment variables:
```
# Create a .env file in the client directory with:
NEXT_PUBLIC_API_URL=http://localhost:8000
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

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows, use .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```
# Create a .env file in the server directory with:
BROWSERBASE_API_KEY=your_browserbase_api_key
OPENAI_API_KEY=your_openai_api_key
```

5. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

6. The server will be available at http://localhost:8000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Enter your Browserbase API key and project ID
3. Enter your OpenAI API key
4. Click "Run Agent" to start a browser automation session
5. Watch as the AI agent navigates the web and completes the specified task
6. View recordings of completed sessions

## API Endpoints

The server provides several API endpoints:

- `POST /api/run-agent` - Run an automation agent with specified keys
- `POST /api/get-session` - Get details of a specific Browserbase session
- `POST /api/get-live-url` - Get a live URL to watch the session in real-time
- `POST /api/get-session-recording` - Get the recording of a session
- `POST /api/get-session-download` - Get downloads from a session

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Browserbase](https://browserbase.com) for browser infrastructure
- [Browser-use](https://github.com/browser-use/browser-use) for browser automation with LLMs
- [LangChain](https://langchain.com) for LLM integration
