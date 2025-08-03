// Local storage management for SIP Calculator

const STORAGE_KEYS = {
  CALCULATIONS: 'sip_calculations',
  PREFERENCES: 'sip_preferences',
  THEME: 'theme'
};

/**
 * Save calculation to local storage
 * @param {Object} calculation - Calculation data to save
 * @returns {string} Unique ID of saved calculation
 */
function saveCalculation(calculation) {
  const calculations = getCalculations();
  const id = generateId();
  const timestamp = new Date().toISOString();
  
  const calculationData = {
    id,
    timestamp,
    ...calculation
  };
  
  calculations.push(calculationData);
  
  // Keep only last 50 calculations
  if (calculations.length > 50) {
    calculations.splice(0, calculations.length - 50);
  }
  
  localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations));
  
  return id;
}

/**
 * Get all saved calculations
 * @returns {Array} Array of saved calculations
 */
function getCalculations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
}

/**
 * Get calculation by ID
 * @param {string} id - Calculation ID
 * @returns {Object|null} Calculation data or null if not found
 */
function getCalculationById(id) {
  const calculations = getCalculations();
  return calculations.find(calc => calc.id === id) || null;
}

/**
 * Delete calculation by ID
 * @param {string} id - Calculation ID to delete
 * @returns {boolean} True if deleted successfully
 */
function deleteCalculation(id) {
  const calculations = getCalculations();
  const index = calculations.findIndex(calc => calc.id === id);
  
  if (index !== -1) {
    calculations.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations));
    return true;
  }
  
  return false;
}

/**
 * Clear all calculations
 */
function clearAllCalculations() {
  localStorage.removeItem(STORAGE_KEYS.CALCULATIONS);
}

/**
 * Save user preferences
 * @param {Object} preferences - User preferences
 */
function savePreferences(preferences) {
  try {
    const existing = getPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
function getPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return stored ? JSON.parse(stored) : {
      defaultSipType: 'regular',
      defaultCategory: 'mid',
      defaultInflationRate: 6,
      showAdvancedOptions: false,
      currency: 'INR',
      notifications: true
    };
  } catch (error) {
    console.error('Error loading preferences:', error);
    return {};
  }
}

/**
 * Export calculations to JSON
 * @returns {string} JSON string of all calculations
 */
function exportCalculations() {
  const calculations = getCalculations();
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    calculations: calculations
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import calculations from JSON
 * @param {string} jsonData - JSON string containing calculations
 * @returns {boolean} True if import was successful
 */
function importCalculations(jsonData) {
  try {
    const importData = JSON.parse(jsonData);
    
    if (!importData.calculations || !Array.isArray(importData.calculations)) {
      throw new Error('Invalid import format');
    }
    
    const existingCalculations = getCalculations();
    const newCalculations = importData.calculations.map(calc => ({
      ...calc,
      id: generateId(), // Generate new IDs to avoid conflicts
      imported: true,
      importDate: new Date().toISOString()
    }));
    
    const allCalculations = [...existingCalculations, ...newCalculations];
    
    // Keep only last 100 calculations after import
    if (allCalculations.length > 100) {
      allCalculations.splice(0, allCalculations.length - 100);
    }
    
    localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(allCalculations));
    
    return true;
  } catch (error) {
    console.error('Error importing calculations:', error);
    return false;
  }
}

/**
 * Get calculation history for display
 * @param {number} limit - Maximum number of calculations to return
 * @returns {Array} Array of calculation summaries
 */
function getCalculationHistory(limit = 10) {
  const calculations = getCalculations();
  
  return calculations
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
    .map(calc => ({
      id: calc.id,
      timestamp: calc.timestamp,
      type: calc.type,
      totalInvestment: calc.totalInvestment,
      futureValue: calc.futureValue,
      returns: calc.returns,
      years: calc.years
    }));
}

/**
 * Save current form data as draft
 * @param {Object} formData - Form data to save
 */
function saveDraft(formData) {
  try {
    localStorage.setItem('sip_draft', JSON.stringify({
      ...formData,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

/**
 * Load draft form data
 * @returns {Object|null} Draft data or null if not found
 */
function loadDraft() {
  try {
    const stored = localStorage.getItem('sip_draft');
    if (!stored) return null;
    
    const draft = JSON.parse(stored);
    const savedAt = new Date(draft.savedAt);
    const now = new Date();
    
    // Only return draft if it's less than 24 hours old
    if (now - savedAt < 24 * 60 * 60 * 1000) {
      return draft;
    } else {
      clearDraft();
      return null;
    }
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
}

/**
 * Clear saved draft
 */
function clearDraft() {
  localStorage.removeItem('sip_draft');
}

/**
 * Get storage usage statistics
 * @returns {Object} Storage usage information
 */
function getStorageStats() {
  const calculations = getCalculations();
  const preferences = getPreferences();
  
  let totalSize = 0;
  
  try {
    totalSize += new Blob([localStorage.getItem(STORAGE_KEYS.CALCULATIONS) || '']).size;
    totalSize += new Blob([localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '']).size;
    totalSize += new Blob([localStorage.getItem(STORAGE_KEYS.THEME) || '']).size;
    totalSize += new Blob([localStorage.getItem('sip_draft') || '']).size;
  } catch (error) {
    console.error('Error calculating storage size:', error);
  }
  
  return {
    calculationsCount: calculations.length,
    totalSize: totalSize,
    formattedSize: formatBytes(totalSize),
    lastCalculation: calculations.length > 0 ? calculations[calculations.length - 1].timestamp : null
  };
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if local storage is available
 * @returns {boolean} True if local storage is available
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Initialize storage with default values if needed
 */
function initializeStorage() {
  if (!isStorageAvailable()) {
    console.warn('Local storage is not available');
    return;
  }
  
  // Initialize preferences if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
    savePreferences({});
  }
  
  // Initialize theme if not exists
  if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem(STORAGE_KEYS.THEME, prefersDark ? 'dark' : 'light');
  }
}