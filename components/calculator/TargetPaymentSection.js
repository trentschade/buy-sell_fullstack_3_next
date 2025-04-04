import React, { useState } from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import Slider from '../ui/Slider';
import ExpandableSection from '../ui/ExpandableSection';

/**
 * Target payment section component for setting the target monthly payment
 * @param {Object} props - Component properties
 * @param {number} props.targetMonthlyPayment - Target monthly payment value
 * @param {Function} props.onTargetPaymentChange - Function to handle target payment changes
 * @param {Object} props.targetPaymentDetails - Object containing target payment details
 * @returns {JSX.Element} - Target payment section component
 */
const TargetPaymentSection = ({ 
  targetMonthlyPayment,
  onTargetPaymentChange,
  targetPaymentDetails = {
    targetMortgage: 2000,
    targetPropertyTax: 500,
    targetInsurance: 100,
    targetHOA: 300
  },
}) => {

  return (
    <div className={styles.sliderSection}>
      <h2>Target Monthly Payment</h2>
      <Slider 
        label="Target Monthly Payment"
        value={targetMonthlyPayment}
        min={0}
        max={10000}
        step={100}
        onChange={onTargetPaymentChange}
      />
    </div>
  );
};

export default TargetPaymentSection; 