// SIP calculation functions

/**
 * Calculate Regular SIP
 * @param {number} monthlyAmount - Monthly investment amount
 * @param {number} years - Investment period in years
 * @param {string} category - Investment category (large, mid, small)
 * @param {number} inflationRate - Annual inflation rate (optional)
 * @returns {Object} Calculation results
 */
function calculateRegularSIP(monthlyAmount, years, category, inflationRate = 0) {
  const months = years * 12;
  
  // Expected returns based on category
  const returnRates = {
    large: 0.10,
    mid: 0.12,
    small: 0.15
  };
  
  const annualRate = returnRates[category] || 0.12;
  const monthlyRate = annualRate / 12;
  
  // Calculate future value using SIP formula
  const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const totalInvestment = monthlyAmount * months;
  const returns = futureValue - totalInvestment;
  
  // Calculate inflation-adjusted values if inflation rate is provided
  let inflationAdjustedValue = futureValue;
  let realReturns = returns;
  
  if (inflationRate > 0) {
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    inflationAdjustedValue = futureValue / inflationFactor;
    realReturns = inflationAdjustedValue - totalInvestment;
  }
  
  // Calculate effective annual return
  const effectiveRate = calculateEffectiveRate(futureValue, totalInvestment, years);
  
  // Generate year-wise breakdown
  const yearlyBreakdown = [];
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;
  
  for (let year = 1; year <= years; year++) {
    const monthsCompleted = year * 12;
    cumulativeInvestment = monthlyAmount * monthsCompleted;
    cumulativeValue = monthlyAmount * ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate);
    
    yearlyBreakdown.push({
      year,
      investment: cumulativeInvestment,
      value: cumulativeValue,
      returns: cumulativeValue - cumulativeInvestment
    });
  }
  
  return {
    type: 'Regular SIP',
    category: category.charAt(0).toUpperCase() + category.slice(1) + ' Cap',
    totalInvestment,
    futureValue,
    returns,
    inflationAdjustedValue,
    realReturns,
    effectiveRate,
    annualRate: annualRate * 100,
    yearlyBreakdown,
    monthlyAmount,
    years,
    months
  };
}

/**
 * Calculate Step-up SIP
 * @param {number} initialAmount - Initial monthly investment amount
 * @param {number} years - Investment period in years
 * @param {number} stepUpPercent - Annual step-up percentage
 * @param {number} inflationRate - Annual inflation rate (optional)
 * @returns {Object} Calculation results
 */
function calculateStepUpSIP(initialAmount, years, stepUpPercent, inflationRate = 0) {
  const months = years * 12;
  const annualRate = 0.15; // Assuming 15% for step-up SIP
  const monthlyRate = annualRate / 12;
  const stepUpDecimal = stepUpPercent / 100;
  
  let totalInvestment = 0;
  let futureValue = 0;
  let currentAmount = initialAmount;
  
  // Calculate month by month
  for (let month = 1; month <= months; month++) {
    const monthsRemaining = months - month + 1;
    
    // Add to future value (compound for remaining months)
    futureValue += currentAmount * Math.pow(1 + monthlyRate, monthsRemaining);
    totalInvestment += currentAmount;
    
    // Increase amount annually
    if (month % 12 === 0 && month < months) {
      currentAmount *= (1 + stepUpDecimal);
    }
  }
  
  const returns = futureValue - totalInvestment;
  
  // Calculate inflation-adjusted values
  let inflationAdjustedValue = futureValue;
  let realReturns = returns;
  
  if (inflationRate > 0) {
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    inflationAdjustedValue = futureValue / inflationFactor;
    realReturns = inflationAdjustedValue - totalInvestment;
  }
  
  const effectiveRate = calculateEffectiveRate(futureValue, totalInvestment, years);
  
  // Generate year-wise breakdown
  const yearlyBreakdown = [];
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;
  let yearlyAmount = initialAmount;
  
  for (let year = 1; year <= years; year++) {
    // Calculate for this year
    for (let month = 1; month <= 12; month++) {
      const totalMonthsFromStart = (year - 1) * 12 + month;
      if (totalMonthsFromStart <= months) {
        const monthsRemaining = months - totalMonthsFromStart + 1;
        cumulativeValue += yearlyAmount * Math.pow(1 + monthlyRate, monthsRemaining);
        cumulativeInvestment += yearlyAmount;
      }
    }
    
    yearlyBreakdown.push({
      year,
      investment: cumulativeInvestment,
      value: cumulativeValue,
      returns: cumulativeValue - cumulativeInvestment,
      monthlyAmount: yearlyAmount
    });
    
    // Increase for next year
    if (year < years) {
      yearlyAmount *= (1 + stepUpDecimal);
    }
  }
  
  return {
    type: 'Step-up SIP',
    category: `${stepUpPercent}% annual increase`,
    totalInvestment,
    futureValue,
    returns,
    inflationAdjustedValue,
    realReturns,
    effectiveRate,
    annualRate: annualRate * 100,
    yearlyBreakdown,
    initialAmount,
    stepUpPercent,
    years,
    months
  };
}

/**
 * Calculate Flexible SIP
 * @param {Array} monthlyAmounts - Array of monthly investment amounts
 * @param {number} inflationRate - Annual inflation rate (optional)
 * @returns {Object} Calculation results
 */
function calculateFlexibleSIP(monthlyAmounts, inflationRate = 0) {
  const months = monthlyAmounts.length;
  const years = months / 12;
  const annualRate = 0.12; // Assuming 12% for flexible SIP
  const monthlyRate = annualRate / 12;
  
  let totalInvestment = 0;
  let futureValue = 0;
  
  // Calculate month by month
  monthlyAmounts.forEach((amount, index) => {
    const monthlyAmount = parseFloat(amount) || 0;
    const monthsRemaining = months - index;
    
    if (monthlyAmount > 0) {
      futureValue += monthlyAmount * Math.pow(1 + monthlyRate, monthsRemaining);
      totalInvestment += monthlyAmount;
    }
  });
  
  const returns = futureValue - totalInvestment;
  
  // Calculate inflation-adjusted values
  let inflationAdjustedValue = futureValue;
  let realReturns = returns;
  
  if (inflationRate > 0) {
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);
    inflationAdjustedValue = futureValue / inflationFactor;
    realReturns = inflationAdjustedValue - totalInvestment;
  }
  
  const effectiveRate = calculateEffectiveRate(futureValue, totalInvestment, years);
  
  // Generate year-wise breakdown
  const yearlyBreakdown = [];
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;
  
  for (let year = 1; year <= Math.ceil(years); year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, months);
    
    let yearlyInvestment = 0;
    
    for (let month = startMonth; month < endMonth; month++) {
      const monthlyAmount = parseFloat(monthlyAmounts[month]) || 0;
      const monthsRemaining = months - month;
      
      if (monthlyAmount > 0) {
        cumulativeValue += monthlyAmount * Math.pow(1 + monthlyRate, monthsRemaining);
        cumulativeInvestment += monthlyAmount;
        yearlyInvestment += monthlyAmount;
      }
    }
    
    yearlyBreakdown.push({
      year,
      investment: cumulativeInvestment,
      value: cumulativeValue,
      returns: cumulativeValue - cumulativeInvestment,
      yearlyInvestment
    });
  }
  
  // Calculate average monthly investment
  const averageMonthlyAmount = totalInvestment / months;
  
  return {
    type: 'Flexible SIP',
    category: 'Custom amounts',
    totalInvestment,
    futureValue,
    returns,
    inflationAdjustedValue,
    realReturns,
    effectiveRate,
    annualRate: annualRate * 100,
    yearlyBreakdown,
    monthlyAmounts,
    averageMonthlyAmount,
    years,
    months
  };
}

/**
 * Calculate goal-based SIP
 * @param {number} goalAmount - Target goal amount
 * @param {number} years - Investment period in years
 * @param {string} category - Investment category
 * @returns {Object} Required monthly investment and analysis
 */
function calculateGoalBasedSIP(goalAmount, years, category) {
  const months = years * 12;
  
  const returnRates = {
    large: 0.10,
    mid: 0.12,
    small: 0.15
  };
  
  const annualRate = returnRates[category] || 0.12;
  const monthlyRate = annualRate / 12;
  
  // Calculate required monthly investment using SIP formula
  // FV = PMT * [((1 + r)^n - 1) / r] * (1 + r)
  // PMT = FV / [((1 + r)^n - 1) / r * (1 + r)]
  
  const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const requiredMonthlyAmount = goalAmount / factor;
  
  const totalInvestment = requiredMonthlyAmount * months;
  const returns = goalAmount - totalInvestment;
  const effectiveRate = calculateEffectiveRate(goalAmount, totalInvestment, years);
  
  return {
    goalAmount,
    requiredMonthlyAmount,
    totalInvestment,
    returns,
    effectiveRate,
    annualRate: annualRate * 100,
    years,
    months,
    category
  };
}

/**
 * Compare all SIP types with given parameters
 * @param {Object} baseParams - Base parameters for comparison
 * @returns {Array} Array of calculation results for comparison
 */
function compareAllSIPTypes(baseParams) {
  const { monthlyAmount, years, stepUpPercent = 10, inflationRate = 0 } = baseParams;
  const results = [];
  
  // Regular SIP for all categories
  ['large', 'mid', 'small'].forEach(category => {
    const result = calculateRegularSIP(monthlyAmount, years, category, inflationRate);
    results.push(result);
  });
  
  // Step-up SIP
  const stepUpResult = calculateStepUpSIP(monthlyAmount, years, stepUpPercent, inflationRate);
  results.push(stepUpResult);
  
  // Flexible SIP (simulated with regular amounts)
  const flexibleAmounts = Array(years * 12).fill(monthlyAmount);
  const flexibleResult = calculateFlexibleSIP(flexibleAmounts, inflationRate);
  results.push(flexibleResult);
  
  return results;
}

/**
 * Calculate tax implications (basic calculation)
 * @param {number} returns - Investment returns
 * @param {number} years - Investment period
 * @param {string} fundType - Type of fund (equity/debt)
 * @returns {Object} Tax calculation results
 */
function calculateTaxImplications(returns, years, fundType = 'equity') {
  let taxableAmount = 0;
  let taxRate = 0;
  let taxAmount = 0;
  
  if (fundType === 'equity') {
    if (years > 1) {
      // Long-term capital gains (LTCG) for equity
      taxableAmount = Math.max(0, returns - 100000); // ₹1 lakh exemption
      taxRate = 0.10; // 10% LTCG tax
    } else {
      // Short-term capital gains (STCG) for equity
      taxableAmount = returns;
      taxRate = 0.15; // 15% STCG tax
    }
  } else {
    // Debt funds
    if (years > 3) {
      // LTCG for debt - taxed as per income tax slab (assuming 30%)
      taxableAmount = returns;
      taxRate = 0.30;
    } else {
      // STCG for debt - taxed as per income tax slab (assuming 30%)
      taxableAmount = returns;
      taxRate = 0.30;
    }
  }
  
  taxAmount = taxableAmount * taxRate;
  const postTaxReturns = returns - taxAmount;
  
  return {
    grossReturns: returns,
    taxableAmount,
    taxRate: taxRate * 100,
    taxAmount,
    postTaxReturns,
    fundType,
    isLongTerm: (fundType === 'equity' && years > 1) || (fundType === 'debt' && years > 3)
  };
}