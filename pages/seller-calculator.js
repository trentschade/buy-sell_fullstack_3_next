import { useState, useEffect } from 'react';
import styles from '../styles/SellerCalculator.module.css';
import Link from 'next/link';

export default function SellerCalculator() {
  const [formData, setFormData] = useState({
    salePrice: 500000,
    commissionRate: 6,
    closingCosts: 2,
    repairs: 0,
    otherCosts: 0
  });

  useEffect(() => {
    // Load saved values from localStorage
    const savedValues = {
      salePrice: localStorage.getItem('salePrice'),
      commissionRate: localStorage.getItem('commissionRate'),
      closingCosts: localStorage.getItem('closingCosts'),
      repairs: localStorage.getItem('repairs'),
      otherCosts: localStorage.getItem('otherCosts')
    };

    // Update form data with saved values if they exist
    if (savedValues.salePrice) setFormData(prev => ({ ...prev, salePrice: parseFloat(savedValues.salePrice) }));
    if (savedValues.commissionRate) setFormData(prev => ({ ...prev, commissionRate: parseFloat(savedValues.commissionRate) }));
    if (savedValues.closingCosts) setFormData(prev => ({ ...prev, closingCosts: parseFloat(savedValues.closingCosts) }));
    if (savedValues.repairs) setFormData(prev => ({ ...prev, repairs: parseFloat(savedValues.repairs) }));
    if (savedValues.otherCosts) setFormData(prev => ({ ...prev, otherCosts: parseFloat(savedValues.otherCosts) }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Save values to localStorage before navigating
  const handleNavigate = () => {
    Object.entries(formData).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  };

  // Calculate all costs
  const commission = formData.salePrice * (formData.commissionRate / 100);
  const closingCosts = formData.salePrice * (formData.closingCosts / 100);
  const totalCosts = commission + closingCosts + formData.repairs + formData.otherCosts;
  const netProceeds = formData.salePrice - totalCosts;

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
        <div className={`${styles.step} ${styles.active}`}>Step 1: Sale Proceeds</div>
        <div className={styles.step}>Step 2: Payoff & Down Payment</div>
        <div className={styles.step}>Step 3: New Home Purchase</div>
        <div className={styles.step}>Step 4: Price Comparison</div>
      </div>

      <h1 className={styles.title}>Step 1: Calculate Sale Proceeds</h1>
      
      <div className={styles.calculator}>
        <div className={styles.sliderGroup}>
          <label htmlFor="salePrice">
            Sale Price: {formatCurrency(formData.salePrice)}
          </label>
          <input
            type="range"
            id="salePrice"
            name="salePrice"
            min="100000"
            max="2000000"
            step="10000"
            value={formData.salePrice}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="commissionRate">
            Commission Rate: {formData.commissionRate}%
          </label>
          <input
            type="range"
            id="commissionRate"
            name="commissionRate"
            min="0"
            max="10"
            step="0.5"
            value={formData.commissionRate}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="closingCosts">
            Closing Costs: {formData.closingCosts}%
          </label>
          <input
            type="range"
            id="closingCosts"
            name="closingCosts"
            min="0"
            max="5"
            step="0.5"
            value={formData.closingCosts}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="repairs">
            Repairs & Improvements: {formatCurrency(formData.repairs)}
          </label>
          <input
            type="range"
            id="repairs"
            name="repairs"
            min="0"
            max="50000"
            step="1000"
            value={formData.repairs}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.sliderGroup}>
          <label htmlFor="otherCosts">
            Other Costs: {formatCurrency(formData.otherCosts)}
          </label>
          <input
            type="range"
            id="otherCosts"
            name="otherCosts"
            min="0"
            max="50000"
            step="1000"
            value={formData.otherCosts}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>

        <div className={styles.results}>
          <h2>Net Proceeds Breakdown</h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Sale Price</span>
              <span className={styles.value}>{formatCurrency(formData.salePrice)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Commission ({formData.commissionRate}%)</span>
              <span className={styles.value}>{formatCurrency(commission)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Closing Costs ({formData.closingCosts}%)</span>
              <span className={styles.value}>{formatCurrency(closingCosts)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Repairs & Improvements</span>
              <span className={styles.value}>{formatCurrency(formData.repairs)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Other Costs</span>
              <span className={styles.value}>{formatCurrency(formData.otherCosts)}</span>
            </div>
            <div className={`${styles.resultItem} ${styles.netProceeds}`}>
              <span className={styles.label}>Net Proceeds</span>
              <span className={styles.value}>{formatCurrency(netProceeds)}</span>
            </div>
          </div>
        </div>

        <div className={styles.navigation}>
          <Link href="/payoff-calculator" className={styles.nextButton} onClick={handleNavigate}>
            Next Step
          </Link>
        </div>
      </div>
    </div>
  );
} 