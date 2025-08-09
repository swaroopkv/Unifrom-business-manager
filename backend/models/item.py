from pydantic import BaseModel

class Item(BaseModel):
    item_name: str
    gender: str
    