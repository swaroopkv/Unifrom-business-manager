from fastapi import APIRouter, Query
from collections import defaultdict
from google_sheets_service import get_all_records
from models.report import Student

router = APIRouter()

@router.post("/student")
def student_report(student: Student):
    orders = get_all_records("Orders")
    prices = get_all_records("Prices")
    print("Orders:", orders)
    # print("Prices:", prices)
    print(student)
    # Filter orders for the student, school, and class
    filtered = [o for o in orders if o.get("student_name") == student.student_name and o.get("school_name") == student.school_name and o.get("class") == student.class_name]
    if not filtered:
        return {"detail": "No report found"}
    items = []
    total_amount = 0
    for o in filtered:
        item_name = o.get("item_name")
        size = o.get("size") if "size" in o else o.get("item_size")
        qty = int(o.get("qty", 1))
        # Find price for this item/size/gender/school
        price_row = next((p for p in prices if p.get("item_name") == item_name and p.get("item_size", p.get("size")) == size and p.get("school_name") == student.school_name), None)
        price = float(price_row["price"]) if price_row and "price" in price_row else 0
        item_total = qty * price
        total_amount += item_total
        items.append({
            "item_name": item_name,
            "size": size,
            "qty": qty,
            "price": price
        })
    return {
        "student_name": str(student.student_name),
        "school_name": str(student.school_name),
        "class_name": str(student.class_name),
        "items": items,
        "total_amount": total_amount
    }


