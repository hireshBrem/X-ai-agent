# Simple FastAPI Server

A simple and neat REST API built with FastAPI.

## Features

- RESTful endpoints for item management
- OpenAPI documentation
- CORS support

## Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Server

Start the server with:

```bash
# From the project root directory
python -m server.main
```

Or with uvicorn directly:

```bash
uvicorn server.main:app --reload
```

The server will be available at http://localhost:8000
