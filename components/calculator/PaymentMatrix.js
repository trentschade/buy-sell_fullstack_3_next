import React from 'react';
import styles from '../../styles/UnifiedCalculator.module.css';
import { formatCurrency } from '../../utils/formatters';

/**
 * Payment matrix component for displaying monthly payment data
 * @param {Object} props - Component properties
 * @param {Array} props.tableData - 2D array of payment data
 * @param {Object} props.tableConfig - Configuration for the table
 * @param {number} props.targetMonthlyPayment - Target monthly payment
 * @returns {JSX.Element} - Payment matrix component
 */
const PaymentMatrix = ({ tableData, tableConfig, targetMonthlyPayment }) => {
  // Get cell class based on monthly payment
  const getCellClass = (payment) => {
    if (payment > targetMonthlyPayment * 1.1) return styles.insufficient;
    if (payment > targetMonthlyPayment) return styles.warning;
    return styles.sufficient;
  };

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableLabel}>Monthly Payment Matrix</div>
      <div className={styles.tableContainer}>
        <div className={styles.sideLabel}>Sale Price</div>
        <div className={styles.comparisonTable}>
          <table>
            <thead>
              <tr>
                <th>Purchase Price</th>
                {Array.from({ length: tableConfig.purchaseRange }, (_, i) => {
                  const purchasePrice = tableData[0]?.[i]?.purchasePrice || 0;
                  return (
                    <th key={i}>{formatCurrency(purchasePrice)}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: tableConfig.saleRange }, (_, i) => (
                <tr key={i}>
                  <td>{formatCurrency(tableData[i]?.[0]?.salePrice || 0)}</td>
                  {Array.from({ length: tableConfig.purchaseRange }, (_, j) => {
                    const payment = tableData[i]?.[j]?.totalMonthlyPayment || 0;
                    return (
                      <td 
                        key={j}
                        className={getCellClass(payment)}
                      >
                        {formatCurrency(payment)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.sufficient}`}></div>
          <span>Sufficient (≤ {formatCurrency(targetMonthlyPayment)})</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.warning}`}></div>
          <span>Warning (≤ {formatCurrency(targetMonthlyPayment * 1.1)})</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.insufficient}`}></div>
          <span>Insufficient (&gt; {formatCurrency(targetMonthlyPayment * 1.1)})</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMatrix; 