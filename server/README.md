
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

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- GET `/api/v1/items/` - List all items
- GET `/api/v1/items/{item_id}` - Get a specific item
- POST `/api/v1/items/` - Create a new item
- DELETE `/api/v1/items/{item_id}` - Delete an item
