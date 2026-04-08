// Navigation logic
const logo = document.getElementById('logoLink');
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
console.log("scripts.js loaded successfully");

function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active');

    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });

    // Load CSV only when Televisions page is shown
    if (pageId === 'televisions') {
        loadCSVData();
    }
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const pageId = button.getAttribute('data-page');
        showPage(pageId);
    });
});

logo.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
});

// Show home page on load
showPage('home');

// CSV loading function
function loadCSVData() {
    const container = document.getElementById('data-table');
    if (!container) return;

    // Hardcoded CSV data as a string
    const csvText = `Year,EnergySource,Value
2020,Solar,120
2020,Wind,80
2021,Solar,150
2021,Wind,95`;

    const rows = csvText.trim().split('\n');
    if (rows.length < 2) {
        container.innerHTML = '<p>No data found.</p>';
        return;
    }
    const headers = rows[0].split(',');
    const data = rows.slice(1).map(row => row.split(','));

    let tableHtml = '<table><thead><tr>';
    headers.forEach(h => tableHtml += `<th>${h}</th>`);
    tableHtml += '</tr></thead><tbody>';
    data.forEach(row => {
        tableHtml += '<tr>';
        row.forEach(cell => tableHtml += `<td>${cell}</td>`);
        tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    container.innerHTML = tableHtml;
}