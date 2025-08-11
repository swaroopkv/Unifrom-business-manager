const API_BASE = "http://localhost:8000";

let itemsData = [];

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
    itemsData = data; // Store for later use
    let itemSelect = document.getElementById("itemSelect");
    itemSelect.innerHTML = ""; // Clear previous options
    data.forEach(i => {
        let opt = document.createElement("option");
        opt.value = i.item_id;
        opt.textContent = i.item_name;
        itemSelect.appendChild(opt);
    });
    updateSizeAndGenderOptions(); // Load for first item
}

function updateSizeAndGenderOptions() {
    const itemSelect = document.getElementById("itemSelect");
    const selectedId = itemSelect.value;
    const selectedItem = itemsData.find(i => i.item_id == selectedId);

    // Update sizes
    const sizeSelect = document.getElementById("itemSize");
    sizeSelect.innerHTML = "";
    if (selectedItem && selectedItem.item_sizes) {
        let sizes = typeof selectedItem.item_sizes === "string"
            ? selectedItem.item_sizes.split(",").map(s => s.trim())
            : selectedItem.item_sizes;
        // Add ALL option
        let allOpt = document.createElement("option");
        allOpt.value = "ALL";
        allOpt.textContent = "ALL";
        sizeSelect.appendChild(allOpt);
        sizes.forEach(size => {
            let opt = document.createElement("option");
            opt.value = size;
            opt.textContent = size;
            sizeSelect.appendChild(opt);
        });
    }

    // Update gender
    const genderSelect = document.getElementById("itemGender");
    genderSelect.innerHTML = "";
    if (selectedItem && selectedItem.gender) {
        let genders = Array.isArray(selectedItem.gender)
            ? selectedItem.gender
            : [selectedItem.gender];
        genders.forEach(gender => {
            let opt = document.createElement("option");
            opt.value = gender;
            opt.textContent = gender;
            genderSelect.appendChild(opt);
        });
    }
}

// When item changes, update size and gender selects
document.getElementById("itemSelect").addEventListener("change", updateSizeAndGenderOptions);

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

            const sizeCell = document.createElement("td");
            sizeCell.textContent = p.item_size;

            const genderCell = document.createElement("td");
            genderCell.textContent = p.item_gender

            const priceCell = document.createElement("td");
            priceCell.textContent = p.price;


            row.appendChild(schoolCell);
            row.appendChild(itemCell);
            row.appendChild(sizeCell);
            row.appendChild(genderCell);
            row.appendChild(priceCell);
            tbody.appendChild(row);
    });
}

document.getElementById("priceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const school_name = document.getElementById("schoolSelect").selectedOptions[0].textContent;
    const item_name = document.getElementById("itemSelect").selectedOptions[0].textContent;
    const item_size = document.getElementById("itemSize").value;
    const item_gender = document.getElementById("itemGender").value;
    const price = parseFloat(document.getElementById("price").value);

    // Find selected item sizes
    const selectedId = document.getElementById("itemSelect").value;
    const selectedItem = itemsData.find(i => i.item_id == selectedId);
    let sizes = [];
    if (selectedItem && selectedItem.item_sizes) {
        sizes = typeof selectedItem.item_sizes === "string"
            ? selectedItem.item_sizes.split(",").map(s => s.trim())
            : selectedItem.item_sizes;
    }

    // If ALL is selected, submit for each size
    if (item_size === "ALL") {
        for (const size of sizes) {
            let payload = {
                school_name,
                item_name,
                item_size: size,
                item_gender,
                price
            };
            await fetch(`${API_BASE}/prices`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
        }
    } else {
        let payload = {
            school_name,
            item_name,
            item_size,
            item_gender,
            price
        };
        await fetch(`${API_BASE}/prices`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
    }
    loadPrices();
});

document.getElementById("schoolSelect").addEventListener("change", loadPrices);

loadSchools().then(loadItems).then(loadPrices);
