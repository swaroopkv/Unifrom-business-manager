const API_BASE = "http://localhost:8000";

async function loadMerchandiseReport() {
    let res = await fetch(`${API_BASE}/reports/merchandise`);
    let data = await res.json();
    let tbody = document.querySelector("#merchTable tbody");
    tbody.innerHTML = "";
    data.forEach(r => {
        let row = `<tr><td>${r.item_name}</td><td>${r.total_quantity}</td></tr>`;
        tbody.innerHTML += row;
    });
}

async function loadStudentReport() {
    let res = await fetch(`${API_BASE}/reports/student`);
    let data = await res.json();
    let tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";
    data.forEach(r => {
        let row = `<tr><td>${r.student_name}</td><td>${r.total_amount}</td></tr>`;
        tbody.innerHTML += row;
    });
}

loadMerchandiseReport();
loadStudentReport();
