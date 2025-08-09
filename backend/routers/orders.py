from fastapi import APIRouter
from models.order import OrderCreate
from google_sheets_service import get_all_records, append_row

router = APIRouter()

@router.get("/")
def get_orders():
    return get_all_records("Orders")

@router.post("/")
def place_order(payload: OrderCreate):
    # load prices
    prices_rows = get_all_records("Prices")
    price_map = {(r["school_name"], r["item_name"]): float(r["price"]) for r in prices_rows}
    # append one row per item to Orders sheet
    for it in payload.items:
        price_per_unit = price_map.get((payload.school_name, it.item_name), 0)
        total_price = price_per_unit * it.qty
        append_row("Orders", [payload.student_name, payload.class_name, payload.school_name, payload.gender, payload.phone_number, it.item_name, it.qty, total_price])
    return {"message":"order recorded"}
