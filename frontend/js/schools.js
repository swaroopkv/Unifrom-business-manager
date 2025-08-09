const apiBase = "http://127.0.0.1:8000/schools/";

async function loadSchools() {
    try {
        const response = await fetch(apiBase);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const tableBody = document.getElementById("schoolsTableBody");
        tableBody.innerHTML = "";

        data.forEach(school => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = school.school_id;

            const nameCell = document.createElement("td");
            nameCell.textContent = school.school_name;

            row.appendChild(idCell);
            row.appendChild(nameCell);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading schools:", error);
    }
}

async function addSchool(event) {
    event.preventDefault();

    const schoolName = document.getElementById("schoolName").value.trim();
    if (!schoolName) return alert("Please enter a school name");

    try {
        const response = await fetch(apiBase, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ school_name: schoolName })
        });

        if (!response.ok) throw new Error("Failed to add school");

        document.getElementById("schoolName").value = "";
        loadSchools();
    } catch (error) {
        console.error("Error adding school:", error);
    }
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
    loadSchools();
    document.getElementById("addSchoolForm").addEventListener("submit", addSchool);
});
