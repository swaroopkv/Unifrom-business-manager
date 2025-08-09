from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    item_id: int
    qty: int

class OrderCreate(BaseModel):
    student_name: str
    school_id: int
    gender: str
    items: List[OrderItem]