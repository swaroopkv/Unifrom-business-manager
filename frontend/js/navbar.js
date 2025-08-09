// navbar.js
async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        const navbarHTML = await response.text();
        document.getElementById('navbar-container').innerHTML = navbarHTML;

        // Highlight current page
        const path = window.location.pathname.split('/').pop();
        const links = document.querySelectorAll('#navbar-container a');
        links.forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }); 
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
}