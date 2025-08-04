// Chart creation and management functions

let pieChart = null;
let lineChart = null;

/**
 * Create pie chart for investment breakdown
 * @param {Object} data - Calculation results
 */
function createPieChart(data) {
  const ctx = document.getElementById('pieChart');
  if (!ctx) return;

  // Destroy existing chart
  if (pieChart) {
    pieChart.destroy();
  }

  const chartData = {
    labels: ['Total Investment', 'Expected Returns'],
    datasets: [{
      data: [data.totalInvestment, data.returns],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            const percentage = ((context.parsed / (data.totalInvestment + data.returns)) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000
    }
  };

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: options
  });
}

/**
 * Create line chart for growth over time
 * @param {Object} data - Calculation results
 */
function createLineChart(data) {
  const ctx = document.getElementById('lineChart');
  if (!ctx) return;

  // Destroy existing chart
  if (lineChart) {
    lineChart.destroy();
  }

  const labels = data.yearlyBreakdown.map(item => `Year ${item.year}`);
  const investmentData = data.yearlyBreakdown.map(item => item.investment);
  const valueData = data.yearlyBreakdown.map(item => item.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Investment',
        data: investmentData,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Portfolio Value',
        data: valueData,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          },
          afterBody: function(tooltipItems) {
            const yearData = data.yearlyBreakdown[tooltipItems[0].dataIndex];
            return [
              '',
              `Returns: ${formatCurrency(yearData.returns)}`,
              `Growth: ${formatPercentage((yearData.value / yearData.investment - 1) * 100)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Inter'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
          font: {
            family: 'Inter'
          }
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    }
  };

  lineChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: options
  });
}

/**
 * Create comparison chart for multiple SIP types
 * @param {Array} comparisonData - Array of calculation results
 */
function createComparisonChart(comparisonData) {
  const ctx = document.getElementById('comparisonChart');
  if (!ctx) return;

  const labels = comparisonData.map(item => `${item.type}\n${item.category}`);
  const investmentData = comparisonData.map(item => item.totalInvestment);
  const valueData = comparisonData.map(item => item.futureValue);
  const returnsData = comparisonData.map(item => item.returns);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Investment',
        data: investmentData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      },
      {
        label: 'Expected Returns',
        data: returnsData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2
      },
      {
        label: 'Total Value',
        data: valueData,
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12
          },
          maxRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
          font: {
            family: 'Inter'
          }
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: options
  });
}

/**
 * Create monthly investment pattern chart for flexible SIP
 * @param {Array} monthlyAmounts - Array of monthly amounts
 */
function createFlexiblePatternChart(monthlyAmounts) {
  const ctx = document.getElementById('flexiblePatternChart');
  if (!ctx) return;

  const labels = monthlyAmounts.map((_, index) => `Month ${index + 1}`);
  const amounts = monthlyAmounts.map(amount => parseFloat(amount) || 0);

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Monthly Investment',
      data: amounts,
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Investment: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 10
          },
          maxTicksLimit: 12
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
          font: {
            family: 'Inter'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: options
  });
}

/**
 * Update chart colors based on theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateChartsTheme(theme) {
  const textColor = theme === 'dark' ? '#f8fafc' : '#1e293b';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const updateOptions = (chart) => {
    if (!chart) return;
    
    chart.options.plugins.legend.labels.color = textColor;
    
    // Only update scales if they exist (pie charts don't have scales)
    if (chart.options.scales) {
      if (chart.options.scales.x) {
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.x.grid.color = gridColor;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.ticks.color = textColor;
        chart.options.scales.y.grid.color = gridColor;
      }
    }
    
    chart.update();
  };

  updateOptions(pieChart);
  updateOptions(lineChart);
}

/**
 * Destroy all charts
 */
function destroyAllCharts() {
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }
  
  if (lineChart) {
    lineChart.destroy();
    lineChart = null;
  }
}

/**
 * Resize charts for mobile view
 */
function resizeChartsForMobile() {
  const isMobileView = window.innerWidth <= 768;
  
  const updateChartForMobile = (chart) => {
    if (!chart) return;
    
    if (isMobileView) {
      chart.options.plugins.legend.labels.font.size = 12;
      chart.options.plugins.legend.labels.padding = 15;
      
      if (chart.options.scales) {
        if (chart.options.scales.x) chart.options.scales.x.ticks.font.size = 10;
        if (chart.options.scales.y) chart.options.scales.y.ticks.font.size = 10;
      }
    } else {
      chart.options.plugins.legend.labels.font.size = 14;
      chart.options.plugins.legend.labels.padding = 20;
      
      if (chart.options.scales) {
        if (chart.options.scales.x) chart.options.scales.x.ticks.font.size = 12;
        if (chart.options.scales.y) chart.options.scales.y.ticks.font.size = 12;
      }
    }
    
    chart.update();
  };

  updateChartForMobile(pieChart);
  updateChartForMobile(lineChart);
}

// Listen for window resize to adjust charts
window.addEventListener('resize', debounce(resizeChartsForMobile, 250));