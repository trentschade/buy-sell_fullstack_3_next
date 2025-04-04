import React from 'react';
import Head from 'next/head';
import { useCalculator } from '../hooks/useCalculator';
import SaleSection from '../components/calculator/SaleSection';
import PayoffSection from '../components/calculator/PayoffSection';
import PurchaseSection from '../components/calculator/PurchaseSection';
import TargetPaymentSection from '../components/calculator/TargetPaymentSection';
import MonthlyPaymentMatrix from '../components/calculator/MonthlyPaymentMatrix';
import FloatingDashboard from '../components/calculator/FloatingDashboard';
import ResultsSection from '../components/calculator/ResultsSection';
import { formatCurrency } from '../utils/formatters';
import styles from '../styles/OriginalUnifiedCalculator.module.css';

/**
 * UnifiedCalculator component
 * Main component that integrates all calculator functionality
 */
const UnifiedCalculator = () => {
  const {
    mainSliders,
    targetMonthlyPayment,
    saleDetails,
    payoffDetails,
    purchaseDetails,
    confidenceLevels,
    tableConfig,
    results,
    toggleExpanded,
    handleMainSliderChange,
    handleConfidenceChange,
    handleDetailChange,
    handleTargetPaymentChange
  } = useCalculator();

  return (
    <div className={styles.container}>
      <Head>
        <title>Buy-Sell Calculator</title>
        <meta name="description" content="Comprehensive real estate calculator for buying and selling properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Buy-Sell Calculator</h1>
        <p className={styles.description}>
          Calculate your net proceeds, loan amount, and monthly payments for buying and selling properties.
        </p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.calculatorSection}>
          <SaleSection
            mainSliders={mainSliders}
            saleDetails={saleDetails}
            confidenceLevels={Object.keys(confidenceLevels)}
            onMainSliderChange={handleMainSliderChange}
            onConfidenceChange={handleConfidenceChange}
            onDetailChange={handleDetailChange}
            onToggleExpanded={toggleExpanded}
          />

          <PayoffSection
            mainSliders={mainSliders}
            payoffDetails={payoffDetails}
            onMainSliderChange={handleMainSliderChange}
            onDetailChange={handleDetailChange}
            onToggleExpanded={toggleExpanded}
          />

          <PurchaseSection
            mainSliders={mainSliders}
            purchaseDetails={purchaseDetails}
            confidenceLevels={Object.keys(confidenceLevels)}
            onMainSliderChange={handleMainSliderChange}
            onConfidenceChange={handleConfidenceChange}
            onDetailChange={handleDetailChange}
            onToggleExpanded={toggleExpanded}
          />

          <TargetPaymentSection
            targetMonthlyPayment={targetMonthlyPayment}
            onTargetPaymentChange={handleTargetPaymentChange}
          />

        </div>
        <div>
          <MonthlyPaymentMatrix
              tableData={results.tableData}
              tableConfig={tableConfig}
              targetMonthlyPayment={targetMonthlyPayment}
            />
        </div>

        <div className={styles.resultsSection}>
          <FloatingDashboard
            results={results}
            targetMonthlyPayment={targetMonthlyPayment}
          />
          
          <ResultsSection
            results={results}
            targetMonthlyPayment={targetMonthlyPayment}
          />
        </div>
      </div>
    </div>
  );
};

export default UnifiedCalculator; 