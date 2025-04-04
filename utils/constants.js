/**
 * Default confidence levels for price ranges
 */
export const CONFIDENCE_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

/**
 * Default values for the calculator
 */
export const DEFAULT_VALUES = {
  SALE_PRICE: 500000,
  PAYOFF_AMOUNT: 300000,
  PURCHASE_PRICE: 600000,
  TARGET_PAYMENT: 3000,
  DOWN_PAYMENT: 20,
  INTEREST_RATE: 6.5,
  LOAN_TERM: 30,
  PROPERTY_TAX_RATE: 1.1,
  HOA_COST: 300,
  INSURANCE_COST: 1200
};

/**
 * Slider ranges for different inputs
 */
export const SLIDER_RANGES = {
  SALE_PRICE: {
    min: 100000,
    max: 2000000,
    step: 10000
  },
  PAYOFF_AMOUNT: {
    min: 0,
    max: 1000000,
    step: 10000
  },
  PURCHASE_PRICE: {
    min: 100000,
    max: 2000000,
    step: 10000
  },
  TARGET_PAYMENT: {
    min: 0,
    max: 10000,
    step: 100
  },
  DOWN_PAYMENT: {
    min: 0,
    max: 50,
    step: 1
  },
  INTEREST_RATE: {
    min: 0,
    max: 15,
    step: 0.125
  },
  LOAN_TERM: {
    min: 5,
    max: 30,
    step: 5
  },
  PROPERTY_TAX_RATE: {
    min: 0,
    max: 3,
    step: 0.1
  },
  HOA_COST: {
    min: 0,
    max: 1000,
    step: 50
  },
  INSURANCE_COST: {
    min: 0,
    max: 5000,
    step: 100
  }
};

/**
 * Default down payment percentages for the payment matrix
 */
export const DEFAULT_DOWN_PAYMENTS = [5, 10, 15, 20, 25, 30];

/**
 * Default purchase prices for the payment matrix
 */
export const DEFAULT_PURCHASE_PRICES = [
  400000, 500000, 600000, 700000, 800000, 900000, 1000000
];

/**
 * Color classes for payment status
 */
export const PAYMENT_STATUS = {
  SUFFICIENT: 'sufficient',
  WARNING: 'warning',
  INSUFFICIENT: 'insufficient'
};

/**
 * Warning threshold for monthly payment (percentage above target)
 */
export const PAYMENT_WARNING_THRESHOLD = 10; // 10% above target 

/**
 * Confidence levels for price ranges
 * Each level represents the percentage range (±) around the target price
 */
export const confidenceLevels = {
  'Certain': 0.01,    // ±1%
  'Confident': 0.10,  // ±10%
  'Likely': 0.15,     // ±15%
  'Possible': 0.25,   // ±25%
  'No Idea': 0.50     // ±50%
}; 