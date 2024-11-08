// Initialize Blood Pressure Chart with Chart.js
const ctx = document.getElementById('bloodPressureChart').getContext('2d');
const bloodPressureChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Oct, 2023', 'Nov, 2023', 'Dec, 2023', 'Jan, 2024', 'Feb, 2024', 'Mar, 2024'],
        datasets: [
            {
                label: 'Systolic',
                data: [120, 140, 160, 130, 150, 160], // Sample data, will update with fetched data
                borderColor: '#E57373',
                backgroundColor: 'rgba(229, 115, 115, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#E57373',
                pointRadius: 5,
            },
            {
                label: 'Diastolic',
                data: [100, 90, 110, 80, 85, 78], // Sample data, will update with fetched data
                borderColor: '#8C6FE6',
                backgroundColor: 'rgba(140, 111, 230, 0.2)',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#8C6FE6',
                pointRadius: 5,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                min: 60,
                max: 180,
                ticks: { stepSize: 20 },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            }
        },
        plugins: {
            legend: { display: false }
        },
        elements: {
            line: { borderWidth: 2 }
        }
    }
});

// Encode credentials for Basic Auth
const username = 'coalition';
const password = 'skills-test';
const encodedCredentials = btoa(`${username}:${password}`);

// Function to fetch and display data for Jessica Taylor
async function fetchJessicaTaylorData() {
    try {
        const response = await fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const jessicaData = data.find(patient => patient.name === 'Jessica Taylor');

        if (jessicaData) {
            displayJessicaTaylorData(jessicaData);
            updateChart(jessicaData.diagnosis_history); // Update chart with real data
        } else {
            console.error('Jessica Taylor not found in the response data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display Jessica Taylor's data in the HTML
function displayJessicaTaylorData(data) {
    // Basic Profile Information
    document.getElementById('profile-picture').src = data.profile_picture || '';
    document.getElementById('name').innerText = data.name;
    document.getElementById('gender').innerText = data.gender;
    document.getElementById('dob').innerText = data.date_of_birth;
    document.getElementById('phone').innerText = data.phone_number;
    document.getElementById('emergency-contact').innerText = data.emergency_contact;
    document.getElementById('insurance').innerText = data.insurance_type;

    // Diagnosis History (only displaying March 2024 as per sample)
    const diagnosisMarch2024 = data.diagnosis_history.find(d => d.month === "March" && d.year === 2024);
    if (diagnosisMarch2024) {
        document.getElementById('systolic').innerText = diagnosisMarch2024.blood_pressure.systolic.value;
        document.getElementById('diastolic').innerText = diagnosisMarch2024.blood_pressure.diastolic.value;
        document.getElementById('heart-rate').innerText = `${diagnosisMarch2024.heart_rate.value} bpm`;
        document.getElementById('respiratory-rate').innerText = `${diagnosisMarch2024.respiratory_rate.value} bpm`;
        document.getElementById('temperature').innerText = `${diagnosisMarch2024.temperature.value}°F`;
    }

    // Diagnostic List
    const diagnosticList = document.getElementById('diagnostic-list');
    diagnosticList.innerHTML = ''; // Clear existing items
    data.diagnostic_list.forEach(diagnostic => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${diagnostic.name}</td><td>${diagnostic.description}</td><td>${diagnostic.status}</td>`;
        diagnosticList.appendChild(row);
    });

    // Lab Results
    const labResultsList = document.getElementById('lab-results');
    labResultsList.innerHTML = ''; // Clear existing items
    data.lab_results.forEach(result => {
        const li = document.createElement('li');
        li.innerText = result;
        labResultsList.appendChild(li);
    });
}

// Function to update Chart.js data based on diagnosis history
function updateChart(diagnosisHistory) {
    const months = diagnosisHistory.slice(-6).map(entry => `${entry.month}, ${entry.year}`);
    const systolicData = diagnosisHistory.slice(-6).map(entry => entry.blood_pressure.systolic.value);
    const diastolicData = diagnosisHistory.slice(-6).map(entry => entry.blood_pressure.diastolic.value);

    bloodPressureChart.data.labels = months;
    bloodPressureChart.data.datasets[0].data = systolicData;
    bloodPressureChart.data.datasets[1].data = diastolicData;
    bloodPressureChart.update();
}

// Fetch and display data on page load
document.addEventListener('DOMContentLoaded', fetchJessicaTaylorData);
