from fastapi import APIRouter
from google_sheets_service import get_all_records, append_row
from models.price import Price
router = APIRouter()

@router.get("/")
def list_prices():
    return get_all_records("Prices")

@router.post("/")
def set_price(price: Price):
    new_id = max([p["price_id"] for p in get_all_records("Prices")], default=0) + 1
    # Append the new price to the Google Sheet
    append_row("Prices", [new_id, price.school_name, price.item_name, price.item_size, price.item_gender, price.price])
    return {"message":"price saved"}
