import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency } from '../../utils/formatters';
import Slider from '../ui/Slider';
import ConfidenceSelector from '../ui/ConfidenceSelector';
import ExpandableSection from '../ui/ExpandableSection';

/**
 * Purchase section component for the purchase price section
 * @param {Object} props - Component properties
 * @param {Object} props.mainSliders - Object containing main slider values
 * @param {Object} props.purchaseDetails - Object containing purchase details
 * @param {Object} props.confidenceLevels - Object containing confidence levels
 * @param {Function} props.onMainSliderChange - Function to handle main slider changes
 * @param {Function} props.onConfidenceChange - Function to handle confidence level changes
 * @param {Function} props.onDetailChange - Function to handle detail changes
 * @param {Function} props.onToggleExpanded - Function to toggle expanded view
 * @returns {JSX.Element} - Purchase section component
 */
const PurchaseSection = ({ 
  mainSliders, 
  purchaseDetails, 
  confidenceLevels, 
  onMainSliderChange, 
  onConfidenceChange, 
  onDetailChange, 
  onToggleExpanded 
}) => {
  return (
    <div className={styles.sliderSection}>
      <div className={styles.sliderGroup}>
        <div className={styles.sliderLabel}>
          <span>Purchase Price</span>
          <span className={styles.sliderValue}>{formatCurrency(mainSliders.purchase.value)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2000000"
          step="10000"
          value={mainSliders.purchase.value}
          onChange={(e) => onMainSliderChange('purchase', Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      
      <ConfidenceSelector 
        confidenceLevels={confidenceLevels}
        activeLevel={mainSliders.purchase.confidence}
        onChange={(level) => onConfidenceChange('purchase', level)}
      />
      
      <ExpandableSection 
        title="Purchase Details"
        isExpanded={mainSliders.purchase.expanded}
        onToggle={() => onToggleExpanded('purchase')}
      >
        <Slider 
          label="Down Payment"
          value={purchaseDetails.downPayment}
          min={0}
          max={50}
          step={1}
          format="percentage"
          onChange={(e) => onDetailChange('purchase', 'downPayment', e.target.value)}
        />
        
        <Slider 
          label="Interest Rate"
          value={purchaseDetails.interestRate}
          min={0}
          max={15}
          step={0.125}
          format="percentage"
          onChange={(e) => onDetailChange('purchase', 'interestRate', e.target.value)}
        />
        
        <Slider 
          label="Loan Term (Years)"
          value={purchaseDetails.loanTerm}
          min={5}
          max={30}
          step={5}
          onChange={(e) => onDetailChange('purchase', 'loanTerm', e.target.value)}
        />
        
        <Slider 
          label="Property Tax Rate"
          value={purchaseDetails.propertyTaxRate}
          min={0}
          max={3}
          step={0.1}
          format="percentage"
          onChange={(e) => onDetailChange('purchase', 'propertyTaxRate', e.target.value)}
        />
        
        <Slider 
          label="Monthly HOA"
          value={purchaseDetails.hoaCost}
          min={0}
          max={1000}
          step={50}
          onChange={(e) => onDetailChange('purchase', 'hoaCost', e.target.value)}
        />
        
        <Slider 
          label="Annual Insurance"
          value={purchaseDetails.insuranceCost}
          min={0}
          max={5000}
          step={100}
          onChange={(e) => onDetailChange('purchase', 'insuranceCost', e.target.value)}
        />
      </ExpandableSection>
    </div>
  );
};

export default PurchaseSection; 