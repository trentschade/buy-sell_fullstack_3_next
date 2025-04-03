import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/SellerCalculator.module.css';
import FloatingDashboard from '../components/FloatingDashboard';

const calculateMonthlyMortgage = (loanAmount, annualInterestRate, loanTermYears) => {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  
  return monthlyPayment;
};

export default function SellerCalculator() {
  const [formData, setFormData] = useState({
    salePrice: 500000,
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

  const [previousData, setPreviousData] = useState({
    salePrice: 500000,
    commissionRate: 6,
    closingCosts: 2000,
    repairs: 5000,
    otherCosts: 4500,
    firstMortgage: 0,
    secondMortgage: 0,
    heloc: 0,
    otherPayments: 0,
    purchasePrice: 600000,
    downPayment: 20,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.5,
    hoaCost: 0,
    insuranceCost: 2000
  });

  const [results, setResults] = useState({
    netProceeds: 0,
    costsBreakdown: {
      agentCommission: 0,
      titleAndEscrow: 0,
      transferTax: 0,
      homeWarranty: 0,
      preSaleRepairs: 0,
      stagingCosts: 0,
      professionalCleaning: 0,
      photography: 0,
      marketingCosts: 0,
      totalSellingCosts: 0
    }
  });

  useEffect(() => {
    // Load previous data from localStorage
    const loadPreviousData = () => {
      const storedData = {
        salePrice: localStorage.getItem('salePrice'),
        commissionRate: localStorage.getItem('agentCommission'),
        closingCosts: localStorage.getItem('titleAndEscrow'),
        repairs: localStorage.getItem('preSaleRepairs'),
        otherCosts: localStorage.getItem('otherCosts'),
        firstMortgage: localStorage.getItem('firstMortgage'),
        secondMortgage: localStorage.getItem('secondMortgage'),
        heloc: localStorage.getItem('heloc'),
        otherPayments: localStorage.getItem('otherPayments'),
        purchasePrice: localStorage.getItem('purchasePrice'),
        downPayment: localStorage.getItem('downPayment'),
        interestRate: localStorage.getItem('interestRate'),
        loanTerm: localStorage.getItem('loanTerm'),
        propertyTaxRate: localStorage.getItem('propertyTaxRate'),
        hoaCost: localStorage.getItem('hoaCost'),
        insuranceCost: localStorage.getItem('insuranceCost')
      };

      const parsedData = {};
      Object.entries(storedData).forEach(([key, value]) => {
        parsedData[key] = value ? parseFloat(value) : previousData[key];
      });

      setPreviousData(parsedData);
    };

    loadPreviousData();
  }, []);

  useEffect(() => {
    calculateResults();
  }, [formData]);

  const calculateResults = () => {
    // Calculate selling costs
    const agentCommission = (formData.salePrice * formData.agentCommission) / 100;
    const transferTax = (formData.salePrice * formData.transferTax) / 100;
    const totalSellingCosts = 
      agentCommission +
      formData.titleAndEscrow +
      transferTax +
      formData.homeWarranty +
      formData.preSaleRepairs +
      formData.stagingCosts +
      formData.professionalCleaning +
      formData.photography +
      formData.marketingCosts;

    // Calculate net proceeds (before mortgage)
    const netProceeds = formData.salePrice - totalSellingCosts;

    setResults({
      netProceeds,
      costsBreakdown: {
        agentCommission,
        titleAndEscrow: formData.titleAndEscrow,
        transferTax,
        homeWarranty: formData.homeWarranty,
        preSaleRepairs: formData.preSaleRepairs,
        stagingCosts: formData.stagingCosts,
        professionalCleaning: formData.professionalCleaning,
        photography: formData.photography,
        marketingCosts: formData.marketingCosts,
        totalSellingCosts
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <FloatingDashboard formData={formData} previousData={previousData} />
      <h1 className={styles.title}>Calculate Your Sale Proceeds</h1>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Sale Price</label>
          <input
            type="range"
            name="salePrice"
            min="100000"
            max="2000000"
            step="10000"
            value={formData.salePrice}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.salePrice)}</div>
        </div>

        <div className={styles.sectionTitle}>Selling Costs</div>
        
        <div className={styles.inputGroup}>
          <label>Agent Commission (%)</label>
          <input
            type="range"
            name="agentCommission"
            min="0"
            max="10"
            step="0.1"
            value={formData.agentCommission}
            onChange={handleChange}
          />
          <div className={styles.value}>{formData.agentCommission}%</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Title & Escrow</label>
          <input
            type="range"
            name="titleAndEscrow"
            min="0"
            max="5000"
            step="100"
            value={formData.titleAndEscrow}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.titleAndEscrow)}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Transfer Tax (%)</label>
          <input
            type="range"
            name="transferTax"
            min="0"
            max="3"
            step="0.1"
            value={formData.transferTax}
            onChange={handleChange}
          />
          <div className={styles.value}>{formData.transferTax}%</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Home Warranty</label>
          <input
            type="range"
            name="homeWarranty"
            min="0"
            max="2000"
            step="100"
            value={formData.homeWarranty}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.homeWarranty)}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Pre-Sale Repairs</label>
          <input
            type="range"
            name="preSaleRepairs"
            min="0"
            max="20000"
            step="500"
            value={formData.preSaleRepairs}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.preSaleRepairs)}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Staging Costs</label>
          <input
            type="range"
            name="stagingCosts"
            min="0"
            max="5000"
            step="100"
            value={formData.stagingCosts}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.stagingCosts)}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Professional Cleaning</label>
          <input
            type="range"
            name="professionalCleaning"
            min="0"
            max="1000"
            step="50"
            value={formData.professionalCleaning}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.professionalCleaning)}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Photography</label>
          <input
            type="range"
            name="photography"
            min="0"
            max="1000"
            step="50"
            value={formData.photography}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.photography)}</div>
        </div>

        <div className={styles.inputGroup}>
          <label>Marketing Costs</label>
          <input
            type="range"
            name="marketingCosts"
            min="0"
            max="3000"
            step="100"
            value={formData.marketingCosts}
            onChange={handleChange}
          />
          <div className={styles.value}>{formatCurrency(formData.marketingCosts)}</div>
        </div>
      </div>

      <div className={styles.results}>
        <h2>Costs Breakdown</h2>
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span>Agent Commission</span>
            <span>{formatCurrency(results.costsBreakdown.agentCommission)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Title & Escrow</span>
            <span>{formatCurrency(results.costsBreakdown.titleAndEscrow)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Transfer Tax</span>
            <span>{formatCurrency(results.costsBreakdown.transferTax)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Home Warranty</span>
            <span>{formatCurrency(results.costsBreakdown.homeWarranty)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Pre-Sale Repairs</span>
            <span>{formatCurrency(results.costsBreakdown.preSaleRepairs)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Staging Costs</span>
            <span>{formatCurrency(results.costsBreakdown.stagingCosts)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Professional Cleaning</span>
            <span>{formatCurrency(results.costsBreakdown.professionalCleaning)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Photography</span>
            <span>{formatCurrency(results.costsBreakdown.photography)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span>Marketing Costs</span>
            <span>{formatCurrency(results.costsBreakdown.marketingCosts)}</span>
          </div>
          <div className={`${styles.breakdownItem} ${styles.total}`}>
            <span>Total Selling Costs</span>
            <span>{formatCurrency(results.costsBreakdown.totalSellingCosts)}</span>
          </div>
        </div>

        <h2>Net Proceeds (Before Mortgage)</h2>
        <div className={styles.netProceeds}>
          {formatCurrency(results.netProceeds)}
        </div>

        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${styles.active}`}>Step 1: Sale Proceeds</div>
          <div className={styles.step}>Step 2: Payoff & Down Payment</div>
          <div className={styles.step}>Step 3: New Home Purchase</div>
          <div className={styles.step}>Step 4: Price Comparison</div>
        </div>

        <div className={styles.navigation}>
          <Link href="/payoff-calculator" className={styles.nextButton}>
            Next Step
          </Link>
        </div>
      </div>
    </div>
  );
} 