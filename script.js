const apiURL = 'https://api.example.com/patient-data'; // Replace with actual API URL

async function fetchPatientData() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        const jessicaData = data.find(patient => patient.name === 'Jessica Taylor');

        document.querySelector('.profile h3').textContent = jessicaData.name;
        document.querySelector('.profile p:nth-child(3)').textContent = `Date of Birth: ${jessicaData.dob}`;
        document.querySelector('.profile p:nth-child(4)').textContent = `Gender: ${jessicaData.gender}`;
        document.querySelector('.profile p:nth-child(5)').textContent = `Contact Info: ${jessicaData.contact}`;
        
        const ctx = document.getElementById('bloodPressureChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: jessicaData.bpData.months,
                datasets: [
                    {
                        label: 'Systolic',
                        data: jessicaData.bpData.systolic,
                        borderColor: '#f87171',
                        fill: false
                    },
                    {
                        label: 'Diastolic',
                        data: jessicaData.bpData.diastolic,
                        borderColor: '#60a5fa',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching patient data:', error);
    }
}

fetchPatientData();
