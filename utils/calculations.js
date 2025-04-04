/**
 * Utility functions for real estate calculations
 */

/**
 * Calculate monthly mortgage payment
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate (as a percentage)
 * @param {number} years - Loan term in years
 * @returns {number} - Monthly mortgage payment
 */
export const calculateMonthlyMortgage = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

/**
 * Calculate total selling costs
 * @param {Object} saleDetails - Object containing sale cost details
 * @param {number} salePrice - The sale price
 * @returns {number} - Total selling costs
 */
export const calculateTotalSellingCosts = (saleDetails, salePrice) => {
  const commission = salePrice * (saleDetails.agentCommission / 100);
  const transferTax = salePrice * (saleDetails.transferTax / 100);
  
  return commission + 
         saleDetails.titleAndEscrow + 
         transferTax + 
         saleDetails.homeWarranty + 
         saleDetails.preSaleRepairs + 
         saleDetails.stagingCosts + 
         saleDetails.professionalCleaning + 
         saleDetails.photography + 
         saleDetails.marketingCosts;
};

/**
 * Calculate net proceeds from sale
 * @param {number} salePrice - Sale price
 * @param {Object} saleCosts - Object containing sale costs
 * @returns {number} - Net proceeds
 */
export const calculateNetProceeds = (salePrice, saleCosts) => {
  const totalCosts = Object.values(saleCosts).reduce((sum, cost) => sum + cost, 0);
  return salePrice - totalCosts;
};

/**
 * Calculate net amount at closing
 * @param {number} netProceeds - Net proceeds from sale
 * @param {number} payoffAmount - Total payoff amount
 * @returns {number} - Net amount at closing
 */
export const calculateNetAtClosing = (netProceeds, payoffAmount) => {
  return netProceeds - payoffAmount;
};

/**
 * Calculate loan amount based on purchase price and down payment percentage
 * @param {number} purchasePrice - Purchase price
 * @param {number} downPayment - Down payment percentage
 * @returns {number} - Loan amount
 */
export const calculateLoanAmount = (purchasePrice, downPayment) => {
  const downPaymentAmount = (purchasePrice * downPayment) / 100;
  return purchasePrice - downPaymentAmount;
};

/**
 * Calculate down payment amount
 * @param {number} purchasePrice - The purchase price
 * @param {number} downPaymentPercentage - Down payment as a percentage
 * @returns {number} - Down payment amount
 */
export const calculateDownPaymentAmount = (purchasePrice, downPaymentPercentage) => {
  return purchasePrice * (downPaymentPercentage / 100);
};

/**
 * Calculate monthly property tax
 * @param {number} purchasePrice - Purchase price
 * @param {number} propertyTaxRate - Property tax rate (as a percentage)
 * @returns {number} - Monthly property tax
 */
export const calculateMonthlyPropertyTax = (purchasePrice, propertyTaxRate) => {
  const annualPropertyTax = (purchasePrice * propertyTaxRate) / 100;
  return annualPropertyTax / 12;
};

/**
 * Calculate monthly insurance
 * @param {number} annualInsurance - Annual insurance cost
 * @returns {number} - Monthly insurance
 */
export const calculateMonthlyInsurance = (annualInsurance) => {
  return annualInsurance / 12;
};

/**
 * Calculate total monthly payment including mortgage, property tax, insurance, and HOA
 * @param {number} monthlyMortgage - Monthly mortgage payment
 * @param {number} annualPropertyTax - Annual property tax
 * @param {number} annualInsurance - Annual insurance cost
 * @param {number} monthlyHOA - Monthly HOA fee
 * @returns {number} - Total monthly payment
 */
export const calculateTotalMonthlyPayment = (
  monthlyMortgage,
  annualPropertyTax,
  annualInsurance,
  monthlyHOA
) => {
  const monthlyPropertyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualInsurance / 12;
  
  return monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyHOA;
};

/**
 * Generate price range based on confidence level
 * @param {number} basePrice - Base price
 * @param {number} confidenceLevel - Confidence level as a decimal (e.g., 0.15 for 15%)
 * @param {number} rangeCount - Number of steps in the range
 * @returns {Object} - Object containing min, max, step, and array of prices
 */
export const generatePriceRange = (basePrice, confidenceLevel, rangeCount) => {
  const min = basePrice * (1 - confidenceLevel);
  const max = basePrice * (1 + confidenceLevel);
  const step = (max - min) / (rangeCount - 1);
  
  const prices = Array.from({ length: rangeCount }, (_, i) => 
    Math.round(min + (i * step))
  );
  
  return { min, max, step, prices };
};

/**
 * Generate a matrix of monthly payments for different purchase prices and down payment percentages
 * @param {Array} purchasePrices - Array of purchase prices
 * @param {Array} downPayments - Array of down payment percentages
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Object with calculation results
 */
export const generatePaymentMatrix = (purchasePrices, downPayments, params) => {
  const results = {};
  
  purchasePrices.forEach(price => {
    downPayments.forEach(downPayment => {
      const key = `${price}-${downPayment}`;
      const loanAmount = calculateLoanAmount(price, downPayment);
      const monthlyMortgage = calculateMonthlyMortgage(
        loanAmount,
        params.interestRate,
        params.loanTerm
      );
      const monthlyPropertyTax = calculateMonthlyPropertyTax(
        price,
        params.propertyTaxRate
      );
      const monthlyInsurance = calculateMonthlyInsurance(params.insuranceCost);
      
      results[key] = {
        loanAmount,
        monthlyMortgage,
        monthlyPropertyTax,
        monthlyInsurance,
        monthlyHOA: params.hoaCost,
        totalMonthlyPayment: calculateTotalMonthlyPayment(
          monthlyMortgage,
          monthlyPropertyTax * 12,
          params.insuranceCost,
          params.hoaCost
        )
      };
    });
  });
  
  return results;
};

/**
 * Calculate table data for the payment matrix
 * @param {Array} salePrices - Array of sale prices
 * @param {Array} purchasePrices - Array of purchase prices
 * @param {Object} saleDetails - Object containing sale cost details
 * @param {Object} payoffDetails - Object containing payoff details
 * @param {Object} purchaseDetails - Object containing purchase details
 * @returns {Array} - 2D array of calculated data for each sale/purchase price combination
 */
export const calculateTableData = (
  salePrices, 
  purchasePrices, 
  saleDetails, 
  payoffDetails, 
  purchaseDetails
) => {
  // Calculate total payoff amount
  const totalPayoff = payoffDetails.firstMortgage + 
                     payoffDetails.secondMortgage + 
                     payoffDetails.heloc + 
                     payoffDetails.otherPayments;

  return salePrices.map(salePrice => {
    return purchasePrices.map(purchasePrice => {
      // Calculate total selling costs
      const totalSellingCosts = calculateTotalSellingCosts(saleDetails, salePrice);
      
      // Calculate net proceeds
      const netProceeds = salePrice - totalSellingCosts;
      
      // Calculate net at closing (money available for down payment)
      const netAtClosing = calculateNetAtClosing(netProceeds, totalPayoff);
      
      // Calculate effective down payment (minimum of available funds or required down payment)
      const requiredDownPayment = (purchasePrice * purchaseDetails.downPayment) / 100;
      const effectiveDownPayment = Math.min(netAtClosing, requiredDownPayment);
      
      // Calculate loan amount based on effective down payment
      const loanAmount = purchasePrice - effectiveDownPayment;
      
      // Calculate monthly mortgage
      const monthlyMortgage = calculateMonthlyMortgage(
        loanAmount, 
        purchaseDetails.interestRate, 
        purchaseDetails.loanTerm
      );
      
      // Calculate other monthly costs
      const monthlyPropertyTax = calculateMonthlyPropertyTax(
        purchasePrice, 
        purchaseDetails.propertyTaxRate
      );
      
      const monthlyInsurance = calculateMonthlyInsurance(purchaseDetails.insuranceCost);
      const monthlyHOA = purchaseDetails.hoaCost;
      
      // Calculate total monthly payment
      const totalMonthlyPayment = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyHOA;
      
      return {
        salePrice,
        purchasePrice,
        netProceeds,
        netAtClosing,
        effectiveDownPayment,
        loanAmount,
        monthlyMortgage,
        monthlyPropertyTax,
        monthlyInsurance,
        monthlyHOA,
        totalMonthlyPayment
      };
    });
  });
}; 