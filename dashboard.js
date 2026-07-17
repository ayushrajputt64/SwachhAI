const patnaData = {
    hotspots: [
        { name: "Boring Road", circle: "Bankipur", lat: 25.6093, lng: 85.1376, wasteTPD: 42, type: "Mixed", priority: "Critical", lastCleaned: "3 days ago", color: "red" },
        { name: "Gardanibagh", circle: "Kankarbagh", lat: 25.5921, lng: 85.1554, wasteTPD: 38, type: "Organic+Plastic", priority: "Critical", lastCleaned: "4 days ago", color: "red" },
        { name: "Patna City Circle", circle: "Patna City", lat: 25.6074, lng: 85.1977, wasteTPD: 35, type: "Mixed", priority: "High", lastCleaned: "2 days ago", color: "orange" },
        { name: "Azimabad Zone", circle: "Azimabad", lat: 25.6180, lng: 85.1050, wasteTPD: 29, type: "Plastic", priority: "High", lastCleaned: "2 days ago", color: "orange" },
        { name: "Rajendra Nagar", circle: "Patliputra", lat: 25.5941, lng: 85.0822, wasteTPD: 21, type: "Organic", priority: "Medium", lastCleaned: "Yesterday", color: "yellow" },
        { name: "New Capital Area", circle: "New Capital", lat: 25.6280, lng: 85.1500, wasteTPD: 18, type: "Paper+Plastic", priority: "Medium", lastCleaned: "Yesterday", color: "yellow" },
        { name: "Gandhi Maidan", circle: "Bankipur", lat: 25.6178, lng: 85.1372, wasteTPD: 12, type: "Mixed", priority: "Low", lastCleaned: "Today", color: "green" },
        { name: "Patliputra Colony", circle: "Patliputra", lat: 25.6350, lng: 85.0750, wasteTPD: 9, type: "Organic", priority: "Low", lastCleaned: "Today", color: "green" }
    ]
};

function initCompositionChart() {
    const canvas = document.getElementById('compositionChart');
    if (!canvas) return;
    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Biodegradable 47.4%', 'Non-Biodegradable 27.2%', 'Inert 25.4%'],
            datasets: [{
                data: [47.4, 27.2, 25.4],
                backgroundColor: ['#22c55e', '#ef4444', '#94a3b8'],
                borderColor: ['#16a34a', '#dc2626', '#64748b'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#c9d1d9', font: { size: 11 }, padding: 15 }
                }
            }
        }
    });
}

function initTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Waste Generated (TPD)',
                    data: [920, 945, 960, 935, 970, 1050, 890],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    tension: 0.4, fill: true
                },
                {
                    label: 'Currently Collected (TPD)',
                    data: [580, 600, 610, 595, 615, 640, 560],
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249,115,22,0.1)',
                    tension: 0.4, fill: true
                },
                {
                    label: 'SwachhAI Target (TPD)',
                    data: [900, 925, 940, 915, 950, 1020, 870],
                    borderColor: '#22c55e',
                    borderDash: [5, 5],
                    tension: 0.4, fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#c9d1d9', font: { size: 10 } } }
            },
            scales: {
                x: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } },
                y: { ticks: { color: '#8b949e' }, grid: { color: '#21262d' } }
            }
        }
    });
}

function buildTable() {
    const tbody = document.getElementById("hotspotTable");
    if (!tbody) return;
    const colors = { Critical: "#ef4444", High: "#f97316", Medium: "#eab308", Low: "#22c55e" };
    patnaData.hotspots.forEach(spot => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${spot.name}</td>
            <td>${spot.circle}</td>
            <td>${spot.wasteTPD} TPD</td>
            <td>${spot.type}</td>
            <td><span style="color:${colors[spot.priority]};font-weight:bold">● ${spot.priority}</span></td>
            <td>${spot.lastCleaned}</td>
        `;
        tbody.appendChild(row);
    });
}

window.onload = () => {
    setTimeout(initCompositionChart, 300);
    setTimeout(initTrendChart, 400);
    setTimeout(buildTable, 500);
};