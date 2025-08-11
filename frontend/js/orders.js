const API_BASE = "http://localhost:8000";

async function loadSchools() {
    let res = await fetch(`${API_BASE}/schools`);
    let data = await res.json();
    let sel = document.getElementById("schoolSelect");
    data.forEach(s => {
        let opt = document.createElement("option");
        opt.value = s.school_id;
        opt.textContent = s.school_name;
        sel.appendChild(opt);
    });
}

async function loadItemsForOrder() {
    const schoolName = document.getElementById("schoolSelect").selectedOptions[0].textContent;
    const gender = document.getElementById("genderSelect").value;
    if (!schoolName || !gender) {
        document.getElementById("itemsContainer").innerHTML = "<div class='text-muted'>Select school and gender to see items.</div>";
        return;
    }
    // Fetch items and prices
    const [itemsRes, pricesRes] = await Promise.all([
        fetch(`${API_BASE}/items`),
        fetch(`${API_BASE}/prices`)
    ]);
    const items = await itemsRes.json();
    const prices = await pricesRes.json();
    // Build price map for school
    const validPrices = prices.filter(p => p.school_name == schoolName);
    const priceItemNames = new Set(validPrices.map(p => p.item_name));
    // Filter items by gender/unisex and valid price
    const filteredItems = items.filter(i => (i.gender === gender || i.gender === "Unisex") && priceItemNames.has(i.item_name));
    // Render checkboxes, size dropdowns, and quantity inputs
    const container = document.getElementById("itemsContainer");
    if (filteredItems.length === 0) {
        container.innerHTML = "<div class='text-danger'>No items available for selected gender and school.</div>";
        return;
    }
    container.innerHTML = filteredItems.map(i => {
        const priceObj = validPrices.find(p => p.item_name === i.item_name);
        // Get sizes as array
        let sizes = typeof i.item_sizes === "string" ? i.item_sizes.split(",").map(s => s.trim()) : i.item_sizes;
        let sizeOptions = sizes.map(size => `<option value="${size}">${size}</option>`).join("");
        return `<div class='form-check mb-2'>
            <input class='form-check-input item-check' type='checkbox' id='item_${i.item_id}' value='${i.item_id}'>
            <label class='form-check-label' for='item_${i.item_id}'>${i.item_name} (${i.gender}) - ₹${priceObj ? priceObj.price : "N/A"}</label>
            <select class='form-select mt-1 item-size' id='size_${i.item_id}' style='max-width:120px;display:inline-block;' ${priceObj ? "" : "disabled"}>
                ${sizeOptions}
            </select>
            <input type='number' min='1' class='form-control mt-1 item-qty' id='qty_${i.item_id}' placeholder='Quantity' style='max-width:120px;display:inline-block;' disabled>
        </div>`;
    }).join("");
    // Enable/disable quantity input based on checkbox
    container.querySelectorAll('.item-check').forEach(chk => {
        chk.addEventListener('change', function() {
            const qtyInput = document.getElementById(`qty_${this.value}`);
            qtyInput.disabled = !this.checked;
            if (!this.checked) qtyInput.value = "";
            // Enable/disable size dropdown as well
            const sizeSelect = document.getElementById(`size_${this.value}`);
            sizeSelect.disabled = !this.checked;
        });
    });
}


document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const school_name = document.getElementById("schoolSelect").selectedOptions[0].textContent;
    const student_name = document.getElementById("studentName").value;
    const class_name = document.getElementById("className").value;
    const phone_number = document.getElementById("phoneNumber").value;
    const gender = document.getElementById("genderSelect").value;
    // Collect selected items and quantities
    const items = [];
    document.querySelectorAll('.item-check:checked').forEach(chk => {
        const qty = parseInt(document.getElementById(`qty_${chk.value}`).value);
        const size = document.getElementById(`size_${chk.value}`).value;
        if (qty && qty > 0) {
            items.push({ item_name: chk.nextElementSibling.textContent.split(" ")[0], qty, size });
        }
    });
    if (items.length === 0) {
        alert("Select at least one item and enter quantity.");
        return;
    }
    // Check for duplicate order
    let duplicate = false;
    let res = await fetch(`${API_BASE}/orders`);
    let existingOrders = await res.json();
    console.log("Existing orders:", existingOrders);
    items.forEach(it => {
        if (existingOrders.some(o => o.student_name === student_name && o.item_name === it.item_name && o.phone_number == phone_number)) {
            duplicate = true;
        }
    });
    if (duplicate) {
        alert("Order already exists for this student, item, and phone number.");
        return;
    }
    const payload = {
        school_name,
        student_name,
        class_name,
        phone_number,
        gender,
        items
    };
    console.log("Payload to send:", payload);
    console.log("items",items);

    await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    // Show success message
    const form = document.getElementById("orderForm");
    form.insertAdjacentHTML("beforebegin", `<div class="alert alert-success" id="orderSuccessMsg">Order created successfully!</div>`);
    setTimeout(() => {
        const msg = document.getElementById("orderSuccessMsg");
        if (msg) msg.remove();
    }, 3000);

    document.getElementById("orderForm").reset();
    document.getElementById("itemsContainer").innerHTML = "";
});

loadSchools();
// Load items when school or gender changes
document.getElementById("schoolSelect").addEventListener("change", loadItemsForOrder);
document.getElementById("genderSelect").addEventListener("change", loadItemsForOrder);
