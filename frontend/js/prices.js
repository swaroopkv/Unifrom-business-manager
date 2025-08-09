const API_BASE = "http://localhost:8000";

async function loadSchools() {
    let response = await fetch(`${API_BASE}/schools`);
    let data = await response.json();
    let schoolSelect = document.getElementById("schoolSelect");
    data.forEach(s => {
        let opt = document.createElement("option");
        opt.value = s.school_id;
        opt.textContent = s.school_name;
        schoolSelect.appendChild(opt);
    });
}

async function loadItems() {
    let response = await fetch(`${API_BASE}/items`);
    let data = await response.json();
    let itemSelect = document.getElementById("itemSelect");
    data.forEach(i => {
        let opt = document.createElement("option");
        opt.value = i.item_id;
        opt.textContent = i.item_name;
        itemSelect.appendChild(opt);
    });
}

async function loadPrices() {
    let schoolId = document.getElementById("schoolSelect").value;
    let res = await fetch(`${API_BASE}/prices?school_id=${schoolId}`);
    let data = await res.json();
    let tbody = document.getElementById("pricesTableBody");
    tbody.innerHTML = "";
    data.forEach(p => {
            const row = document.createElement("tr");
            

            const schoolCell = document.createElement("td");
            schoolCell.textContent = p.school_name;

            const itemCell = document.createElement("td");
            itemCell.textContent = p.item_name;

            const priceCell = document.createElement("td");
            priceCell.textContent = p.price;


            row.appendChild(schoolCell);
            row.appendChild(itemCell);
            row.appendChild(priceCell);
            tbody.appendChild(row);
    });
}

document.getElementById("priceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    let payload = {
        school_name: document.getElementById("schoolSelect").selectedOptions[0].textContent,
        item_name: document.getElementById("itemSelect").selectedOptions[0].textContent,
        price: parseFloat(document.getElementById("price").value)
    };
    await fetch(`${API_BASE}/prices`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    loadPrices();
});

document.getElementById("schoolSelect").addEventListener("change", loadPrices);

loadSchools().then(loadItems).then(loadPrices);
