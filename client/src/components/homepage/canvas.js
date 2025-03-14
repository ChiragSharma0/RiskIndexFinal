import React, { useEffect, useRef } from 'react';
import { useVIFormContext } from '../../context/VIformcontext';
import { useLocationContext } from '../../context/locationcontext';
import { useEIFormContext } from '../../context/Eicontext';

const ChartComponent = () => {
  const { EIfinal } = useEIFormContext();
  const { utciArray = [] } = useLocationContext(); // default to [] to avoid errors
  const { VIfinal } = useVIFormContext();
  const chartRef = useRef(null); // Store Chart instance

  // Load Chart.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/chart.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializeChart();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (window.Chart && chartRef.current) {
      updateChart();
    }
  }, [EIfinal, VIfinal, utciArray]);

  // Initialize chart
  const initializeChart = () => {
    const ctx = document.getElementById('myChart')?.getContext('2d');
    if (!ctx) return;

    chartRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => i + 1),
        datasets: [{
          label: 'Hourly Risk Index',
          data: Array(24).fill(0),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true,
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    updateChart();
  };

  // Update chart data
  const updateChart = () => {
    const EI = parseFloat(EIfinal) || 0;
    const VI = parseFloat(VIfinal) || 0;

    const multipliedData = utciArray.map(item => {
      const utci = typeof item === 'number' ? item : item?.value ?? 0;
      return utci * EI * VI;
    });

    if (chartRef.current) {
      chartRef.current.data.datasets[0].data = multipliedData;
      chartRef.current.update();
    }
  };

  return (
    <div style={{ height: '100px' }}>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default ChartComponent;
