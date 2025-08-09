from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def generate_invoice(student_name, school, items, total, filepath):
    c = canvas.Canvas(filepath, pagesize=A4)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 800, f"Invoice - {student_name}")
    c.setFont("Helvetica", 11)
    c.drawString(50, 780, f"School: {school}")
    y = 740
    c.drawString(50, y, "Item")
    c.drawString(250, y, "Qty")
    c.drawString(330, y, "Unit")
    c.drawString(420, y, "Total")
    y -= 20
    for it in items:
        c.drawString(50, y, str(it["item"]))
        c.drawString(250, y, str(it["qty"]))
        c.drawString(330, y, str(it["unit_price"]))
        c.drawString(420, y, str(it["total_price"]))
        y -= 20
    c.drawString(50, y-10, f"Total Amount: {total}")
    c.save()
