import React, { useState } from 'react';
import Head from 'next/head';
import { useCalculator } from '../hooks/useCalculator';
import SaleSection from '../components/calculator/SaleSection';
import PayoffSection from '../components/calculator/PayoffSection';
import PurchaseSection from '../components/calculator/PurchaseSection';
import TargetPaymentSection from '../components/calculator/TargetPaymentSection';
import MonthlyPaymentMatrix from '../components/calculator/MonthlyPaymentMatrix';
import ResultsSection from '../components/calculator/ResultsSection';
import styles from '../styles/UnifiedCalculator.module.css';

/**
 * UnifiedCalculator component
 * Main component that integrates all calculator functionality
 */
const UnifiedCalculator = () => {
  const [showInputs, setShowInputs] = useState(true);
  const [showResults, setShowResults] = useState(false);
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
        <h1>Buy-Sell Calculator</h1>
        <p>Clarify the interaction between the sale and purchase of two properties.</p>
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

      <div className={styles.resultsContainer}>
        <div className={styles.sectionHeader}>
          <h2>Current Scenario Results</h2>
          <button 
            onClick={() => setShowResults(!showResults)}
            className={styles.toggleButton}
          >
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
        </div>

        {showResults && (
          <ResultsSection
            results={results}
            targetMonthlyPayment={targetMonthlyPayment}
          />
        )}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h2>Current Scenario Details</h2>
          <button 
            onClick={() => setShowInputs(!showInputs)}
            className={styles.toggleButton}
          >
            {showInputs ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showInputs && (
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
        )}
      </div>
    </div>
  );
};

export default UnifiedCalculator; 