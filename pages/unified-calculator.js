import { useState, useEffect } from 'react';
import styles from '../styles/UnifiedCalculator.module.css';
import Link from 'next/link';

export default function UnifiedCalculator() {
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
    'Certain': 0.05,    // ±5%
    'Confident': 0.10,  // ±10%
    'Likely': 0.15,     // ±15%
    'Possible': 0.25,   // ±25%
    'No Idea': 0.40     // ±40%
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
        setPayoffDetails(prev => ({ ...prev, [field]: parseFloat(value) }));
        break;
      case 'purchase':
        setPurchaseDetails(prev => ({ ...prev, [field]: parseFloat(value) }));
        break;
      default:
        break;
    }
  };

  // Handle target monthly payment change
  const handleTargetPaymentChange = (e) => {
    setTargetMonthlyPayment(parseInt(e.target.value));
  };

  // Calculate results whenever any value changes
  useEffect(() => {
    calculateResults();
  }, [mainSliders, saleDetails, payoffDetails, purchaseDetails, tableConfig, targetMonthlyPayment]);

  // Calculate all results
  const calculateResults = () => {
    // Get confidence ranges
    const saleConfidence = confidenceLevels[mainSliders.sale.confidence];
    const purchaseConfidence = confidenceLevels[mainSliders.purchase.confidence];
    
    // Calculate sale price range
    const saleMin = mainSliders.sale.value * (1 - saleConfidence);
    const saleMax = mainSliders.sale.value * (1 + saleConfidence);
    const saleStep = (saleMax - saleMin) / (tableConfig.saleRange - 1);
    
    // Calculate purchase price range
    const purchaseMin = mainSliders.purchase.value * (1 - purchaseConfidence);
    const purchaseMax = mainSliders.purchase.value * (1 + purchaseConfidence);
    const purchaseStep = (purchaseMax - purchaseMin) / (tableConfig.purchaseRange - 1);
    
    // Generate sale prices
    const salePrices = Array.from({ length: tableConfig.saleRange }, (_, i) => 
      Math.round(saleMin + (i * saleStep))
    );
    
    // Generate purchase prices
    const purchasePrices = Array.from({ length: tableConfig.purchaseRange }, (_, i) => 
      Math.round(purchaseMin + (i * purchaseStep))
    );
    
    // Calculate table data
    const tableData = salePrices.map(salePrice => {
      return purchasePrices.map(purchasePrice => {
        // Calculate net proceeds
        const commission = salePrice * (saleDetails.agentCommission / 100);
        const transferTax = salePrice * (saleDetails.transferTax / 100);
        const totalSellingCosts = commission + saleDetails.titleAndEscrow + transferTax + 
                                saleDetails.homeWarranty + saleDetails.preSaleRepairs + 
                                saleDetails.stagingCosts + saleDetails.professionalCleaning + 
                                saleDetails.photography + saleDetails.marketingCosts;
        
        const netProceeds = salePrice - totalSellingCosts;
        
        // Calculate net at closing
        const netAtClosing = netProceeds - payoffDetails.firstMortgage - 
                           payoffDetails.secondMortgage - payoffDetails.heloc - 
                           payoffDetails.otherPayments;
        
        // Calculate loan amount
        const downPaymentAmount = purchasePrice * (purchaseDetails.downPayment / 100);
        const loanAmount = purchasePrice - netAtClosing;
        
        // Calculate monthly mortgage
        const monthlyRate = purchaseDetails.interestRate / 100 / 12;
        const numberOfPayments = purchaseDetails.loanTerm * 12;
        const monthlyMortgage = loanAmount * 
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        // Calculate other monthly costs
        const monthlyPropertyTax = (purchasePrice * purchaseDetails.propertyTaxRate / 100) / 12;
        const monthlyInsurance = purchaseDetails.insuranceCost / 12;
        const monthlyHOA = purchaseDetails.hoaCost;
        
        // Calculate total monthly payment
        const totalMonthlyPayment = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyHOA;
        
        return {
          salePrice,
          purchasePrice,
          netProceeds,
          netAtClosing,
          loanAmount,
          monthlyMortgage,
          monthlyPropertyTax,
          monthlyInsurance,
          monthlyHOA,
          totalMonthlyPayment
        };
      });
    });
    
    // Calculate current scenario results (middle of the table)
    const currentSaleIndex = Math.floor(tableConfig.saleRange / 2);
    const currentPurchaseIndex = Math.floor(tableConfig.purchaseRange / 2);
    const currentScenario = tableData[currentSaleIndex][currentPurchaseIndex];
    
    setResults({
      tableData,
      ...currentScenario
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };

  // Get cell class based on monthly payment
  const getCellClass = (payment) => {
    if (payment > targetMonthlyPayment * 1.1) return styles.insufficient;
    if (payment > targetMonthlyPayment) return styles.warning;
    return styles.sufficient;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Buy-Sell Calculator</h1>
      
      
      {/* Monthly Payment Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableLabel}>Monthly Payment Matrix</div>
        <div className={styles.tableContainer}>
          <div className={styles.sideLabel}>Sale Price</div>
          <div className={styles.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>Purchase Price</th>
                  {Array.from({ length: tableConfig.purchaseRange }, (_, i) => {
                    const purchasePrice = results.tableData[0]?.[i]?.purchasePrice || 0;
                    return (
                      <th key={i}>{formatCurrency(purchasePrice)}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: tableConfig.saleRange }, (_, i) => (
                  <tr key={i}>
                    <td>{formatCurrency(results.tableData[i]?.[0]?.salePrice || 0)}</td>
                    {Array.from({ length: tableConfig.purchaseRange }, (_, j) => {
                      const payment = results.tableData[i]?.[j]?.totalMonthlyPayment || 0;
                      return (
                        <td 
                          key={j}
                          className={getCellClass(payment)}
                        >
                          {formatCurrency(payment)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.sufficient}`}></div>
            <span>Sufficient (≤ {formatCurrency(targetMonthlyPayment)})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.warning}`}></div>
            <span>Warning (≤ {formatCurrency(targetMonthlyPayment * 1.1)})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.insufficient}`}></div>
            <span>Insufficient (&gt; {formatCurrency(targetMonthlyPayment * 1.1)})</span>
          </div>
        </div>
      </div>
      {/* Target Monthly Payment Input */}
      <div className={styles.targetPaymentSection}>
        <h2>Target Monthly Payment</h2>
        <div className={styles.sliderGroup}>
          <label>
            <span>Your Target Monthly Payment</span>
            <span>{formatCurrency(targetMonthlyPayment)}</span>
          </label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="100"
            value={targetMonthlyPayment}
            onChange={handleTargetPaymentChange}
            className={styles.slider}
          />
        </div>
      </div>
      
      {/* Main Sliders */}
      <div className={styles.mainSliders}>
        {/* Sale Slider */}
        <div className={styles.sliderSection}>
          <h2>Sale Price</h2>
          <div className={styles.sliderGroup}>
            <label>
              <span>Estimated Sale Price</span>
              <span>{formatCurrency(mainSliders.sale.value)}</span>
            </label>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="10000"
              value={mainSliders.sale.value}
              onChange={(e) => handleMainSliderChange('sale', e.target.value)}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.confidenceSelector}>
            <span>Confidence Level:</span>
            <div className={styles.confidenceButtons}>
              {Object.keys(confidenceLevels).map(level => (
                <button
                  key={level}
                  className={`${styles.confidenceButton} ${mainSliders.sale.confidence === level ? styles.active : ''}`}
                  onClick={() => handleConfidenceChange('sale', level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.expandButton}
            onClick={() => toggleExpanded('sale')}
          >
            {mainSliders.sale.expanded ? '−' : '+'} Detailed Sale Costs
          </button>
          
          {mainSliders.sale.expanded && (
            <div className={styles.detailedSection}>
              <div className={styles.sliderGroup}>
                <label>
                  <span>Agent Commission</span>
                  <span>{formatPercentage(saleDetails.agentCommission)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={saleDetails.agentCommission}
                  onChange={(e) => handleDetailChange('sale', 'agentCommission', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Title & Escrow</span>
                  <span>{formatCurrency(saleDetails.titleAndEscrow)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={saleDetails.titleAndEscrow}
                  onChange={(e) => handleDetailChange('sale', 'titleAndEscrow', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Transfer Tax</span>
                  <span>{formatPercentage(saleDetails.transferTax)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={saleDetails.transferTax}
                  onChange={(e) => handleDetailChange('sale', 'transferTax', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Home Warranty</span>
                  <span>{formatCurrency(saleDetails.homeWarranty)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={saleDetails.homeWarranty}
                  onChange={(e) => handleDetailChange('sale', 'homeWarranty', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Pre-Sale Repairs</span>
                  <span>{formatCurrency(saleDetails.preSaleRepairs)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={saleDetails.preSaleRepairs}
                  onChange={(e) => handleDetailChange('sale', 'preSaleRepairs', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Staging Costs</span>
                  <span>{formatCurrency(saleDetails.stagingCosts)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={saleDetails.stagingCosts}
                  onChange={(e) => handleDetailChange('sale', 'stagingCosts', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Professional Cleaning</span>
                  <span>{formatCurrency(saleDetails.professionalCleaning)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={saleDetails.professionalCleaning}
                  onChange={(e) => handleDetailChange('sale', 'professionalCleaning', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Photography</span>
                  <span>{formatCurrency(saleDetails.photography)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={saleDetails.photography}
                  onChange={(e) => handleDetailChange('sale', 'photography', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Marketing Costs</span>
                  <span>{formatCurrency(saleDetails.marketingCosts)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={saleDetails.marketingCosts}
                  onChange={(e) => handleDetailChange('sale', 'marketingCosts', e.target.value)}
                  className={styles.slider}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Payoff Slider */}
        <div className={styles.sliderSection}>
          <h2>Payoff Amount</h2>
          <div className={styles.sliderGroup}>
            <label>
              <span>Total Payoff Amount</span>
              <span>{formatCurrency(mainSliders.payoff.value)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={mainSliders.payoff.value}
              onChange={(e) => handleMainSliderChange('payoff', e.target.value)}
              className={styles.slider}
            />
          </div>
          
          <button 
            className={styles.expandButton}
            onClick={() => toggleExpanded('payoff')}
          >
            {mainSliders.payoff.expanded ? '−' : '+'} Detailed Payoff
          </button>
          
          {mainSliders.payoff.expanded && (
            <div className={styles.detailedSection}>
              <div className={styles.sliderGroup}>
                <label>
                  <span>First Mortgage</span>
                  <span>{formatCurrency(payoffDetails.firstMortgage)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={payoffDetails.firstMortgage}
                  onChange={(e) => handleDetailChange('payoff', 'firstMortgage', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Second Mortgage</span>
                  <span>{formatCurrency(payoffDetails.secondMortgage)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={payoffDetails.secondMortgage}
                  onChange={(e) => handleDetailChange('payoff', 'secondMortgage', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>HELOC</span>
                  <span>{formatCurrency(payoffDetails.heloc)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={payoffDetails.heloc}
                  onChange={(e) => handleDetailChange('payoff', 'heloc', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Other Payments</span>
                  <span>{formatCurrency(payoffDetails.otherPayments)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="300000"
                  step="10000"
                  value={payoffDetails.otherPayments}
                  onChange={(e) => handleDetailChange('payoff', 'otherPayments', e.target.value)}
                  className={styles.slider}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Purchase Slider */}
        <div className={styles.sliderSection}>
          <h2>Purchase Price</h2>
          <div className={styles.sliderGroup}>
            <label>
              <span>Estimated Purchase Price</span>
              <span>{formatCurrency(mainSliders.purchase.value)}</span>
            </label>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="10000"
              value={mainSliders.purchase.value}
              onChange={(e) => handleMainSliderChange('purchase', e.target.value)}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.confidenceSelector}>
            <span>Confidence Level:</span>
            <div className={styles.confidenceButtons}>
              {Object.keys(confidenceLevels).map(level => (
                <button
                  key={level}
                  className={`${styles.confidenceButton} ${mainSliders.purchase.confidence === level ? styles.active : ''}`}
                  onClick={() => handleConfidenceChange('purchase', level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.expandButton}
            onClick={() => toggleExpanded('purchase')}
          >
            {mainSliders.purchase.expanded ? '−' : '+'} Detailed Purchase
          </button>
          
          {mainSliders.purchase.expanded && (
            <div className={styles.detailedSection}>
              <div className={styles.sliderGroup}>
                <label>
                  <span>Down Payment</span>
                  <span>{formatPercentage(purchaseDetails.downPayment)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={purchaseDetails.downPayment}
                  onChange={(e) => handleDetailChange('purchase', 'downPayment', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Interest Rate</span>
                  <span>{formatPercentage(purchaseDetails.interestRate)}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.25"
                  value={purchaseDetails.interestRate}
                  onChange={(e) => handleDetailChange('purchase', 'interestRate', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Loan Term (Years)</span>
                  <span>{purchaseDetails.loanTerm}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="5"
                  value={purchaseDetails.loanTerm}
                  onChange={(e) => handleDetailChange('purchase', 'loanTerm', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Property Tax Rate</span>
                  <span>{formatPercentage(purchaseDetails.propertyTaxRate)}</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={purchaseDetails.propertyTaxRate}
                  onChange={(e) => handleDetailChange('purchase', 'propertyTaxRate', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>HOA Cost</span>
                  <span>{formatCurrency(purchaseDetails.hoaCost)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={purchaseDetails.hoaCost}
                  onChange={(e) => handleDetailChange('purchase', 'hoaCost', e.target.value)}
                  className={styles.slider}
                />
              </div>
              
              <div className={styles.sliderGroup}>
                <label>
                  <span>Insurance Cost (Annual)</span>
                  <span>{formatCurrency(purchaseDetails.insuranceCost)}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={purchaseDetails.insuranceCost}
                  onChange={(e) => handleDetailChange('purchase', 'insuranceCost', e.target.value)}
                  className={styles.slider}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Current Scenario Results */}
      <div className={styles.results}>
        <h2>Current Scenario Results</h2>
        <div className={styles.resultGrid}>
          <div className={styles.resultItem}>
            <span className={styles.label}>Net Proceeds</span>
            <span className={styles.value}>{formatCurrency(results.netProceeds)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Net at Closing</span>
            <span className={styles.value}>{formatCurrency(results.netAtClosing)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Loan Amount</span>
            <span className={styles.value}>{formatCurrency(results.loanAmount)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Monthly Mortgage</span>
            <span className={styles.value}>{formatCurrency(results.monthlyMortgage)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Monthly Property Tax</span>
            <span className={styles.value}>{formatCurrency(results.monthlyPropertyTax)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Monthly Insurance</span>
            <span className={styles.value}>{formatCurrency(results.monthlyInsurance)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Monthly HOA</span>
            <span className={styles.value}>{formatCurrency(results.monthlyHOA)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.label}>Total Monthly Payment</span>
            <span className={`${styles.value} ${getCellClass(results.totalMonthlyPayment)}`}>
              {formatCurrency(results.totalMonthlyPayment)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 