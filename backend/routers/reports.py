from fastapi import APIRouter
from collections import defaultdict
from google_sheets_service import get_all_records

router = APIRouter()

@router.get("/merchandise")
def merchandise_report():
    orders = get_all_records("Orders")
    items = {int(r["item_id"]): r["item_name"] for r in get_all_records("Items")}
    schools = {int(r["school_id"]): r["school_name"] for r in get_all_records("Schools")}
    report = defaultdict(lambda: defaultdict(int))
    for o in orders:
        s = int(o["school_id"])
        item = int(o["item_id"])
        qty = int(o["qty"])
        report[schools.get(s, "Unknown")][items.get(item, "Unknown Item")] += qty
    out = []
    for school, items_map in report.items():
        for item_name, qty in items_map.items():
            out.append({"school": school, "item": item_name, "total_qty": qty})
    return {"report": out}

@router.get("/student-bills")
def student_bills(student_name: str = None):
    orders = get_all_records("Orders")
    items = {int(r["item_id"]): r["item_name"] for r in get_all_records("Items")}
    schools = {int(r["school_id"]): r["school_name"] for r in get_all_records("Schools")}
    prices = { (int(r["school_id"]), int(r["item_id"])): float(r["price"]) for r in get_all_records("Prices") }

    if student_name:
        orders = [o for o in orders if o["student_name"].lower() == student_name.lower()]

    bills = {}
    for o in orders:
        name = o["student_name"]
        s = int(o["school_id"])
        item_id = int(o["item_id"])
        qty = int(o["qty"])
        unit = prices.get((s, item_id), 0)
        total = qty * unit
        if name not in bills:
            bills[name] = {"school": schools.get(s, "Unknown"), "items": [], "total_amount": 0}
        bills[name]["items"].append({"item": items.get(item_id, "Unknown"), "qty": qty, "unit_price": unit, "total_price": total})
        bills[name]["total_amount"] += total

    return {"bills": list({"student_name": n, **b} for n,b in bills.items())}
