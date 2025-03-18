import React, { useEffect, useRef } from 'react';
import { useVIFormContext } from '../../context/VIformcontext';
import { useLocationContext } from '../../context/locationcontext';
import { useEIFormContext } from '../../context/Eicontext';
import { useTranslation } from 'react-i18next';
import { Chart } from 'chart.js/auto';

const ChartComponent = () => {
  const { EIfinal } = useEIFormContext();
  const { utciArray = [] } = useLocationContext();
  const { VIfinal } = useVIFormContext();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("📦 Initializing Chart.js from NPM");
  
    if (!chartRef.current) {
      console.warn("❌ canvas ref is not ready");
      return;
    }

    initializeChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
        console.log("🧹 Chart instance destroyed");
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      updateChart();
    }
    console.log(utciArray,"fromchart");
  }, [EIfinal, VIfinal, utciArray]);

  const initializeChart = () => {
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');

    const dummyData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: t("hourly_risk_index") || "Hourly Risk Index",
            data: dummyData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    console.log("✅ Chart initialized with dummy data");
  };

  const updateChart = () => {
    const EI = parseFloat(EIfinal) || 1;
    const VI = parseFloat(VIfinal) || 1;

    const calculatedData =
      utciArray.length === 24
        ? utciArray.map(item => {
            const utci = typeof item === 'number' ? item : item?.value ?? 0;
            return utci * EI * VI;
          })
        : Array.from({ length: 24 }, () => 5); // fallback dummy values

    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = calculatedData;
      chartInstance.current.update();

      console.log("✅ Chart updated");
      console.table(calculatedData);
    } else {
      console.warn("⚠️ Chart instance not available");
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <canvas id='myChart' ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
