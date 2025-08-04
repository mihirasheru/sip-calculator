// Main application logic

let currentStep = 1;
let currentCalculation = null;
let comparisonData = null;

/**
 * Initialize the application
 */
function initializeApp() {
  initializeTheme();
  initializeStorage();
  initializeValidation();
  setupEventListeners();
  loadDraftData();
  
  // Show welcome message
  setTimeout(() => {
    showToast('Welcome to SIP Calculator! Start by configuring your investment.', 'info', 5000);
  }, 1000);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById('darkModeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // SIP type change
  const sipTypeSelect = document.getElementById('sipType');
  if (sipTypeSelect) {
    sipTypeSelect.addEventListener('change', handleSIPTypeChange);
  }

  // Form submission
  const sipForm = document.getElementById('sipForm');
  if (sipForm) {
    sipForm.addEventListener('submit', handleFormSubmit);
  }

  // Advanced options toggle
  const advancedToggle = document.getElementById('toggleAdvanced');
  if (advancedToggle) {
    advancedToggle.addEventListener('click', toggleAdvancedOptions);
  }

  // Flexible months input
  const flexibleMonthsInput = document.getElementById('flexibleMonths');
  if (flexibleMonthsInput) {
    flexibleMonthsInput.addEventListener('input', debounce(generateFlexibleInputs, 300));
  }

  // Results actions
  setupResultsActions();

  // Help button
  const helpButton = document.getElementById('helpButton');
  if (helpButton) {
    helpButton.addEventListener('click', showFAQ);
  }

  // Modal close
  const closeFaq = document.getElementById('closeFaq');
  if (closeFaq) {
    closeFaq.addEventListener('click', hideFAQ);
  }

  // Click outside modal to close
  const faqModal = document.getElementById('faqModal');
  if (faqModal) {
    faqModal.addEventListener('click', (e) => {
      if (e.target === faqModal) {
        hideFAQ();
      }
    });
  }

  // Auto-save form data
  setupAutoSave();

  // Keyboard shortcuts
  setupKeyboardShortcuts();
}

/**
 * Setup results action buttons
 */
function setupResultsActions() {
  const backToForm = document.getElementById('backToForm');
  if (backToForm) {
    backToForm.addEventListener('click', () => goToStep(1));
  }

  const compareAll = document.getElementById('compareAll');
  if (compareAll) {
    compareAll.addEventListener('click', showComparison);
  }

  const saveResults = document.getElementById('saveResults');
  if (saveResults) {
    saveResults.addEventListener('click', handleSaveResults);
  }

  const exportResults = document.getElementById('exportResults');
  if (exportResults) {
    exportResults.addEventListener('click', handleExportResults);
  }

  const backToResults = document.getElementById('backToResults');
  if (backToResults) {
    backToResults.addEventListener('click', () => goToStep(3));
  }
}

/**
 * Setup auto-save functionality
 */
function setupAutoSave() {
  const formInputs = document.querySelectorAll('#sipForm input, #sipForm select');
  
  formInputs.forEach(input => {
    input.addEventListener('input', debounce(() => {
      const formData = collectFormData();
      if (formData && Object.keys(formData).length > 0) {
        saveDraft(formData);
      }
    }, 1000));
  });
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (currentStep === 1) {
        const form = document.getElementById('sipForm');
        if (form) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    }

    // Escape to close modal
    if (e.key === 'Escape') {
      hideFAQ();
    }

    // Ctrl/Cmd + S to save results
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentStep === 3) {
      e.preventDefault();
      handleSaveResults();
    }
  });
}

/**
 * Toggle theme between light and dark
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  updateChartsTheme(newTheme);
  
  showToast(`Switched to ${newTheme} theme`, 'success', 2000);
}

/**
 * Handle SIP type change
 */
function handleSIPTypeChange() {
  const sipTypeElement = document.getElementById('sipType');
  if (!sipTypeElement) return;
  
  const sipType = sipTypeElement.value;
  
  // Hide all conditional fields
  const regularFields = document.getElementById('regularFields');
  const stepupFields = document.getElementById('stepupFields');
  const flexibleFields = document.getElementById('flexibleFields');
  
  if (regularFields) regularFields.classList.add('hidden');
  if (stepupFields) stepupFields.classList.add('hidden');
  if (flexibleFields) flexibleFields.classList.add('hidden');
  
  // Show relevant fields
  switch (sipType) {
    case 'regular':
      if (regularFields) regularFields.classList.remove('hidden');
      break;
    case 'stepup':
      if (stepupFields) stepupFields.classList.remove('hidden');
      break;
    case 'flexible':
      if (flexibleFields) flexibleFields.classList.remove('hidden');
      break;
  }
  
  // Clear validation errors
  clearAllValidationErrors();
}

/**
 * Toggle advanced options
 */
function toggleAdvancedOptions() {
  const advancedFields = document.getElementById('advancedFields');
  const toggleIcon = document.querySelector('.toggle-icon');
  
  if (advancedFields.classList.contains('hidden')) {
    advancedFields.classList.remove('hidden');
    toggleIcon.classList.add('rotated');
    toggleIcon.textContent = '▲';
  } else {
    advancedFields.classList.add('hidden');
    toggleIcon.classList.remove('rotated');
    toggleIcon.textContent = '▼';
  }
}

/**
 * Generate flexible input fields
 */
function generateFlexibleInputs() {
  const monthsInput = document.getElementById('flexibleMonths');
  const container = document.getElementById('flexibleInputsContainer');
  
  if (!monthsInput || !container) return;
  
  const months = parseInt(monthsInput.value);
  
  if (isNaN(months) || months < 6 || months > 600) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = '';
  
  for (let i = 0; i < months; i++) {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'flexible-input-group';
    
    inputGroup.innerHTML = `
      <label class="flexible-input-label">Month ${i + 1}</label>
      <input 
        type="number" 
        class="form-control flexible-amount" 
        placeholder="₹0" 
        min="0" 
        max="1000000" 
        step="100"
        data-month="${i + 1}"
      >
    `;
    
    container.appendChild(inputGroup);
  }
  
  // Add event listeners for validation
  const flexibleInputs = container.querySelectorAll('.flexible-amount');
  flexibleInputs.forEach(input => {
    formatNumberInput(input, { min: 0, max: 1000000, decimals: 0 });
  });
}

/**
 * Collect form data
 */
function collectFormData() {
  const sipType = document.getElementById('sipType').value;
  const formData = { sipType };
  
  if (sipType === 'regular') {
    formData.monthlyAmount = document.getElementById('monthlyAmount').value;
    formData.years = document.getElementById('years').value;
    formData.investmentCategory = document.getElementById('investmentCategory').value;
  } else if (sipType === 'stepup') {
    formData.stepupMonthlyAmount = document.getElementById('stepupMonthlyAmount').value;
    formData.stepupYears = document.getElementById('stepupYears').value;
    formData.stepUpPercent = document.getElementById('stepUpPercent').value;
  } else if (sipType === 'flexible') {
    formData.flexibleMonths = document.getElementById('flexibleMonths').value;
    const flexibleInputs = document.querySelectorAll('.flexible-amount');
    formData.flexibleAmounts = Array.from(flexibleInputs).map(input => input.value);
  }
  
  // Advanced options
  formData.inflationRate = document.getElementById('inflationRate').value;
  formData.goalAmount = document.getElementById('goalAmount').value;
  
  return formData;
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = collectFormData();
  const validation = validateForm(formData);
  
  if (!validation.isValid) {
    displayFormErrors(validation.errors);
    showToast('Please fix the errors in the form', 'error');
    return;
  }
  
  // Clear any existing errors
  clearAllValidationErrors();
  
  // Show loading step
  goToStep(2);
  
  // Simulate calculation delay for better UX
  setTimeout(() => {
    performCalculation(formData);
  }, 1500);
}

/**
 * Perform SIP calculation
 */
function performCalculation(formData) {
  try {
    const { sipType } = formData;
    const inflationRate = parseFloat(formData.inflationRate) || 0;
    
    let result;
    
    if (sipType === 'regular') {
      result = calculateRegularSIP(
        parseFloat(formData.monthlyAmount),
        parseFloat(formData.years),
        formData.investmentCategory,
        inflationRate
      );
    } else if (sipType === 'stepup') {
      result = calculateStepUpSIP(
        parseFloat(formData.stepupMonthlyAmount),
        parseFloat(formData.stepupYears),
        parseFloat(formData.stepUpPercent),
        inflationRate
      );
    } else if (sipType === 'flexible') {
      result = calculateFlexibleSIP(
        formData.flexibleAmounts,
        inflationRate
      );
    }
    
    if (!result) {
      throw new Error('Calculation failed');
    }
    
    currentCalculation = result;
    displayResults(result);
    goToStep(3);
    
    // Clear draft since calculation is complete
    clearDraft();
    
    showToast('Calculation completed successfully!', 'success');
    
  } catch (error) {
    console.error('Calculation error:', error);
    showToast('An error occurred during calculation. Please try again.', 'error');
    goToStep(1);
  }
}

/**
 * Display calculation results
 */
function displayResults(result) {
  // Update result values with animation
  animateNumber(
    document.getElementById('totalInvestmentResult'),
    0,
    result.totalInvestment,
    1500,
    formatCurrency
  );
  
  animateNumber(
    document.getElementById('returnsResult'),
    0,
    result.returns,
    1500,
    formatCurrency
  );
  
  animateNumber(
    document.getElementById('totalValueResult'),
    0,
    result.futureValue,
    1500,
    formatCurrency
  );
  
  // Create charts
  setTimeout(() => {
    createPieChart(result);
    createLineChart(result);
  }, 500);
  
  // Display detailed analysis
  displayDetailedAnalysis(result);
}

/**
 * Display detailed analysis
 */
function displayDetailedAnalysis(result) {
  const container = document.getElementById('detailedAnalysis');
  if (!container) return;
  
  const effectiveRate = calculateEffectiveRate(result.futureValue, result.totalInvestment, result.years);
  
  const analysisItems = [
    {
      label: 'Investment Type',
      value: `${result.type} - ${result.category}`
    },
    {
      label: 'Investment Period',
      value: `${result.years} years (${result.months} months)`
    },
    {
      label: 'Expected Annual Return',
      value: formatPercentage(result.annualRate)
    },
    {
      label: 'Effective Annual Return',
      value: formatPercentage(effectiveRate)
    },
    {
      label: 'Total Investment',
      value: formatCurrency(result.totalInvestment)
    },
    {
      label: 'Expected Returns',
      value: formatCurrency(result.returns)
    },
    {
      label: 'Total Maturity Value',
      value: formatCurrency(result.futureValue)
    }
  ];
  
  // Add inflation-adjusted values if applicable
  if (result.inflationAdjustedValue && result.inflationAdjustedValue !== result.futureValue) {
    analysisItems.push(
      {
        label: 'Inflation-Adjusted Value',
        value: formatCurrency(result.inflationAdjustedValue)
      },
      {
        label: 'Real Returns (Post-Inflation)',
        value: formatCurrency(result.realReturns)
      }
    );
  }
  
  // Add type-specific information
  if (result.type === 'Step-up SIP') {
    analysisItems.push({
      label: 'Annual Step-up',
      value: formatPercentage(result.stepUpPercent)
    });
  } else if (result.type === 'Flexible SIP') {
    analysisItems.push({
      label: 'Average Monthly Investment',
      value: formatCurrency(result.averageMonthlyAmount)
    });
  }
  
  container.innerHTML = analysisItems.map(item => `
    <div class="analysis-item">
      <span class="analysis-label">${item.label}</span>
      <span class="analysis-value">${item.value}</span>
    </div>
  `).join('');
}

/**
 * Show comparison of all SIP types
 */
function showComparison() {
  if (!currentCalculation) return;
  
  // Generate comparison data
  const baseParams = {
    monthlyAmount: currentCalculation.monthlyAmount || currentCalculation.initialAmount || currentCalculation.averageMonthlyAmount,
    years: currentCalculation.years,
    stepUpPercent: currentCalculation.stepUpPercent || 10,
    inflationRate: 0
  };
  
  comparisonData = compareAllSIPTypes(baseParams);
  
  // Display comparison table
  displayComparisonTable(comparisonData);
  
  // Show comparison section
  const comparisonSection = document.getElementById('comparisonSection');
  const step3 = document.getElementById('step3');
  
  if (comparisonSection) comparisonSection.classList.remove('hidden');
  if (step3) step3.classList.add('hidden');
  
  // Update progress
  updateProgress(3);
  
  scrollToElement('#comparisonSection');
}

/**
 * Display comparison table
 */
function displayComparisonTable(data) {
  const tbody = document.querySelector('#comparisonTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  data.forEach(item => {
    const effectiveRate = calculateEffectiveRate(item.futureValue, item.totalInvestment, item.years);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${item.type}</strong></td>
      <td>${item.category}</td>
      <td>${formatCurrency(item.totalInvestment)}</td>
      <td>${formatCurrency(item.returns)}</td>
      <td><strong>${formatCurrency(item.futureValue)}</strong></td>
      <td>${formatPercentage(effectiveRate)}</td>
    `;
    
    tbody.appendChild(row);
  });
}

/**
 * Handle save results
 */
function handleSaveResults() {
  if (!currentCalculation) {
    showToast('No calculation to save', 'error');
    return;
  }
  
  try {
    const id = saveCalculation(currentCalculation);
    showToast('Results saved successfully!', 'success');
    
    // Update save button to show saved state
    const saveButton = document.getElementById('saveResults');
    if (saveButton) {
      const originalText = saveButton.innerHTML;
      saveButton.innerHTML = '✅ Saved';
      saveButton.disabled = true;
      
      setTimeout(() => {
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error saving results:', error);
    showToast('Failed to save results', 'error');
  }
}

/**
 * Handle export results to PDF
 */
function handleExportResults() {
  if (!currentCalculation) {
    showToast('No calculation to export', 'error');
    return;
  }
  
  try {
    generatePDFReport(currentCalculation);
    showToast('PDF report generated successfully!', 'success');
  } catch (error) {
    console.error('Error generating PDF:', error);
    showToast('Failed to generate PDF report', 'error');
  }
}

/**
 * Generate PDF report
 */
function generatePDFReport(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('SIP Calculator Report', 20, 30);
  
  // Date
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Investment Details
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Investment Details', 20, 65);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  let yPos = 80;
  
  const details = [
    ['Investment Type:', `${data.type} - ${data.category}`],
    ['Investment Period:', `${data.years} years (${data.months} months)`],
    ['Expected Annual Return:', formatPercentage(data.annualRate)],
    ['Total Investment:', formatCurrency(data.totalInvestment)],
    ['Expected Returns:', formatCurrency(data.returns)],
    ['Total Maturity Value:', formatCurrency(data.futureValue)]
  ];
  
  details.forEach(([label, value]) => {
    doc.text(label, 20, yPos);
    doc.text(value, 100, yPos);
    yPos += 10;
  });
  
  // Year-wise breakdown
  if (data.yearlyBreakdown && data.yearlyBreakdown.length > 0) {
    yPos += 10;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Year-wise Breakdown', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Year', 20, yPos);
    doc.text('Investment', 50, yPos);
    doc.text('Value', 100, yPos);
    doc.text('Returns', 150, yPos);
    
    yPos += 5;
    doc.setFont(undefined, 'normal');
    
    data.yearlyBreakdown.forEach(item => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(item.year.toString(), 20, yPos);
      doc.text(formatCurrency(item.investment), 50, yPos);
      doc.text(formatCurrency(item.value), 100, yPos);
      doc.text(formatCurrency(item.returns), 150, yPos);
      yPos += 8;
    });
  }
  
  // Disclaimer
  yPos += 20;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'italic');
  const disclaimer = 'Disclaimer: This report is for educational purposes only. Projections are based on assumed returns and do not guarantee future performance. Mutual fund investments are subject to market risks.';
  const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
  doc.text(splitDisclaimer, 20, yPos);
  
  // Save the PDF
  const filename = `SIP_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Go to specific step
 */
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.step-section').forEach(section => {
    section.classList.remove('active');
    section.classList.add('hidden');
  });
  
  // Show target step
  const targetStep = document.getElementById(`step${step}`);
  if (targetStep) {
    targetStep.classList.remove('hidden');
    targetStep.classList.add('active');
  }
  
  currentStep = step;
  updateProgress(step);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Update progress indicator
 */
function updateProgress(step) {
  document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
    const stepNumber = index + 1;
    
    if (stepNumber < step) {
      stepEl.classList.add('completed');
      stepEl.classList.remove('active');
    } else if (stepNumber === step) {
      stepEl.classList.add('active');
      stepEl.classList.remove('completed');
    } else {
      stepEl.classList.remove('active', 'completed');
    }
  });
}

/**
 * Show FAQ modal
 */
function showFAQ() {
  const modal = document.getElementById('faqModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hide FAQ modal
 */
function hideFAQ() {
  const modal = document.getElementById('faqModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Clear all validation errors
 */
function clearAllValidationErrors() {
  document.querySelectorAll('.form-error').forEach(error => {
    error.classList.remove('show');
    error.textContent = '';
  });
  
  document.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
  });
}

/**
 * Load draft data if available
 */
function loadDraftData() {
  const draft = loadDraft();
  if (!draft) return;
  
  // Show toast asking if user wants to restore draft
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast info';
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">💾</span>
      <span class="toast-message">Found saved draft from ${new Date(draft.savedAt).toLocaleDateString()}. Restore it?</span>
      <button onclick="restoreDraft(event)" style="margin-left: 10px; padding: 4px 8px; background: var(--primary-500); color: white; border: none; border-radius: 4px; cursor: pointer;">Restore</button>
      <button onclick="clearDraft(); this.parentElement.parentElement.parentElement.remove();" style="margin-left: 5px; padding: 4px 8px; background: var(--secondary-500); color: white; border: none; border-radius: 4px; cursor: pointer;">Dismiss</button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Auto remove after 10 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toastContainer.removeChild(toast);
    }
  }, 10000);
}

/**
 * Restore draft data
 */
function restoreDraft(event) {
  const draft = loadDraft();
  if (!draft) return;
  
  // Set form values
  Object.keys(draft).forEach(key => {
    const element = document.getElementById(key);
    if (element && draft[key] !== undefined && draft[key] !== null) {
      element.value = draft[key];
    }
  });
  
  // Trigger SIP type change to show correct fields
  handleSIPTypeChange();
  
  // Generate flexible inputs if needed
  if (draft.sipType === 'flexible' && draft.flexibleMonths) {
    generateFlexibleInputs();
    
    // Set flexible amounts
    setTimeout(() => {
      const flexibleInputs = document.querySelectorAll('.flexible-amount');
      if (draft.flexibleAmounts && Array.isArray(draft.flexibleAmounts)) {
        flexibleInputs.forEach((input, index) => {
          if (draft.flexibleAmounts[index] !== undefined) {
            input.value = draft.flexibleAmounts[index];
          }
        });
      }
    }, 100);
  }
  
  showToast('Draft restored successfully!', 'success');
  
  // Remove the toast
  if (event && event.target) {
    const toast = event.target.closest('.toast');
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }
}

// Make restoreDraft available globally
window.restoreDraft = restoreDraft;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page visibility change to save draft
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && currentStep === 1) {
    const formData = collectFormData();
    if (formData && Object.keys(formData).length > 0) {
      saveDraft(formData);
    }
  }
});