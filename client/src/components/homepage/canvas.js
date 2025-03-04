import React, { useEffect} from 'react';


const ChartComponent = () => {
    

    useEffect(() => {
        // Dynamically load the Chart.js script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/chart.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            // Chart.js Data
            const hourlyData = [0.34, 0.5, 0.4, 0.3, 0.2, 0.3, 0.45, 0.5, 0.55, 0.4, 0.35, 0.3, 0.25, 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
            const ctx = document.getElementById('myChart').getContext('2d');

            // Initialize Chart.js
            new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => i + 1),
                    datasets: [{
                        label: 'Hourly Risk Index',
                        data: hourlyData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: true,
                    }]
                },
                options: {
                    maintainAspectRatio: false,

                    scales: {
                        y: {
                            beginAtZero: true,
                        }
                    }
                }
            });
        };

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <canvas id="myChart"></canvas>

    );
};

export default ChartComponent;
