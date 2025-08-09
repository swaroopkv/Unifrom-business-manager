from pydantic import BaseModel

class Price(BaseModel):
    school_name: str
    item_name: str
    price: float