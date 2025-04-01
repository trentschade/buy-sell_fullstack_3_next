import { useState, useEffect } from 'react';
import styles from '../styles/AmortizationTable.module.css';

export default function AmortizationTable({ loanAmount, interestRate, loanTerm }) {
  const [schedule, setSchedule] = useState(null);
  const [summary, setSummary] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detailed'

  const fetchSchedule = async (page) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/amortization-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount,
          interestRate,
          loanTerm,
          page,
          pageSize: 12
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch amortization schedule');
      }

      setSchedule(data.schedule);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      fetchSchedule(currentPage);
    }
  }, [loanAmount, interestRate, loanTerm, currentPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className={styles.loading}>Loading amortization schedule...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!schedule || !summary) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          className={`${styles.viewToggle} ${viewMode === 'summary' ? styles.active : ''}`}
          onClick={() => setViewMode('summary')}
        >
          Summary View
        </button>
        <button
          className={`${styles.viewToggle} ${viewMode === 'detailed' ? styles.active : ''}`}
          onClick={() => setViewMode('detailed')}
        >
          Detailed View
        </button>
      </div>

      {viewMode === 'summary' ? (
        <div className={styles.summary}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total Months</span>
              <span className={styles.value}>{summary.totalMonths}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Monthly Payment</span>
              <span className={styles.value}>{formatCurrency(summary.monthlyPayment)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total Payment</span>
              <span className={styles.value}>{formatCurrency(summary.totalPayment)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total Interest</span>
              <span className={styles.value}>{formatCurrency(summary.totalInterest)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total Principal</span>
              <span className={styles.value}>{formatCurrency(summary.totalPrincipal)}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{formatCurrency(row.payment)}</td>
                    <td>{formatCurrency(row.principal)}</td>
                    <td>{formatCurrency(row.interest)}</td>
                    <td>{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {summary.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === summary.totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
} 