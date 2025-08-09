const API_BASE = "http://localhost:8000";

async function loadSchools() {
    let res = await fetch(`${API_BASE}/schools`);
    let data = await res.json();
    let sel = document.getElementById("schoolSelect");
    data.forEach(s => {
        let opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name;
        sel.appendChild(opt);
    });
}

async function loadItems() {
    let res = await fetch(`${API_BASE}/items`);
    let data = await res.json();
    let sel = document.getElementById("itemSelect");
    sel.innerHTML = "";
    data.forEach(i => {
        let opt = document.createElement("option");
        opt.value = i.id;
        opt.textContent = `${i.name} (${i.gender})`;
        sel.appendChild(opt);
    });
}

async function loadOrders() {
    let res = await fetch(`${API_BASE}/orders`);
    let data = await res.json();
    let tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";
    data.forEach(o => {
        let row = `<tr><td>${o.school_name}</td><td>${o.student_name}</td><td>${o.item_name}</td><td>${o.quantity}</td></tr>`;
        tbody.innerHTML += row;
    });
}

document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    let payload = {
        school_id: document.getElementById("schoolSelect").value,
        student_name: document.getElementById("studentName").value,
        item_id: document.getElementById("itemSelect").value,
        quantity: parseInt(document.getElementById("quantity").value)
    };
    await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    loadOrders();
});

loadSchools().then(loadItems).then(loadOrders);
