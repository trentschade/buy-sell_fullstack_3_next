import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

/**
 * Reusable slider component
 * @param {Object} props - Component properties
 * @param {string} props.label - Label for the slider
 * @param {number} props.value - Current value of the slider
 * @param {number} props.min - Minimum value of the slider
 * @param {number} props.max - Maximum value of the slider
 * @param {number} props.step - Step size of the slider
 * @param {Function} props.onChange - Callback function when slider value changes
 * @param {string} props.format - Format type ('currency' or 'percentage')
 * @param {boolean} props.disabled - Whether the slider is disabled
 * @param {string} props.infoText - Optional info text to display below the slider
 * @returns {JSX.Element} - Slider component
 */
const Slider = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  format = 'currency', 
  disabled = false,
  infoText
}) => {
  // Format the value based on the format type
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percentage' 
      ? formatPercentage(value) 
      : value;

  return (
    <div className={styles.sliderGroup}>
      <label>
        <span>{label}</span>
        <span>{formattedValue}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={styles.slider}
        disabled={disabled}
      />
      {infoText && (
        <div className={styles.infoText}>
          {infoText}
        </div>
      )}
    </div>
  );
};

export default Slider; 