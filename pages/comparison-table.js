import { useState, useEffect } from 'react';
import styles from '../styles/SellerCalculator.module.css';
import Link from 'next/link';

export default function ComparisonTable() {
  // Get data from previous steps
  const [previousData, setPreviousData] = useState({
    netProceeds: 0,
    netAtClosing: 0,
    commissionRate: 0,
    closingCosts: 0,
    repairs: 0,
    otherCosts: 0,
    firstMortgage: 0,
    secondMortgage: 0,
    heloc: 0,
    otherPayments: 0,
    salePrice: 0,
    purchasePrice: 0
  });

  // Table configuration
  const [tableConfig, setTableConfig] = useState({
    salePriceStart: 400000,
    salePriceEnd: 600000,
    salePriceStep: 50000,
    buyPriceStart: 500000,
    buyPriceEnd: 800000,
    buyPriceStep: 50000,
    downPayment: 20,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.5,
    hoaCost: 0,
    insuranceCost: 2000,
    monthlyPaymentThreshold: 3000
  });

  useEffect(() => {
    // Load data from previous steps
    const loadPreviousData = () => {
      const data = {
        netProceeds: parseFloat(localStorage.getItem('netProceeds') || '0'),
        netAtClosing: parseFloat(localStorage.getItem('netAtClosing') || '0'),
        commissionRate: parseFloat(localStorage.getItem('commissionRate') || '0'),
        closingCosts: parseFloat(localStorage.getItem('closingCosts') || '0'),
        repairs: parseFloat(localStorage.getItem('repairs') || '0'),
        otherCosts: parseFloat(localStorage.getItem('otherCosts') || '0'),
        firstMortgage: parseFloat(localStorage.getItem('firstMortgage') || '0'),
        secondMortgage: parseFloat(localStorage.getItem('secondMortgage') || '0'),
        heloc: parseFloat(localStorage.getItem('heloc') || '0'),
        otherPayments: parseFloat(localStorage.getItem('otherPayments') || '0'),
        salePrice: parseFloat(localStorage.getItem('salePrice') || '0'),
        purchasePrice: parseFloat(localStorage.getItem('purchasePrice') || '0')
      };
      setPreviousData(data);

      // Update table configuration based on previous data
      if (data.salePrice > 0) {
        const saleRange = 100000; // ±$50,000 from sale price
        setTableConfig(prev => ({
          ...prev,
          salePriceStart: Math.max(100000, data.salePrice - saleRange),
          salePriceEnd: data.salePrice + saleRange,
          salePriceStep: 25000
        }));
      }

      if (data.purchasePrice > 0) {
        const buyRange = 150000; // ±$75,000 from purchase price
        setTableConfig(prev => ({
          ...prev,
          buyPriceStart: Math.max(100000, data.purchasePrice - buyRange),
          buyPriceEnd: data.purchasePrice + buyRange,
          buyPriceStep: 25000
        }));
      }
    };

    loadPreviousData();
  }, []);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setTableConfig(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Calculate monthly mortgage payment
  const calculateMonthlyMortgage = (loanAmount, interestRate, loanTerm) => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (interestRate > 0) {
      return loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      return loanAmount / numberOfPayments;
    }
  };

  // Generate price ranges
  const salePrices = [];
  const buyPrices = [];
  
  for (let price = tableConfig.salePriceStart; price <= tableConfig.salePriceEnd; price += tableConfig.salePriceStep) {
    salePrices.push(price);
  }
  
  for (let price = tableConfig.buyPriceStart; price <= tableConfig.buyPriceEnd; price += tableConfig.buyPriceStep) {
    buyPrices.push(price);
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.completed}`}>Step 1: Sale Proceeds</div>
        <div className={`${styles.step} ${styles.completed}`}>Step 2: Payoff & Down Payment</div>
        <div className={`${styles.step} ${styles.completed}`}>Step 3: New Home Purchase</div>
        <div className={`${styles.step} ${styles.active}`}>Step 4: Price Comparison</div>
      </div>

      <h1 className={styles.title}>Step 4: Compare Different Price Scenarios</h1>
      
      <div className={styles.calculator}>
        <div className={styles.tableConfig}>
          <h2>Table Configuration</h2>
          <div className={styles.configGrid}>
            <div className={styles.configGroup}>
              <h3>Sale Price Range</h3>
              <div className={styles.sliderGroup}>
                <label htmlFor="salePriceStart" title="Starting sale price for comparison">
                  Start: {formatCurrency(tableConfig.salePriceStart)}
                </label>
                <input
                  type="range"
                  id="salePriceStart"
                  name="salePriceStart"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={tableConfig.salePriceStart}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <label htmlFor="salePriceEnd" title="Ending sale price for comparison">
                  End: {formatCurrency(tableConfig.salePriceEnd)}
                </label>
                <input
                  type="range"
                  id="salePriceEnd"
                  name="salePriceEnd"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={tableConfig.salePriceEnd}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <label htmlFor="salePriceStep" title="Step size between sale prices">
                  Step: {formatCurrency(tableConfig.salePriceStep)}
                </label>
                <input
                  type="range"
                  id="salePriceStep"
                  name="salePriceStep"
                  min="10000"
                  max="100000"
                  step="10000"
                  value={tableConfig.salePriceStep}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.configGroup}>
              <h3>Buy Price Range</h3>
              <div className={styles.sliderGroup}>
                <label htmlFor="buyPriceStart" title="Starting purchase price for comparison">
                  Start: {formatCurrency(tableConfig.buyPriceStart)}
                </label>
                <input
                  type="range"
                  id="buyPriceStart"
                  name="buyPriceStart"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={tableConfig.buyPriceStart}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <label htmlFor="buyPriceEnd" title="Ending purchase price for comparison">
                  End: {formatCurrency(tableConfig.buyPriceEnd)}
                </label>
                <input
                  type="range"
                  id="buyPriceEnd"
                  name="buyPriceEnd"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={tableConfig.buyPriceEnd}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <label htmlFor="buyPriceStep" title="Step size between purchase prices">
                  Step: {formatCurrency(tableConfig.buyPriceStep)}
                </label>
                <input
                  type="range"
                  id="buyPriceStep"
                  name="buyPriceStep"
                  min="10000"
                  max="100000"
                  step="10000"
                  value={tableConfig.buyPriceStep}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.configGroup}>
              <h3>Payment Threshold</h3>
              <div className={styles.sliderGroup}>
                <label htmlFor="monthlyPaymentThreshold" title="Monthly payment threshold for color coding">
                  Threshold: {formatCurrency(tableConfig.monthlyPaymentThreshold)}
                </label>
                <input
                  type="range"
                  id="monthlyPaymentThreshold"
                  name="monthlyPaymentThreshold"
                  min="1000"
                  max="10000"
                  step="100"
                  value={tableConfig.monthlyPaymentThreshold}
                  onChange={handleConfigChange}
                  className={styles.slider}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableLabel}>Monthly Payment Matrix</div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.sufficient}`}></div>
              <span>Sufficient Down Payment & Below Threshold</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.warning}`}></div>
              <span>Sufficient Down Payment & Near Threshold (±10%)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.insufficient}`}></div>
              <span>Insufficient Down Payment or Above Threshold</span>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <div className={styles.sideLabel}>Sale Price</div>
            <div className={styles.comparisonTable}>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {buyPrices.map(price => (
                      <th key={price}>{formatCurrency(price)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salePrices.map(salePrice => (
                    <tr key={salePrice}>
                      <td>{formatCurrency(salePrice)}</td>
                      {buyPrices.map(buyPrice => {
                        // Calculate net proceeds for this sale price
                        const commission = salePrice * (previousData.commissionRate / 100);
                        const netProceeds = salePrice - commission - previousData.closingCosts - 
                                          previousData.repairs - previousData.otherCosts;
                        
                        // Calculate net at closing
                        const netAtClosing = netProceeds - previousData.firstMortgage - 
                                           previousData.secondMortgage - previousData.heloc - 
                                           previousData.otherPayments;
                        
                        // Calculate actual down payment (net at closing)
                        const actualDownPayment = netAtClosing;
                        
                        // Calculate required down payment (20% of purchase price)
                        const requiredDownPayment = buyPrice * 0.2;
                        
                        // Calculate loan amount based on actual down payment
                        const loanAmount = buyPrice - actualDownPayment;
                        
                        // Calculate monthly mortgage
                        const monthlyMortgage = calculateMonthlyMortgage(
                          loanAmount,
                          tableConfig.interestRate,
                          tableConfig.loanTerm
                        );
                        
                        // Calculate monthly property tax
                        const monthlyPropertyTax = (buyPrice * (tableConfig.propertyTaxRate / 100)) / 12;
                        
                        // Calculate monthly insurance
                        const monthlyInsurance = tableConfig.insuranceCost / 12;
                        
                        // Calculate total monthly payment
                        const totalMonthlyPayment = monthlyMortgage + monthlyPropertyTax + 
                                                  tableConfig.hoaCost + monthlyInsurance;

                        // Determine cell styling based on down payment and monthly payment threshold
                        let cellStyle = '';
                        if (actualDownPayment >= requiredDownPayment) {
                          const threshold = tableConfig.monthlyPaymentThreshold;
                          const upperThreshold = threshold * 1.1; // 10% above threshold
                          
                          if (totalMonthlyPayment <= threshold) {
                            cellStyle = styles.sufficient;
                          } else if (totalMonthlyPayment <= upperThreshold) {
                            cellStyle = styles.warning;
                          } else {
                            cellStyle = styles.insufficient;
                          }
                        } else {
                          cellStyle = styles.insufficient;
                        }

                        // Add down payment indicator
                        const downPaymentPercent = (actualDownPayment / buyPrice) * 100;
                        const downPaymentIndicator = downPaymentPercent < 20 ? 
                          ` (${downPaymentPercent.toFixed(1)}% down)` : '';

                        return (
                          <td key={buyPrice} className={cellStyle}>
                            {formatCurrency(totalMonthlyPayment)}
                            {downPaymentIndicator}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.navigation}>
          <Link href="/purchase-calculator" className={styles.prevButton}>
            Previous Step
          </Link>
        </div>
      </div>
    </div>
  );
} 