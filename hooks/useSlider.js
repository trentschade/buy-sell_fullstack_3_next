import { useState } from 'react';

/**
 * Custom hook for slider functionality
 * @param {Object} props - Slider properties
 * @param {number} props.initialValue - Initial value of the slider
 * @param {number} props.min - Minimum value of the slider
 * @param {number} props.max - Maximum value of the slider
 * @param {number} props.step - Step size of the slider
 * @param {Function} props.onChange - Callback function when slider value changes
 * @returns {Object} - Slider state and handlers
 */
export const useSlider = ({ 
  initialValue, 
  min, 
  max, 
  step, 
  onChange 
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return {
    value,
    handleChange,
    min,
    max,
    step
  };
}; 