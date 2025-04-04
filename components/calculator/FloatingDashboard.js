import React from 'react';
import styles from '../../styles/FloatingDashboard.module.css';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

/**
 * Floating dashboard component that displays key calculation results and summary information
 * @param {Object} props - Component properties
 * @param {Object} props.results - Object containing calculation results
 * @param {number} props.targetMonthlyPayment - Target monthly payment amount
 * @returns {JSX.Element} - Floating dashboard component
 */
const FloatingDashboard = ({ 
  results = {
    totalSaleCosts: 0,
    netProceeds: 0,
    netAtClosing: 0,
    loanAmount: 0,
    monthlyMortgage: 0,
    monthlyPropertyTax: 0,
    monthlyInsurance: 0,
    monthlyHOA: 0,
    totalMonthlyPayment: 0
  }, 
  targetMonthlyPayment = 3000
}) => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.section}>
        <h3>Sale Summary</h3>
        <div className={styles.row}>
          <span>Total Sale Costs:</span>
          <span>{formatCurrency(results.totalSaleCosts)}</span>
        </div>
        <div className={styles.row}>
          <span>Net Proceeds:</span>
          <span>{formatCurrency(results.netProceeds)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Payoff Summary</h3>
        <div className={styles.row}>
          <span>Net at Closing:</span>
          <span>{formatCurrency(results.netAtClosing)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Purchase Summary</h3>
        <div className={styles.row}>
          <span>Loan Amount:</span>
          <span>{formatCurrency(results.loanAmount)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Monthly Payment Summary</h3>
        <div className={styles.row}>
          <span>Target Monthly Payment:</span>
          <span>{formatCurrency(targetMonthlyPayment)}</span>
        </div>
        <div className={styles.row}>
          <span>Monthly Mortgage:</span>
          <span>{formatCurrency(results.monthlyMortgage)}</span>
        </div>
        <div className={styles.row}>
          <span>Monthly Property Tax:</span>
          <span>{formatCurrency(results.monthlyPropertyTax)}</span>
        </div>
        <div className={styles.row}>
          <span>Monthly Insurance:</span>
          <span>{formatCurrency(results.monthlyInsurance)}</span>
        </div>
        <div className={styles.row}>
          <span>Monthly HOA:</span>
          <span>{formatCurrency(results.monthlyHOA)}</span>
        </div>
        <div className={styles.row}>
          <span>Total Monthly Payment:</span>
          <span>{formatCurrency(results.totalMonthlyPayment)}</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingDashboard; 