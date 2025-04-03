import { useState, useEffect } from 'react';
import styles from '../styles/SellerCalculator.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FloatingDashboard from '../components/FloatingDashboard';

export default function PayoffCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstMortgage: 0,
    secondMortgage: 0,
    heloc: 0,
    otherPayments: 0
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

  // Get net proceeds from step 1 (default to 0 if not set)
  const [netProceeds, setNetProceeds] = useState(0);

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
    // Get net proceeds from localStorage (set in step 1)
    const storedNetProceeds = localStorage.getItem('netProceeds');
    if (storedNetProceeds) {
      setNetProceeds(parseFloat(storedNetProceeds));
    }
  }, []);

  useEffect(() => {
    // Load saved values from localStorage
    const savedValues = {
      firstMortgage: localStorage.getItem('firstMortgage'),
      secondMortgage: localStorage.getItem('secondMortgage'),
      heloc: localStorage.getItem('heloc'),
      otherPayments: localStorage.getItem('otherPayments')
    };

    // Update form data with saved values if they exist
    if (savedValues.firstMortgage) setFormData(prev => ({ ...prev, firstMortgage: parseFloat(savedValues.firstMortgage) }));
    if (savedValues.secondMortgage) setFormData(prev => ({ ...prev, secondMortgage: parseFloat(savedValues.secondMortgage) }));
    if (savedValues.heloc) setFormData(prev => ({ ...prev, heloc: parseFloat(savedValues.heloc) }));
    if (savedValues.otherPayments) setFormData(prev => ({ ...prev, otherPayments: parseFloat(savedValues.otherPayments) }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Save values to localStorage before navigating
  const handleNavigate = (direction) => {
    Object.entries(formData).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  };

  // Calculate total payoffs
  const totalPayoffs = formData.firstMortgage + formData.secondMortgage + formData.heloc + formData.otherPayments;

  // Calculate net amount at closing
  const netAtClosing = netProceeds - totalPayoffs;

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
      <FloatingDashboard formData={formData} previousData={previousData} />
      <div className={styles.calculator}>
        <div className={styles.sliderGroup}>
          <label htmlFor="firstMortgage" title="Balance of your primary mortgage">
            First Mortgage Balance: {formatCurrency(formData.firstMortgage)}
          </label>
          <input
            type="range"
            id="firstMortgage"
            name="firstMortgage"
            min="0"
            max="1000000"
            step="10000"
            value={formData.firstMortgage}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="secondMortgage" title="Balance of your second mortgage">
            Second Mortgage Balance: {formatCurrency(formData.secondMortgage)}
          </label>
          <input
            type="range"
            id="secondMortgage"
            name="secondMortgage"
            min="0"
            max="500000"
            step="10000"
            value={formData.secondMortgage}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="heloc" title="Balance of your Home Equity Line of Credit">
            HELOC Balance: {formatCurrency(formData.heloc)}
          </label>
          <input
            type="range"
            id="heloc"
            name="heloc"
            min="0"
            max="500000"
            step="10000"
            value={formData.heloc}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="otherPayments" title="Any other payments or liens that need to be paid at closing">
            Other Payments: {formatCurrency(formData.otherPayments)}
          </label>
          <input
            type="range"
            id="otherPayments"
            name="otherPayments"
            min="0"
            max="100000"
            step="5000"
            value={formData.otherPayments}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.results}>
          <h2>Proceeds & Payoff Summary</h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Net Proceeds from Sale</span>
              <span className={styles.value}>{formatCurrency(netProceeds)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>First Mortgage Payoff</span>
              <span className={styles.value}>{formatCurrency(formData.firstMortgage)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Second Mortgage Payoff</span>
              <span className={styles.value}>{formatCurrency(formData.secondMortgage)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>HELOC Payoff</span>
              <span className={styles.value}>{formatCurrency(formData.heloc)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Other Payments</span>
              <span className={styles.value}>{formatCurrency(formData.otherPayments)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total Payoffs</span>
              <span className={styles.value}>{formatCurrency(totalPayoffs)}</span>
            </div>
            <div className={`${styles.resultItem} ${styles.netProceeds}`}>
              <span className={styles.label}>Net Amount at Closing</span>
              <span className={styles.value}>{formatCurrency(netAtClosing)}</span>
            </div>
          </div>
        </div>

        <div className={styles.results}>
          <h2>Down Payment Available</h2>
          <div className={styles.netProceeds}>
            {formatCurrency(netProceeds)}
          </div>

          <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${styles.completed}`}>Step 1: Sale Proceeds</div>
            <div className={`${styles.step} ${styles.active}`}>Step 2: Payoff & Down Payment</div>
            <div className={styles.step}>Step 3: New Home Purchase</div>
            <div className={styles.step}>Step 4: Price Comparison</div>
          </div>

          <div className={styles.navigation}>
            <Link href="/seller-calculator" className={styles.prevButton}>
              Previous Step
            </Link>
            <Link href="/purchase-calculator" className={styles.nextButton}>
              Next Step
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 