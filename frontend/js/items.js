const API_BASE = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
    loadItems();

    document.getElementById("itemForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const item_name = document.getElementById("itemName").value;
        const gender = document.getElementById("itemGender").value;

        await fetch(`${API_BASE}/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_name, gender })
        });

        document.getElementById("itemName").value = "";
        loadItems();
    });
});

async function loadItems() {
    const response = await fetch(`${API_BASE}/items`);
    const data = await response.json();
    const tbody = document.getElementById("itemsTableBody");
    tbody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        
        const idCell = document.createElement("td");
        idCell.textContent = item.item_id;

        const nameCell = document.createElement("td");
        nameCell.textContent = item.item_name;

        const genderCell = document.createElement("td");
        genderCell.textContent = item.gender;

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(genderCell);
        tbody.appendChild(row);
    });
}

        

