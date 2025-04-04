import { useState, useEffect } from 'react';
import { 
  generatePriceRange, 
  calculateTableData 
} from '../utils/calculations';

/**
 * Custom hook for managing calculator state and calculations
 * @returns {Object} - Calculator state and functions
 */
export const useCalculator = () => {
  // Main state for the three primary sliders
  const [mainSliders, setMainSliders] = useState({
    sale: {
      value: 500000,
      confidence: 'Likely',
      expanded: false
    },
    payoff: {
      value: 300000,
      confidence: 'Likely',
      expanded: false
    },
    purchase: {
      value: 600000,
      confidence: 'Likely',
      expanded: false
    }
  });

  // Target monthly payment
  const [targetMonthlyPayment, setTargetMonthlyPayment] = useState(3000);

  // Detailed state for each section (initially hidden)
  const [saleDetails, setSaleDetails] = useState({
    agentCommission: 6,
    titleAndEscrow: 2000,
    transferTax: 1.1,
    homeWarranty: 500,
    preSaleRepairs: 5000,
    stagingCosts: 2000,
    professionalCleaning: 500,
    photography: 500,
    marketingCosts: 1000
  });

  const [payoffDetails, setPayoffDetails] = useState({
    firstMortgage: 300000,
    secondMortgage: 0,
    heloc: 0,
    otherPayments: 0
  });

  const [purchaseDetails, setPurchaseDetails] = useState({
    downPayment: 20,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.5,
    hoaCost: 0,
    insuranceCost: 2000
  });

  // Confidence levels and their corresponding ranges
  const confidenceLevels = {
    'Certain': 0.01,    // ±1%
    'Confident': 0.10,  // ±10%
    'Likely': 0.15,     // ±15%
    'Possible': 0.25,   // ±25%
    'No Idea': 0.5     // ±50%
  };

  // Table configuration
  const [tableConfig, setTableConfig] = useState({
    saleRange: 6,
    purchaseRange: 6,
    saleStep: 25000,
    purchaseStep: 25000
  });

  // Results state
  const [results, setResults] = useState({
    tableData: [],
    netProceeds: 0,
    netAtClosing: 0,
    loanAmount: 0,
    monthlyMortgage: 0,
    monthlyPropertyTax: 0,
    monthlyInsurance: 0,
    monthlyHOA: 0,
    totalMonthlyPayment: 0
  });

  // Toggle expanded view for each section
  const toggleExpanded = (section) => {
    setMainSliders(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        expanded: !prev[section].expanded
      }
    }));
  };

  // Handle main slider changes
  const handleMainSliderChange = (section, value) => {
    setMainSliders(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        value: parseInt(value)
      }
    }));
    
    // If the payoff slider is changed and details are not expanded,
    // update the first mortgage to match the new value
    if (section === 'payoff' && !mainSliders.payoff.expanded) {
      setPayoffDetails(prev => ({
        ...prev,
        firstMortgage: parseInt(value),
        secondMortgage: 0,
        heloc: 0,
        otherPayments: 0
      }));
    }
  };

  // Handle confidence level changes
  const handleConfidenceChange = (section, level) => {
    setMainSliders(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        confidence: level
      }
    }));
  };

  // Handle detailed slider changes
  const handleDetailChange = (section, field, value) => {
    switch(section) {
      case 'sale':
        setSaleDetails(prev => ({ ...prev, [field]: parseFloat(value) }));
        break;
      case 'payoff':
        setPayoffDetails(prev => {
          const updatedDetails = { ...prev, [field]: parseFloat(value) };
          // Update the main payoff slider value based on the sum of all details
          const totalPayoff = updatedDetails.firstMortgage + 
                             updatedDetails.secondMortgage + 
                             updatedDetails.heloc + 
                             updatedDetails.otherPayments;
          setMainSliders(prevSliders => ({
            ...prevSliders,
            payoff: {
              ...prevSliders.payoff,
              value: totalPayoff
            }
          }));
          return updatedDetails;
        });
        break;
      case 'purchase':
        setPurchaseDetails(prev => ({ ...prev, [field]: parseFloat(value) }));
        break;
      default:
        break;
    }
  };

  // Handle target monthly payment change
  const handleTargetPaymentChange = (value) => {
    setTargetMonthlyPayment(value);
  };

  // Initialize the main payoff slider value based on the sum of payoff details
  useEffect(() => {
    const totalPayoff = payoffDetails.firstMortgage + 
                       payoffDetails.secondMortgage + 
                       payoffDetails.heloc + 
                       payoffDetails.otherPayments;
    
    setMainSliders(prev => ({
      ...prev,
      payoff: {
        ...prev.payoff,
        value: totalPayoff
      }
    }));
  }, []);

  // Calculate results whenever any value changes
  useEffect(() => {
    // Get confidence ranges
    const saleConfidence = confidenceLevels[mainSliders.sale.confidence];
    const purchaseConfidence = confidenceLevels[mainSliders.purchase.confidence];
    
    // Generate price ranges
    const { prices: salePrices } = generatePriceRange(
      mainSliders.sale.value, 
      saleConfidence, 
      tableConfig.saleRange
    );
    
    const { prices: purchasePrices } = generatePriceRange(
      mainSliders.purchase.value, 
      purchaseConfidence, 
      tableConfig.purchaseRange
    );
    
    // Calculate table data
    const tableData = calculateTableData(
      salePrices, 
      purchasePrices, 
      saleDetails, 
      payoffDetails, 
      purchaseDetails
    );
    
    // Calculate current scenario results (middle of the table)
    const currentSaleIndex = Math.floor(tableConfig.saleRange / 2);
    const currentPurchaseIndex = Math.floor(tableConfig.purchaseRange / 2);
    const currentScenario = tableData[currentSaleIndex][currentPurchaseIndex];
    
    setResults({
      tableData,
      ...currentScenario
    });
  }, [mainSliders, saleDetails, payoffDetails, purchaseDetails, tableConfig]);

  return {
    mainSliders,
    targetMonthlyPayment,
    saleDetails,
    payoffDetails,
    purchaseDetails,
    confidenceLevels,
    tableConfig,
    results,
    toggleExpanded,
    handleMainSliderChange,
    handleConfidenceChange,
    handleDetailChange,
    handleTargetPaymentChange
  };
}; 