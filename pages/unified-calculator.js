import React from 'react';
import Head from 'next/head';
import { useCalculator } from '../hooks/useCalculator';
import SaleSection from '../components/calculator/SaleSection';
import PayoffSection from '../components/calculator/PayoffSection';
import PurchaseSection from '../components/calculator/PurchaseSection';
import TargetPaymentSection from '../components/calculator/TargetPaymentSection';
import MonthlyPaymentMatrix from '../components/calculator/MonthlyPaymentMatrix';
import styles from '../styles/UnifiedCalculator.module.css';

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

      <div className={styles.header}>
        <h1>Unified Calculator</h1>
        <p>Calculate your monthly payments and analyze different scenarios for selling and buying a home.</p>
      </div>

      <MonthlyPaymentMatrix
        tableData={results.tableData}
        targetMonthlyPayment={targetMonthlyPayment}
        mainSliders={mainSliders}
      />

      <TargetPaymentSection
        targetMonthlyPayment={targetMonthlyPayment}
        onTargetPaymentChange={handleTargetPaymentChange}
      />

      <div className={styles.mainContent}>
        <div className={styles.calculatorSection}>
          <SaleSection
            mainSliders={mainSliders}
            saleDetails={saleDetails}
            confidenceLevels={confidenceLevels}
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
            confidenceLevels={confidenceLevels}
            onMainSliderChange={handleMainSliderChange}
            onConfidenceChange={handleConfidenceChange}
            onDetailChange={handleDetailChange}
            onToggleExpanded={toggleExpanded}
          />
        </div>
      </div>
    </div>
  );
};

export default UnifiedCalculator; 