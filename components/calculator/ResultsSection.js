import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency } from '../../utils/formatters';

/**
 * Results section component for displaying calculation results
 * @param {Object} props - Component properties
 * @param {Object} props.results - Object containing calculation results
 * @param {number} props.targetMonthlyPayment - Target monthly payment
 * @returns {JSX.Element} - Results section component
 */
const ResultsSection = ({ results, targetMonthlyPayment }) => {
  // Get cell class based on monthly payment
  const getCellClass = (payment) => {
    if (payment > targetMonthlyPayment * 1.1) return styles.insufficient;
    if (payment > targetMonthlyPayment) return styles.warning;
    return styles.sufficient;
  };

  return (
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
  );
};

export default ResultsSection; 