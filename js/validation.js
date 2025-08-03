// Form validation utilities

/**
 * Validation rules for different input types
 */
const validationRules = {
  monthlyAmount: {
    required: true,
    min: 500,
    max: 1000000,
    message: 'Monthly amount must be between ₹500 and ₹10,00,000'
  },
  years: {
    required: true,
    min: 1,
    max: 50,
    message: 'Investment period must be between 1 and 50 years'
  },
  stepUpPercent: {
    required: true,
    min: 1,
    max: 50,
    message: 'Step-up percentage must be between 1% and 50%'
  },
  flexibleMonths: {
    required: true,
    min: 6,
    max: 600,
    message: 'Investment period must be between 6 and 600 months'
  },
  inflationRate: {
    required: false,
    min: 0,
    max: 20,
    message: 'Inflation rate must be between 0% and 20%'
  },
  goalAmount: {
    required: false,
    min: 0,
    max: 100000000,
    message: 'Goal amount must be less than ₹10 crores'
  }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @returns {Object} Validation result
 */
function validateField(fieldName, value) {
  const rule = validationRules[fieldName];
  if (!rule) return { isValid: true };

  const result = {
    isValid: true,
    message: ''
  };

  // Check if required
  if (rule.required && (value === '' || value === null || value === undefined)) {
    result.isValid = false;
    result.message = `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
    return result;
  }

  // Skip further validation if not required and empty
  if (!rule.required && (value === '' || value === null || value === undefined)) {
    return result;
  }

  const numValue = parseFloat(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    result.isValid = false;
    result.message = 'Please enter a valid number';
    return result;
  }

  // Check minimum value
  if (rule.min !== undefined && numValue < rule.min) {
    result.isValid = false;
    result.message = rule.message || `Value must be at least ${rule.min}`;
    return result;
  }

  // Check maximum value
  if (rule.max !== undefined && numValue > rule.max) {
    result.isValid = false;
    result.message = rule.message || `Value must be at most ${rule.max}`;
    return result;
  }

  return result;
}

/**
 * Validate flexible SIP amounts
 * @param {Array} amounts - Array of monthly amounts
 * @returns {Object} Validation result
 */
function validateFlexibleAmounts(amounts) {
  const result = {
    isValid: true,
    message: '',
    invalidMonths: []
  };

  if (!amounts || amounts.length === 0) {
    result.isValid = false;
    result.message = 'Please enter at least one monthly amount';
    return result;
  }

  let hasValidAmount = false;

  amounts.forEach((amount, index) => {
    const numAmount = parseFloat(amount);
    
    if (amount !== '' && amount !== null && amount !== undefined) {
      if (isNaN(numAmount)) {
        result.invalidMonths.push({
          month: index + 1,
          message: 'Invalid number'
        });
      } else if (numAmount < 0) {
        result.invalidMonths.push({
          month: index + 1,
          message: 'Amount cannot be negative'
        });
      } else if (numAmount > 1000000) {
        result.invalidMonths.push({
          month: index + 1,
          message: 'Amount too large (max ₹10,00,000)'
        });
      } else if (numAmount > 0) {
        hasValidAmount = true;
      }
    }
  });

  if (!hasValidAmount) {
    result.isValid = false;
    result.message = 'Please enter at least one valid investment amount';
    return result;
  }

  if (result.invalidMonths.length > 0) {
    result.isValid = false;
    result.message = `Please fix errors in months: ${result.invalidMonths.map(m => m.month).join(', ')}`;
  }

  return result;
}

/**
 * Show validation error for a field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message
 */
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  if (inputElement) {
    inputElement.classList.add('error');
    inputElement.setAttribute('aria-invalid', 'true');
  }
}

/**
 * Clear validation error for a field
 * @param {string} fieldName - Name of the field
 */
function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  if (inputElement) {
    inputElement.classList.remove('error');
    inputElement.removeAttribute('aria-invalid');
  }
}

/**
 * Validate entire form based on SIP type
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result
 */
function validateForm(formData) {
  const result = {
    isValid: true,
    errors: {}
  };

  const { sipType } = formData;

  // Common validations
  if (sipType === 'regular') {
    const monthlyValidation = validateField('monthlyAmount', formData.monthlyAmount);
    if (!monthlyValidation.isValid) {
      result.isValid = false;
      result.errors.monthlyAmount = monthlyValidation.message;
    }

    const yearsValidation = validateField('years', formData.years);
    if (!yearsValidation.isValid) {
      result.isValid = false;
      result.errors.years = yearsValidation.message;
    }
  }

  if (sipType === 'stepup') {
    const monthlyValidation = validateField('monthlyAmount', formData.stepupMonthlyAmount);
    if (!monthlyValidation.isValid) {
      result.isValid = false;
      result.errors.stepupMonthlyAmount = monthlyValidation.message;
    }

    const yearsValidation = validateField('years', formData.stepupYears);
    if (!yearsValidation.isValid) {
      result.isValid = false;
      result.errors.stepupYears = yearsValidation.message;
    }

    const stepUpValidation = validateField('stepUpPercent', formData.stepUpPercent);
    if (!stepUpValidation.isValid) {
      result.isValid = false;
      result.errors.stepUpPercent = stepUpValidation.message;
    }
  }

  if (sipType === 'flexible') {
    const monthsValidation = validateField('flexibleMonths', formData.flexibleMonths);
    if (!monthsValidation.isValid) {
      result.isValid = false;
      result.errors.flexibleMonths = monthsValidation.message;
    }

    const amountsValidation = validateFlexibleAmounts(formData.flexibleAmounts);
    if (!amountsValidation.isValid) {
      result.isValid = false;
      result.errors.flexibleAmounts = amountsValidation.message;
    }
  }

  // Advanced field validations
  if (formData.inflationRate !== '' && formData.inflationRate !== null && formData.inflationRate !== undefined) {
    const inflationValidation = validateField('inflationRate', formData.inflationRate);
    if (!inflationValidation.isValid) {
      result.isValid = false;
      result.errors.inflationRate = inflationValidation.message;
    }
  }

  if (formData.goalAmount !== '' && formData.goalAmount !== null && formData.goalAmount !== undefined) {
    const goalValidation = validateField('goalAmount', formData.goalAmount);
    if (!goalValidation.isValid) {
      result.isValid = false;
      result.errors.goalAmount = goalValidation.message;
    }
  }

  return result;
}

/**
 * Display all form validation errors
 * @param {Object} errors - Object containing field errors
 */
function displayFormErrors(errors) {
  // Clear all existing errors first
  Object.keys(validationRules).forEach(fieldName => {
    clearFieldError(fieldName);
  });

  // Show new errors
  Object.keys(errors).forEach(fieldName => {
    showFieldError(fieldName, errors[fieldName]);
  });

  // Focus on first error field
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.getElementById(firstErrorField);
    if (element) {
      element.focus();
      scrollToElement(element, 100);
    }
  }
}

/**
 * Real-time validation for input fields
 * @param {HTMLElement} input - Input element
 */
function setupRealTimeValidation(input) {
  if (!input) return;

  const fieldName = input.id;
  const debouncedValidation = debounce(() => {
    const validation = validateField(fieldName, input.value);
    
    if (validation.isValid) {
      clearFieldError(fieldName);
    } else {
      showFieldError(fieldName, validation.message);
    }
  }, 500);

  input.addEventListener('input', debouncedValidation);
  input.addEventListener('blur', () => {
    const validation = validateField(fieldName, input.value);
    
    if (validation.isValid) {
      clearFieldError(fieldName);
    } else {
      showFieldError(fieldName, validation.message);
    }
  });
}

/**
 * Initialize validation for all form fields
 */
function initializeValidation() {
  // Setup real-time validation for all relevant fields
  Object.keys(validationRules).forEach(fieldName => {
    const input = document.getElementById(fieldName);
    if (input) {
      setupRealTimeValidation(input);
    }
  });

  // Setup validation for stepup fields
  const stepupMonthlyAmount = document.getElementById('stepupMonthlyAmount');
  const stepupYears = document.getElementById('stepupYears');
  
  if (stepupMonthlyAmount) {
    setupRealTimeValidation(stepupMonthlyAmount);
  }
  
  if (stepupYears) {
    setupRealTimeValidation(stepupYears);
  }
}

/**
 * Validate and format number input
 * @param {HTMLElement} input - Input element
 * @param {Object} options - Validation options
 */
function formatNumberInput(input, options = {}) {
  if (!input) return;

  const { min = 0, max = Infinity, decimals = 0 } = options;

  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d.]/g, '');
    
    // Handle decimal places
    if (decimals === 0) {
      value = value.replace(/\./g, '');
    } else {
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1] && parts[1].length > decimals) {
        value = parts[0] + '.' + parts[1].substring(0, decimals);
      }
    }

    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      if (numValue < min) value = min.toString();
      if (numValue > max) value = max.toString();
    }

    e.target.value = value;
  });

  input.addEventListener('blur', (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      e.target.value = value.toFixed(decimals);
    }
  });
}