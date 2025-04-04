import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency } from '../../utils/formatters';

/**
 * Monthly payment matrix component that displays a grid of monthly payments
 * based on different sale prices and purchase prices
 * @param {Object} props - Component properties
 * @param {Array} props.tableData - 2D array of calculation results
 * @param {Object} props.tableConfig - Configuration for the table
 * @param {number} props.targetMonthlyPayment - Target monthly payment amount
 * @param {Object} props.mainSliders - Object containing current slider values
 * @returns {JSX.Element} - Monthly payment matrix component
 */
const MonthlyPaymentMatrix = ({ 
  tableData = [], 
  tableConfig = { saleRange: 6, purchaseRange: 6 },
  targetMonthlyPayment = 3000,
  mainSliders = { sale: { value: 500000 }, purchase: { value: 600000 } }
}) => {
  /**
   * Get the CSS class for a cell based on the monthly payment value
   * @param {number} value - The monthly payment value
   * @returns {string} - CSS class name
   */
  const getCellClass = (value) => {
    if (value <= targetMonthlyPayment) {
      return styles.sufficient;
    } else if (value <= targetMonthlyPayment * 1.1) {
      return styles.warning;
    }
    return styles.insufficient;
  };

  // Generate arrays for row and column headers
  const saleRange = tableConfig.saleRange || 6;
  const purchaseRange = tableConfig.purchaseRange || 6;
  const saleStep = tableConfig.saleStep || 25000;
  const purchaseStep = tableConfig.purchaseStep || 25000;

  // Generate purchase prices for columns using current purchase price as base
  const purchasePrices = Array.from({ length: purchaseRange }, (_, i) => {
    const middleIndex = Math.floor(purchaseRange / 2);
    const offset = (i - middleIndex) * purchaseStep;
    return mainSliders.purchase.value + offset;
  });

  // Generate sale prices for rows using current sale price as base
  const salePrices = Array.from({ length: saleRange }, (_, i) => {
    const middleIndex = Math.floor(saleRange / 2);
    const offset = (i - middleIndex) * saleStep;
    return mainSliders.sale.value + offset;
  });

  return (
    <div className={styles.matrixSection}>
      <h2>Monthly Payment Matrix</h2>
      <div className={styles.matrixContainer} role="table" aria-label="Monthly Payment Matrix">
        <div className={styles.matrixHeader} role="row">
          <div className={styles.headerCell} role="columnheader">Sale Price</div>
          {purchasePrices.map((price) => (
            <div key={price} className={styles.headerCell} role="columnheader">
              {formatCurrency(price)}
            </div>
          ))}
        </div>
        
        {salePrices.map((salePrice, saleIndex) => (
          <div key={salePrice} className={styles.matrixRow} role="row">
            <div className={styles.rowHeader} role="rowheader">{formatCurrency(salePrice)}</div>
            {purchasePrices.map((purchasePrice, purchaseIndex) => {
              const key = `${salePrice}-${purchasePrice}`;
              // Access the calculation directly using indices
              const calculation = tableData[saleIndex]?.[purchaseIndex] || { totalMonthlyPayment: 0 };
              
              return (
                <div 
                  key={key} 
                  className={`${styles.matrixCell} ${getCellClass(calculation.totalMonthlyPayment)}`}
                  role="cell"
                >
                  {formatCurrency(calculation.totalMonthlyPayment)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className={styles.legend} role="complementary" aria-label="Matrix Legend">
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.sufficient}`} role="presentation"></div>
          <span>Within Target</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.warning}`} role="presentation"></div>
          <span>Within 10% of Target</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.insufficient}`} role="presentation"></div>
          <span>Exceeds Target by {'>'}10%</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPaymentMatrix; 