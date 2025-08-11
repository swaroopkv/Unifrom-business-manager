from pydantic import BaseModel
from typing import List

class Student(BaseModel):
    student_name: str
    class_name: int
    school_name: str


class Order(BaseModel):
    school_name: str
