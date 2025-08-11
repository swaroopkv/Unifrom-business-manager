
const API_BASE = "http://localhost:8000";

async function loadSchoolsForReport() {
    const res = await fetch(`${API_BASE}/schools`);
    if (!res.ok) return;
    const schools = await res.json();
    const schoolSelect = document.getElementById("schoolName");
    schoolSelect.innerHTML = '<option value="">Select School</option>';
    schools.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.school_name || s.name || s.school; // support different key names
        opt.textContent = s.school_name || s.name || s.school;
        schoolSelect.appendChild(opt);
    });
}

document.addEventListener("DOMContentLoaded", loadSchoolsForReport);

document.getElementById("studentReportForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const studentName = document.getElementById("studentName").value.trim();
    const schoolName = document.getElementById("schoolName").value.trim();
    const className = document.getElementById("className").value.trim();
    // Send parameters as JSON in POST request
    const res = await fetch(`${API_BASE}/reports/student`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            student_name: studentName,
            school_name: schoolName,
            class_name: className
        })
    });
    if (!res.ok) {
        document.getElementById("studentReportResult").innerHTML = `<div class='alert alert-danger'>No report found for the given details.</div>`;
        return;
    }
    const report = await res.json();
    let html = `<h4>Student: ${report.student_name}</h4>`;
    html += `<table class='table table-bordered'><thead><tr><th>Item Name</th><th>Size</th><th>Qty</th><th>Price</th><th>Total Price</th></tr></thead><tbody>`;
    let total = 0;
    report.items.forEach(item => {
        const itemTotal = item.qty * item.price;
        total += itemTotal;
        html += `<tr><td>${item.item_name}</td><td>${item.size}</td><td>${item.qty}</td><td>₹${item.price}</td><td>₹${itemTotal}</td></tr>`;
    });
    html += `</tbody></table>`;
    html += `<h5>Total Bill Amount: ₹${total}</h5>`;
    document.getElementById("studentReportResult").innerHTML = html;
});




