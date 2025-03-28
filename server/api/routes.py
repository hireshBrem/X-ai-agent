from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List
import uuid

from ..models import Item, ItemCreate

router = APIRouter()

# In-memory database
items_db = {}


@router.get("/items/", response_model=List[Item])
async def read_items():
    """Get all items."""
    return [item for item in items_db.values()]


@router.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: int):
    """Get item by ID."""
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return items_db[item_id]


@router.post("/items/", response_model=Item, status_code=201)
async def create_item(item: ItemCreate):
    """Create a new item."""
    item_id = len(items_db) + 1
    items_db[item_id] = Item(
        id=item_id,
        title=item.title,
        description=item.description,
        created_at=datetime.now()
    )
    return items_db[item_id]


@router.delete("/items/{item_id}", status_code=204)
async def delete_item(item_id: int):
    """Delete an item."""
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del items_db[item_id]
    return None 