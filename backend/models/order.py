from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    item_name: str
    qty: int

class OrderCreate(BaseModel):
    student_name: str
    class_name: str
    school_name: str
    gender: str
    items: List[OrderItem]
    phone_number: str   