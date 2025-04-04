import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import Slider from '../ui/Slider';
import ConfidenceSelector from '../ui/ConfidenceSelector';
import ExpandableSection from '../ui/ExpandableSection';

/**
 * Purchase section component for the purchase price section
 * @param {Object} props - Component properties
 * @param {Object} props.mainSliders - Object containing main slider values
 * @param {Object} props.purchaseDetails - Object containing purchase details
 * @param {Object} props.confidenceLevels - Object containing confidence levels
 * @param {Function} props.handleMainSliderChange - Function to handle main slider changes
 * @param {Function} props.handleConfidenceChange - Function to handle confidence level changes
 * @param {Function} props.handleDetailChange - Function to handle detail changes
 * @param {Function} props.toggleExpanded - Function to toggle expanded view
 * @returns {JSX.Element} - Purchase section component
 */
const PurchaseSection = ({ 
  mainSliders, 
  purchaseDetails, 
  confidenceLevels, 
  handleMainSliderChange, 
  handleConfidenceChange, 
  handleDetailChange, 
  toggleExpanded 
}) => {
  return (
    <div className={styles.sliderSection}>
      <h2>Purchase Price</h2>
      <Slider 
        label="Estimated Purchase Price"
        value={mainSliders.purchase.value}
        min={100000}
        max={2000000}
        step={10000}
        onChange={(e) => onMainSliderChange('purchase', e.target.value)}
      />
      
      <ConfidenceSelector 
        confidenceLevels={confidenceLevels}
        activeLevel={mainSliders.purchase.confidence}
        onChange={(level) => handleConfidenceChange('purchase', level)}
      />
      
      <ExpandableSection 
        title="Purchase Details"
        isExpanded={mainSliders.purchase.expanded}
        onToggle={() => toggleExpanded('purchase')}
      >
        <Slider 
          label="Down Payment"
          value={purchaseDetails.downPayment}
          min={0}
          max={50}
          step={1}
          format="percentage"
          onChange={(e) => handleDetailChange('purchase', 'downPayment', e.target.value)}
        />
        
        <Slider 
          label="Interest Rate"
          value={purchaseDetails.interestRate}
          min={0}
          max={15}
          step={0.125}
          format="percentage"
          onChange={(e) => handleDetailChange('purchase', 'interestRate', e.target.value)}
        />
        
        <Slider 
          label="Loan Term (Years)"
          value={purchaseDetails.loanTerm}
          min={5}
          max={30}
          step={5}
          onChange={(e) => handleDetailChange('purchase', 'loanTerm', e.target.value)}
        />
        
        <Slider 
          label="Property Tax Rate"
          value={purchaseDetails.propertyTaxRate}
          min={0}
          max={3}
          step={0.1}
          format="percentage"
          onChange={(e) => handleDetailChange('purchase', 'propertyTaxRate', e.target.value)}
        />
        
        <Slider 
          label="Monthly HOA"
          value={purchaseDetails.hoaCost}
          min={0}
          max={1000}
          step={50}
          onChange={(e) => handleDetailChange('purchase', 'hoaCost', e.target.value)}
        />
        
        <Slider 
          label="Annual Insurance"
          value={purchaseDetails.insuranceCost}
          min={0}
          max={5000}
          step={100}
          onChange={(e) => handleDetailChange('purchase', 'insuranceCost', e.target.value)}
        />
      </ExpandableSection>
    </div>
  );
};

export default PurchaseSection; 