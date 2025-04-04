import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';

/**
 * Reusable expandable section component
 * @param {Object} props - Component properties
 * @param {string} props.title - Title of the section
 * @param {boolean} props.isExpanded - Whether the section is expanded
 * @param {Function} props.onToggle - Callback function when the section is toggled
 * @param {React.ReactNode} props.children - Child components to render when expanded
 * @returns {JSX.Element} - Expandable section component
 */
const ExpandableSection = ({ title, isExpanded, onToggle, children }) => {
  return (
    <div className={styles.expandableSection}>
      <button 
        className={styles.expandButton}
        onClick={onToggle}
      >
        {isExpanded ? '−' : '+'} {title}
      </button>
      
      {isExpanded && (
        <div className={styles.detailedSection}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection; 