// navbar.js
async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        const navbarHTML = await response.text();
        document.getElementById('navbar-container').innerHTML = navbarHTML;
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}