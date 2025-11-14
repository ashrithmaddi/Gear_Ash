import Chart from "chart.js/auto";

const chartInstances = {}; // Store chart instances by ID

// Initialize Attendance Chart
export function initializeAttendanceChart(chartId) {
  const canvas = document.getElementById(chartId);
  if (!canvas) {
    console.error(`Canvas with ID "${chartId}" not found.`);
    return;
  }

  // Destroy existing chart instance if it exists
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
  }

  const ctx = canvas.getContext("2d");
  chartInstances[chartId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Present",
          data: [85, 92, 88, 95, 90, 87, 93],
          borderColor: "#1a237e",
          tension: 0.4,
          fill: false,
        },
        {
          label: "Absent",
          data: [15, 8, 12, 5, 10, 13, 7],
          borderColor: "#dc3545",
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

// Initialize Fee Collection Chart
export function initializeFeeChart(chartId) {
  const canvas = document.getElementById(chartId);
  if (!canvas) {
    console.error(`Canvas with ID "${chartId}" not found.`);
    return;
  }

  // Destroy existing chart instance if it exists
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
  }

  const ctx = canvas.getContext("2d");
  chartInstances[chartId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Collected", "Pending"],
      datasets: [
        {
          data: [75, 25],
          backgroundColor: ["#28a745", "#dc3545"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Destroy Chart
export function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
    delete chartInstances[chartId];
  }
}