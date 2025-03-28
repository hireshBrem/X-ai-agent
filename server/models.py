from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ItemBase(BaseModel):
    """Base item model."""
    title: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    """Item creation model."""
    pass


class Item(ItemBase):
    """Item model with ID and timestamp."""
    id: int
    created_at: datetime

    class Config:
        """Pydantic config."""
        from_attributes = True 