import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency } from '../../utils/formatters';

/**
 * TargetPaymentSection component
 * Allows users to set their target monthly payment
 * @param {Object} props - Component properties
 * @param {number} props.targetMonthlyPayment - Current target monthly payment
 * @param {Function} props.onTargetPaymentChange - Handler for target payment changes
 * @returns {JSX.Element} - Target payment section component
 */
const TargetPaymentSection = ({ 
  targetMonthlyPayment = 3000, 
  onTargetPaymentChange = () => {} 
}) => {
  return (
    <div className={styles.targetPaymentSection}>
      <div className={styles.sliderGroup}>
        <div className={styles.sliderLabel}>
          <span>Target Monthly Payment</span>
          <span className={styles.sliderValue}>{formatCurrency(targetMonthlyPayment)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={targetMonthlyPayment}
          onChange={(e) => onTargetPaymentChange(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
    </div>
  );
};

export default TargetPaymentSection; 