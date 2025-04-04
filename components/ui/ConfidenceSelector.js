import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';

/**
 * Reusable confidence selector component
 * @param {Object} props - Component properties
 * @param {Object} props.confidenceLevels - Object containing confidence levels
 * @param {string} props.activeLevel - Currently active confidence level
 * @param {Function} props.onChange - Callback function when confidence level changes
 * @returns {JSX.Element} - Confidence selector component
 */
const ConfidenceSelector = ({ confidenceLevels, activeLevel, onChange }) => {
  return (
    <div className={styles.confidenceSelector}>
      <span className={styles.confidenceLabel}>Confidence?</span>
      <div className={styles.confidenceButtons}>
        {Object.keys(confidenceLevels).map(level => (
          <button
            key={level}
            className={`${styles.confidenceButton} ${activeLevel === level ? styles.active : ''}`}
            onClick={() => onChange(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfidenceSelector; 