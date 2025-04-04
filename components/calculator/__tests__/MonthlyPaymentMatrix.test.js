import React from 'react';
import { render, screen } from '@testing-library/react';
import MonthlyPaymentMatrix from '../MonthlyPaymentMatrix';
import { formatCurrency } from '../../../utils/formatters';

describe('MonthlyPaymentMatrix', () => {
  const defaultProps = {
    tableData: [
      [
        {
          purchasePrice: 500000,
          downPayment: 20,
          totalMonthlyPayment: 3000
        },
        {
          purchasePrice: 600000,
          downPayment: 20,
          totalMonthlyPayment: 3500
        }
      ],
      [
        {
          purchasePrice: 500000,
          downPayment: 30,
          totalMonthlyPayment: 2500
        },
        {
          purchasePrice: 600000,
          downPayment: 30,
          totalMonthlyPayment: 3000
        }
      ]
    ],
    tableConfig: {
      saleRange: 6,
      purchaseRange: 6,
      saleStep: 25000,
      purchaseStep: 25000
    },
    targetMonthlyPayment: 3000
  };

  it('should render the matrix with correct headers', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    // Check column headers
    expect(screen.getByText('Down Payment %')).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(500000))).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(600000))).toBeInTheDocument();
    
    // Check row headers
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('should render payment values with correct formatting', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    expect(screen.getByText(formatCurrency(3000))).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(3500))).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(2500))).toBeInTheDocument();
  });

  it('should apply correct CSS classes based on payment values', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    // Payment equal to target should have 'sufficient' class
    const sufficientCell = screen.getByText(formatCurrency(3000));
    expect(sufficientCell.parentElement).toHaveClass('sufficient');
    
    // Payment above target should have 'insufficient' class
    const insufficientCell = screen.getByText(formatCurrency(3500));
    expect(insufficientCell.parentElement).toHaveClass('insufficient');
    
    // Payment below target should have 'sufficient' class
    const belowTargetCell = screen.getByText(formatCurrency(2500));
    expect(belowTargetCell.parentElement).toHaveClass('sufficient');
  });

  it('should render the legend', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    expect(screen.getByText('Within Target')).toBeInTheDocument();
    expect(screen.getByText('Within 10% of Target')).toBeInTheDocument();
    expect(screen.getByText('Exceeds Target by >10%')).toBeInTheDocument();
  });
}); 