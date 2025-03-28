# X-Browser-Agent

A full-stack application with a modern Next.js frontend and FastAPI backend.

![X-Browser-Agent](https://via.placeholder.com/800x400?text=X-Browser-Agent)

## Overview

X-Browser-Agent is a web application that provides a browser agent interface with RESTful API support. The project consists of:

- **Frontend**: Modern UI built with Next.js, React 19, Tailwind CSS, and TypeScript
- **Backend**: FastAPI server with RESTful endpoints

## Features

- 💬 **Modern Chat Interface**: Clean design with real-time streaming support
- 🖼️ **Multi-modality Support**: Handles various content types
- 🎨 **Customizable UI**: Built with Tailwind CSS for easy styling
- 🧰 **Modern Tech Stack**: Next.js, TypeScript, shadcn/ui, Framer Motion
- 🔄 **RESTful API**: FastAPI backend with comprehensive endpoints
- 📚 **API Documentation**: Swagger and ReDoc documentation

## Project Structure

```
X-Browser-Agent/
├── client/              # Frontend Next.js application
│   ├── src/             # Source code
│   │   ├── app/         # Next.js app directory
│   │   ├── components/  # UI components
│   │   ├── api/         # API client code
│   │   ├── lib/         # Utility functions
│   │   ├── hooks/       # React hooks
│   │   ├── types/       # TypeScript type definitions
│   │   └── store.ts     # State management
│   ├── public/          # Static assets
│   └── ...              # Configuration files
│
└── server/              # Backend FastAPI application
    ├── api/             # API routes and endpoints
    │   ├── routes.py    # API route definitions
    │   └── __init__.py
    ├── main.py          # FastAPI application entry point
    ├── models.py        # Pydantic data models
    └── ...              # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (frontend)
- Python 3.8+ (backend)

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Set up a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the server:

```bash
python -m server.main
```

The API will be available at [http://localhost:8000](http://localhost:8000).

## API Documentation

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## API Endpoints

- GET `/api/v1/items/` - List all items
- GET `/api/v1/items/{item_id}` - Get a specific item
- POST `/api/v1/items/` - Create a new item
- DELETE `/api/v1/items/{item_id}` - Delete an item

## Environment Variables

### Frontend

Create a `.env.local` file in the client directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend

The server uses a `.env` file for configuration. An example is provided in `.env.example`.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./client/CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](./client/LICENSE).
