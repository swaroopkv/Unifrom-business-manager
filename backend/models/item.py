from pydantic import BaseModel
from typing import List


    

class Item(BaseModel):
    item_name: str
    gender: str
    item_sizes: List[str]

    