import { useState } from 'react';
import styles from '../styles/MortgageCalculator.module.css';
import AmortizationTable from '../components/AmortizationTable';

export default function MortgageCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mortgage-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount: parseFloat(formData.loanAmount),
          interestRate: parseFloat(formData.interestRate),
          loanTerm: parseFloat(formData.loanTerm)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate mortgage');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mortgage Calculator</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="loanAmount">Loan Amount ($)</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            required
            min="0"
            step="1000"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="loanTerm">Loan Term (Years)</label>
          <input
            type="number"
            id="loanTerm"
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleChange}
            required
            min="1"
            max="50"
            step="1"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <div className={styles.result}>
          <h2>Your Mortgage Details</h2>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.label}>Monthly Payment:</span>
              <span className={styles.value}>${result.monthlyPayment.toLocaleString()}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total Payment:</span>
              <span className={styles.value}>${result.totalPayment.toLocaleString()}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.label}>Total Interest:</span>
              <span className={styles.value}>${result.totalInterest.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <AmortizationTable
          loanAmount={parseFloat(formData.loanAmount)}
          interestRate={parseFloat(formData.interestRate)}
          loanTerm={parseFloat(formData.loanTerm)}
        />
      )}
    </div>
  );
} 