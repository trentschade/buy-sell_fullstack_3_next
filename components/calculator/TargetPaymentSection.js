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
 * @param {Function} props.handleMainSliderChange - Function to handle main slider changes
 * @param {Function} props.handleDetailChange - Function to handle detail changes
 * @param {Function} props.toggleExpanded - Function to toggle expanded view
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
  handleMainSliderChange, 
  handleDetailChange, 
  toggleExpanded 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      
      <ExpandableSection 
        title="Payment Details"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      >
        <Slider 
          label="Target Mortgage Payment"
          value={targetPaymentDetails.targetMortgage}
          min={0}
          max={8000}
          step={100}
          onChange={(e) => handleDetailChange?.('targetPayment', 'targetMortgage', e.target.value)}
        />
        
        <Slider 
          label="Target Property Tax"
          value={targetPaymentDetails.targetPropertyTax}
          min={0}
          max={1000}
          step={50}
          onChange={(e) => handleDetailChange?.('targetPayment', 'targetPropertyTax', e.target.value)}
        />
        
        <Slider 
          label="Target Insurance"
          value={targetPaymentDetails.targetInsurance}
          min={0}
          max={500}
          step={25}
          onChange={(e) => handleDetailChange?.('targetPayment', 'targetInsurance', e.target.value)}
        />
        
        <Slider 
          label="Target HOA"
          value={targetPaymentDetails.targetHOA}
          min={0}
          max={500}
          step={25}
          onChange={(e) => handleDetailChange?.('targetPayment', 'targetHOA', e.target.value)}
        />
      </ExpandableSection>
    </div>
  );
};

export default TargetPaymentSection; 