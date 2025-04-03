import { useEffect, useState } from 'react';
import styles from '../styles/FloatingDashboard.module.css';

export default function FloatingDashboard({ formData, previousData }) {
  const [tableData, setTableData] = useState([]);
  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    // Generate a simplified version of the comparison table
    const generateTableData = () => {
      const salePrice = formData.salePrice || previousData.salePrice || 500000;
      const buyPrice = formData.purchasePrice || previousData.purchasePrice || 600000;
      
      // Generate 3x3 grid centered around current values
      const salePrices = [
        salePrice - 50000,
        salePrice,
        salePrice + 50000
      ];
      
      const buyPrices = [
        buyPrice - 50000,
        buyPrice,
        buyPrice + 50000
      ];

      const data = salePrices.map(salePrice => {
        return buyPrices.map(buyPrice => {
          // Calculate net proceeds
          const commission = salePrice * (previousData.commissionRate / 100);
          const netProceeds = salePrice - commission - previousData.closingCosts - 
                            previousData.repairs - previousData.otherCosts;
          
          // Calculate net at closing
          const netAtClosing = netProceeds - previousData.firstMortgage - 
                             previousData.secondMortgage - previousData.heloc - 
                             previousData.otherPayments;
          
          // Calculate loan amount
          const loanAmount = buyPrice - netAtClosing;
          
          // Calculate monthly mortgage (simplified)
          const monthlyRate = 6.5 / 100 / 12;
          const numberOfPayments = 30 * 12;
          const monthlyMortgage = loanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
          
          // Calculate total monthly payment
          const monthlyPropertyTax = (buyPrice * 1.5 / 100) / 12;
          const monthlyInsurance = 2000 / 12;
          const totalMonthlyPayment = monthlyMortgage + monthlyPropertyTax + monthlyInsurance;

          return totalMonthlyPayment;
        });
      });

      setTableData(data);

      // Generate histogram data
      const allPayments = data.flat();
      const min = Math.min(...allPayments);
      const max = Math.max(...allPayments);
      const range = max - min;
      const binCount = 5;
      const binSize = range / binCount;
      
      const histogram = Array(binCount).fill(0);
      allPayments.forEach(payment => {
        const binIndex = Math.min(Math.floor((payment - min) / binSize), binCount - 1);
        histogram[binIndex]++;
      });

      setHistogramData(histogram);
    };

    generateTableData();
  }, [formData, previousData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.tableThumbnail}>
        <div className={styles.tableLabel}>Monthly Payment Preview</div>
        <div className={styles.tableContainer}>
          <table>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  {row.map((payment, j) => (
                    <td 
                      key={j}
                      className={payment > 3000 ? styles.warning : styles.sufficient}
                    >
                      {formatCurrency(payment)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.histogram}>
        <div className={styles.histogramLabel}>Payment Distribution</div>
        <div className={styles.histogramBars}>
          {histogramData.map((count, i) => (
            <div key={i} className={styles.barContainer}>
              <div 
                className={styles.bar}
                style={{ 
                  height: `${(count / Math.max(...histogramData)) * 100}%`,
                  backgroundColor: i < 3 ? '#4CAF50' : '#FFA726'
                }}
              />
              <div className={styles.barLabel}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 