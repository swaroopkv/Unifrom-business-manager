from fastapi import APIRouter
from google_sheets_service import get_all_records, append_row
from models.item import Item
router = APIRouter()

@router.get("/")
def list_items():
    return get_all_records("Items")

@router.post("/")
def add_item(item: Item):
    new_id = max([i["item_id"] for i in get_all_records("Items")], default=0) + 1
    append_row("Items", [new_id, item.item_name, item.gender])
    return {"message":"item added"}
