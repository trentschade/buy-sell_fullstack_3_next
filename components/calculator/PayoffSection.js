import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency } from '../../utils/formatters';
import Slider from '../ui/Slider';
import ExpandableSection from '../ui/ExpandableSection';

/**
 * Payoff section component for the payoff amount section
 * @param {Object} props - Component properties
 * @param {Object} props.mainSliders - Object containing main slider values
 * @param {Object} props.payoffDetails - Object containing payoff details
 * @param {Function} props.onMainSliderChange - Function to handle main slider changes
 * @param {Function} props.onDetailChange - Function to handle detail changes
 * @param {Function} props.onToggleExpanded - Function to toggle expanded view
 * @returns {JSX.Element} - Payoff section component
 */
const PayoffSection = ({ 
  mainSliders, 
  payoffDetails, 
  onMainSliderChange, 
  onDetailChange, 
  onToggleExpanded 
}) => {
  return (
    <div className={styles.sliderSection}>
      <div className={styles.sliderGroup}>
        <div className={styles.sliderLabel}>
          <span>Payoff Amount</span>
          <span className={styles.sliderValue}>{formatCurrency(mainSliders.payoff.value)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={mainSliders.payoff.value}
          onChange={(e) => onMainSliderChange('payoff', Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      
      <ExpandableSection 
        title="Detailed Payoff"
        isExpanded={mainSliders.payoff.expanded}
        onToggle={() => onToggleExpanded('payoff')}
      >
        <Slider 
          label="First Mortgage"
          value={payoffDetails.firstMortgage}
          min={0}
          max={1000000}
          step={10000}
          onChange={(e) => onDetailChange('payoff', 'firstMortgage', e.target.value)}
        />
        
        <Slider 
          label="Second Mortgage"
          value={payoffDetails.secondMortgage}
          min={0}
          max={200000}
          step={5000}
          onChange={(e) => onDetailChange('payoff', 'secondMortgage', e.target.value)}
        />
        
        <Slider 
          label="HELOC"
          value={payoffDetails.heloc}
          min={0}
          max={200000}
          step={5000}
          onChange={(e) => onDetailChange('payoff', 'heloc', e.target.value)}
        />
        
        <Slider 
          label="Other Payments"
          value={payoffDetails.otherPayments}
          min={0}
          max={300000}
          step={10000}
          onChange={(e) => onDetailChange('payoff', 'otherPayments', e.target.value)}
        />
      </ExpandableSection>
    </div>
  );
};

export default PayoffSection; 