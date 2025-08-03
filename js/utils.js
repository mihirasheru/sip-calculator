// Utility functions for the SIP Calculator

/**
 * Format number as Indian currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

/**
 * Format number with Indian number system
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  if (isNaN(num) || num === null || num === undefined) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}

/**
 * Format percentage
 * @param {number} percent - Percentage to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercentage(percent, decimals = 1) {
  if (isNaN(percent) || percent === null || percent === undefined) {
    return '0%';
  }
  
  return `${percent.toFixed(decimals)}%`;
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {string} type - Type of toast (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          container.removeChild(toast);
        }
      }, 300);
    }
  }, duration);

  // Click to dismiss
  toast.addEventListener('click', () => {
    if (toast.parentNode) {
      container.removeChild(toast);
    }
  });
}

/**
 * Animate number counting up
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} formatter - Function to format the number
 */
function animateNumber(element, start, end, duration = 1000, formatter = formatNumber) {
  if (!element) return;
  
  const startTime = performance.now();
  const difference = end - start;

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (difference * easeOutQuart);
    
    element.textContent = formatter(current);
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = formatter(end);
    }
  }
  
  requestAnimationFrame(updateNumber);
}

/**
 * Generate random ID
 * @returns {string} Random ID string
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
function isMobile() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Smooth scroll to element
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} offset - Offset from top
 */
function scrollToElement(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Get theme preference
 * @returns {string} Theme preference ('light' or 'dark')
 */
function getThemePreference() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Set theme
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update theme toggle button
  const themeToggle = document.getElementById('darkModeToggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-icon');
    const text = themeToggle.querySelector('.theme-text');
    
    if (theme === 'dark') {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    } else {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    }
  }
}

/**
 * Initialize theme
 */
function initializeTheme() {
  const theme = getThemePreference();
  setTheme(theme);
}

/**
 * Calculate compound interest
 * @param {number} principal - Principal amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} time - Time in years
 * @param {number} compoundingFrequency - Compounding frequency per year
 * @returns {number} Final amount
 */
function calculateCompoundInterest(principal, rate, time, compoundingFrequency = 12) {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
}

/**
 * Calculate effective annual rate
 * @param {number} totalValue - Total value after investment
 * @param {number} totalInvestment - Total amount invested
 * @param {number} years - Investment period in years
 * @returns {number} Effective annual rate as percentage
 */
function calculateEffectiveRate(totalValue, totalInvestment, years) {
  if (totalInvestment <= 0 || years <= 0) return 0;
  return (Math.pow(totalValue / totalInvestment, 1 / years) - 1) * 100;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Export object to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename for the CSV
 */
function exportToCSV(data, filename = 'sip-data.csv') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}