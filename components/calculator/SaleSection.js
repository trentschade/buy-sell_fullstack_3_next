import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import Slider from '../ui/Slider';
import ConfidenceSelector from '../ui/ConfidenceSelector';
import ExpandableSection from '../ui/ExpandableSection';

/**
 * Sale section component for the sale price section
 * @param {Object} props - Component properties
 * @param {Object} props.mainSliders - Object containing main slider values
 * @param {Object} props.saleDetails - Object containing sale details
 * @param {Object} props.confidenceLevels - Object containing confidence levels
 * @param {Function} props.onMainSliderChange - Function to handle main slider changes
 * @param {Function} props.onConfidenceChange - Function to handle confidence level changes
 * @param {Function} props.onDetailChange - Function to handle detail changes
 * @param {Function} props.onToggleExpanded - Function to toggle expanded view
 * @returns {JSX.Element} - Sale section component
 */
const SaleSection = ({ 
  mainSliders, 
  saleDetails, 
  confidenceLevels, 
  onMainSliderChange, 
  onConfidenceChange, 
  onDetailChange, 
  onToggleExpanded 
}) => {
  return (
    <div className={styles.sliderSection}>
      <h2>Sale Price</h2>
      <Slider 
        label="Estimated Sale Price"
        value={mainSliders.sale.value}
        min={100000}
        max={2000000}
        step={10000}
        onChange={(e) => onMainSliderChange('sale', e.target.value)}
      />
      
      <ConfidenceSelector 
        confidenceLevels={confidenceLevels}
        activeLevel={mainSliders.sale.confidence}
        onChange={(level) => onConfidenceChange('sale', level)}
      />
      
      <ExpandableSection 
        title="Detailed Sale Costs"
        isExpanded={mainSliders.sale.expanded}
        onToggle={() => onToggleExpanded('sale')}
      >
        <Slider 
          label="Agent Commission"
          value={saleDetails.agentCommission}
          min={0}
          max={10}
          step={0.5}
          format="percentage"
          onChange={(e) => onDetailChange('sale', 'agentCommission', e.target.value)}
        />
        
        <Slider 
          label="Title & Escrow"
          value={saleDetails.titleAndEscrow}
          min={0}
          max={5000}
          step={100}
          onChange={(e) => onDetailChange('sale', 'titleAndEscrow', e.target.value)}
        />
        
        <Slider 
          label="Transfer Tax"
          value={saleDetails.transferTax}
          min={0}
          max={3}
          step={0.1}
          format="percentage"
          onChange={(e) => onDetailChange('sale', 'transferTax', e.target.value)}
        />
        
        <Slider 
          label="Home Warranty"
          value={saleDetails.homeWarranty}
          min={0}
          max={2000}
          step={100}
          onChange={(e) => onDetailChange('sale', 'homeWarranty', e.target.value)}
        />
        
        <Slider 
          label="Pre-Sale Repairs"
          value={saleDetails.preSaleRepairs}
          min={0}
          max={20000}
          step={500}
          onChange={(e) => onDetailChange('sale', 'preSaleRepairs', e.target.value)}
        />
        
        <Slider 
          label="Staging Costs"
          value={saleDetails.stagingCosts}
          min={0}
          max={5000}
          step={100}
          onChange={(e) => onDetailChange('sale', 'stagingCosts', e.target.value)}
        />
        
        <Slider 
          label="Professional Cleaning"
          value={saleDetails.professionalCleaning}
          min={0}
          max={2000}
          step={100}
          onChange={(e) => onDetailChange('sale', 'professionalCleaning', e.target.value)}
        />
        
        <Slider 
          label="Photography"
          value={saleDetails.photography}
          min={0}
          max={2000}
          step={100}
          onChange={(e) => onDetailChange('sale', 'photography', e.target.value)}
        />
        
        <Slider 
          label="Marketing Costs"
          value={saleDetails.marketingCosts}
          min={0}
          max={5000}
          step={100}
          onChange={(e) => onDetailChange('sale', 'marketingCosts', e.target.value)}
            />
      </ExpandableSection>
    </div>
  );
};

export default SaleSection; 