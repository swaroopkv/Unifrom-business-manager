from fastapi import APIRouter
from google_sheets_service import get_all_records, append_row
from models.school import School

router = APIRouter()

@router.get("/")
def list_schools():
    return get_all_records("Schools")

@router.post("/")
def add_school(school: School):
    new_id = max([s["school_id"] for s in get_all_records("Schools")], default=0) + 1
    append_row("Schools", [new_id, school.school_name])
    return {"message":"school added"}
