/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param {number} value - The number to format
 * @param {number} [decimals=1] - Number of decimal places
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format a number with commas for thousands
 * @param {number} value - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a date as a localized string
 * @param {Date|string} date - The date to format
 * @param {string} [locale='en-US'] - The locale to use
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}; 