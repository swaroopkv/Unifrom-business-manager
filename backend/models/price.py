from pydantic import BaseModel

class Price(BaseModel):
    school_name: str
    item_name: str
    item_size: str
    item_gender: str
    price: float