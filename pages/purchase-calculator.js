import { useState, useEffect } from 'react';
import styles from '../styles/SellerCalculator.module.css';
import Link from 'next/link';

export default function PurchaseCalculator() {
  const [formData, setFormData] = useState({
    purchasePrice: 500000,
    downPayment: 20,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.5,
    hoaCost: 0,
    insuranceCost: 2000
  });

  // Get net amount at closing from step 2
  const [netAtClosing, setNetAtClosing] = useState(0);

  useEffect(() => {
    // Get net amount at closing from localStorage (set in step 2)
    const storedNetAtClosing = localStorage.getItem('netAtClosing');
    if (storedNetAtClosing) {
      setNetAtClosing(parseFloat(storedNetAtClosing));
    }
  }, []);

  useEffect(() => {
    // Load saved values from localStorage
    const savedValues = {
      purchasePrice: localStorage.getItem('purchasePrice'),
      downPayment: localStorage.getItem('downPayment'),
      interestRate: localStorage.getItem('interestRate'),
      loanTerm: localStorage.getItem('loanTerm'),
      propertyTaxRate: localStorage.getItem('propertyTaxRate'),
      hoaCost: localStorage.getItem('hoaCost'),
      insuranceCost: localStorage.getItem('insuranceCost')
    };

    // Update form data with saved values if they exist
    if (savedValues.purchasePrice) setFormData(prev => ({ ...prev, purchasePrice: parseFloat(savedValues.purchasePrice) }));
    if (savedValues.downPayment) setFormData(prev => ({ ...prev, downPayment: parseFloat(savedValues.downPayment) }));
    if (savedValues.interestRate) setFormData(prev => ({ ...prev, interestRate: parseFloat(savedValues.interestRate) }));
    if (savedValues.loanTerm) setFormData(prev => ({ ...prev, loanTerm: parseFloat(savedValues.loanTerm) }));
    if (savedValues.propertyTaxRate) setFormData(prev => ({ ...prev, propertyTaxRate: parseFloat(savedValues.propertyTaxRate) }));
    if (savedValues.hoaCost) setFormData(prev => ({ ...prev, hoaCost: parseFloat(savedValues.hoaCost) }));
    if (savedValues.insuranceCost) setFormData(prev => ({ ...prev, insuranceCost: parseFloat(savedValues.insuranceCost) }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Calculate loan amount
  const loanAmount = formData.purchasePrice * (1 - formData.downPayment / 100);
  
  // Calculate required down payment
  const requiredDownPayment = formData.purchasePrice * (formData.downPayment / 100);

  // Check if net amount at closing is sufficient for down payment
  const isDownPaymentSufficient = netAtClosing >= requiredDownPayment;
  const downPaymentDifference = requiredDownPayment - netAtClosing;
  
  // Calculate monthly mortgage payment with error handling
  const monthlyRate = formData.interestRate / 100 / 12;
  const numberOfPayments = formData.loanTerm * 12;
  let monthlyMortgage = 0;
  let totalInterest = 0;

  if (formData.interestRate > 0) {
    monthlyMortgage = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate total interest paid
    totalInterest = (monthlyMortgage * numberOfPayments) - loanAmount;
  } else {
    // Handle case where interest rate is 0
    monthlyMortgage = loanAmount / numberOfPayments;
    totalInterest = 0;
  }

  // Calculate monthly property tax
  const annualPropertyTax = formData.purchasePrice * (formData.propertyTaxRate / 100);
  const monthlyPropertyTax = annualPropertyTax / 12;

  // Calculate monthly insurance
  const monthlyInsurance = formData.insuranceCost / 12;

  // Calculate total monthly payment
  const totalMonthlyPayment = monthlyMortgage + monthlyPropertyTax + formData.hoaCost + monthlyInsurance;

  // Calculate total cost over loan term
  const totalCost = (totalMonthlyPayment * numberOfPayments) + (formData.purchasePrice * (formData.downPayment / 100));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value}%`;
  };

  // Save values to localStorage before navigating
  const handleNavigate = () => {
    Object.entries(formData).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.completed}`}>Step 1: Sale Proceeds</div>
        <div className={`${styles.step} ${styles.completed}`}>Step 2: Payoff & Down Payment</div>
        <div className={`${styles.step} ${styles.active}`}>Step 3: New Home Purchase</div>
        <div className={styles.step}>Step 4: Price Comparison</div>
      </div>

      <h1 className={styles.title}>Step 3: Calculate New Home Purchase</h1>
      
      <div className={styles.calculator}>
        <div className={styles.sliderGroup}>
          <label htmlFor="purchasePrice" title="The total price of the home you plan to purchase">
            Purchase Price: {formatCurrency(formData.purchasePrice)}
          </label>
          <input
            type="range"
            id="purchasePrice"
            name="purchasePrice"
            min="100000"
            max="2000000"
            step="10000"
            value={formData.purchasePrice}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="downPayment" title="Percentage of purchase price paid as down payment (minimum 3% for conventional loans)">
            Down Payment: {formatPercent(formData.downPayment)}
          </label>
          <input
            type="range"
            id="downPayment"
            name="downPayment"
            min="3"
            max="50"
            step="1"
            value={formData.downPayment}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="interestRate" title="Annual interest rate for the mortgage loan">
            Interest Rate: {formatPercent(formData.interestRate)}
          </label>
          <input
            type="range"
            id="interestRate"
            name="interestRate"
            min="2"
            max="12"
            step="0.1"
            value={formData.interestRate}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="loanTerm" title="Length of the mortgage loan in years">
            Loan Term: {formData.loanTerm} years
          </label>
          <input
            type="range"
            id="loanTerm"
            name="loanTerm"
            min="15"
            max="30"
            step="5"
            value={formData.loanTerm}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="propertyTaxRate" title="Annual property tax rate as a percentage of home value">
            Property Tax Rate: {formatPercent(formData.propertyTaxRate)}
          </label>
          <input
            type="range"
            id="propertyTaxRate"
            name="propertyTaxRate"
            min="0"
            max="3"
            step="0.1"
            value={formData.propertyTaxRate}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="hoaCost" title="Monthly Homeowners Association fees">
            Monthly HOA Cost: {formatCurrency(formData.hoaCost)}
          </label>
          <input
            type="range"
            id="hoaCost"
            name="hoaCost"
            min="0"
            max="1000"
            step="50"
            value={formData.hoaCost}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="insuranceCost" title="Annual cost of homeowners insurance">
            Annual Insurance: {formatCurrency(formData.insuranceCost)}
          </label>
          <input
            type="range"
            id="insuranceCost"
            name="insuranceCost"
            min="500"
            max="5000"
            step="100"
            value={formData.insuranceCost}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.results}>
          <h2>Down Payment Analysis</h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Net Amount at Closing</span>
              <span className={styles.value}>{formatCurrency(netAtClosing)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Required Down Payment</span>
              <span className={styles.value}>{formatCurrency(requiredDownPayment)}</span>
            </div>
            <div className={`${styles.resultItem} ${isDownPaymentSufficient ? styles.netProceeds : styles.warning}`}>
              <span className={styles.label}>
                {isDownPaymentSufficient ? 'Down Payment Status' : 'Additional Funds Needed'}
              </span>
              <span className={styles.value}>
                {isDownPaymentSufficient 
                  ? 'Sufficient Funds Available' 
                  : formatCurrency(downPaymentDifference)}
              </span>
            </div>
          </div>

          <h2>Monthly Payment Breakdown</h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Loan Amount</span>
              <span className={styles.value}>{formatCurrency(loanAmount)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Monthly Mortgage</span>
              <span className={styles.value}>{formatCurrency(monthlyMortgage)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Monthly Property Tax</span>
              <span className={styles.value}>{formatCurrency(monthlyPropertyTax)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Monthly HOA</span>
              <span className={styles.value}>{formatCurrency(formData.hoaCost)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Monthly Insurance</span>
              <span className={styles.value}>{formatCurrency(monthlyInsurance)}</span>
            </div>
            <div className={`${styles.resultItem} ${styles.netProceeds}`}>
              <span className={styles.label}>Total Monthly Payment</span>
              <span className={styles.value}>{formatCurrency(totalMonthlyPayment)}</span>
            </div>
          </div>

          <h2>Total Cost Breakdown</h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Down Payment</span>
              <span className={styles.value}>{formatCurrency(requiredDownPayment)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total Interest Paid</span>
              <span className={styles.value}>{formatCurrency(totalInterest)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total Property Tax</span>
              <span className={styles.value}>{formatCurrency(annualPropertyTax * formData.loanTerm)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total HOA</span>
              <span className={styles.value}>{formatCurrency(formData.hoaCost * numberOfPayments)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total Insurance</span>
              <span className={styles.value}>{formatCurrency(formData.insuranceCost * formData.loanTerm)}</span>
            </div>
            <div className={`${styles.resultItem} ${styles.netProceeds}`}>
              <span className={styles.label}>Total Cost Over {formData.loanTerm} Years</span>
              <span className={styles.value}>{formatCurrency(totalCost)}</span>
            </div>
          </div>
        </div>

        <div className={styles.navigation}>
          <Link href="/payoff-calculator" className={styles.prevButton} onClick={handleNavigate}>
            Previous Step
          </Link>
          <Link href="/comparison-table" className={styles.nextButton} onClick={handleNavigate}>
            Next Step
          </Link>
        </div>
      </div>
    </div>
  );
} 