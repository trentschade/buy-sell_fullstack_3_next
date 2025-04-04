import React from 'react';
import { render, screen, within } from '@testing-library/react';
import MonthlyPaymentMatrix from '../MonthlyPaymentMatrix';
import { formatCurrency } from '../../../utils/formatters';

describe('MonthlyPaymentMatrix', () => {
  const defaultProps = {
    tableData: [
      [
        {
          purchasePrice: 550000,
          downPayment: 20,
          totalMonthlyPayment: 3000
        }
      ],
      [
        {
          purchasePrice: 575000,
          downPayment: 20,
          totalMonthlyPayment: 3500
        }
      ],
      [
        {
          purchasePrice: 550000,
          downPayment: 30,
          totalMonthlyPayment: 2500
        }
      ],
      [
        {
          purchasePrice: 575000,
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
    
    const table = screen.getByRole('table');
    const columnHeaders = within(table).getAllByRole('columnheader');
    expect(columnHeaders[0]).toHaveTextContent('Down Payment %');
    expect(columnHeaders[1]).toHaveTextContent('$525,000');
    expect(columnHeaders[2]).toHaveTextContent('$550,000');
    expect(columnHeaders[3]).toHaveTextContent('$575,000');
    expect(columnHeaders[4]).toHaveTextContent('$600,000');
    
    const rows = within(table).getAllByRole('row');
    const twentyPercentRow = rows[4]; // 20% is at index 4 (after 5%, 10%, 15%)
    const thirtyPercentRow = rows[6]; // 30% is at index 6
    
    expect(within(twentyPercentRow).getByRole('rowheader')).toHaveTextContent('20%');
    expect(within(thirtyPercentRow).getByRole('rowheader')).toHaveTextContent('30%');
  });

  it('should render payment values with correct formatting', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    
    // Find rows with 20% and 30% down payment
    const twentyPercentRow = rows[4]; // 20% is at index 4 (after 5%, 10%, 15%)
    const thirtyPercentRow = rows[6]; // 30% is at index 6
    
    // Check payment values in the 20% down payment row
    const twentyPercentCells = within(twentyPercentRow).getAllByRole('cell');
    expect(twentyPercentCells[1]).toHaveTextContent('$3,000'); // For $550,000
    expect(twentyPercentCells[2]).toHaveTextContent('$3,500'); // For $575,000
    
    // Check payment values in the 30% down payment row
    const thirtyPercentCells = within(thirtyPercentRow).getAllByRole('cell');
    expect(thirtyPercentCells[1]).toHaveTextContent('$2,500'); // For $550,000
  });

  it('should apply correct CSS classes based on payment values', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    
    // Find rows with 20% and 30% down payment
    const twentyPercentRow = rows[4]; // 20% is at index 4
    const thirtyPercentRow = rows[6]; // 30% is at index 6
    
    // Check cells in the 20% down payment row
    const twentyPercentCells = within(twentyPercentRow).getAllByRole('cell');
    expect(twentyPercentCells[1]).toHaveClass('sufficient'); // $3,000
    expect(twentyPercentCells[2]).toHaveClass('insufficient'); // $3,500
    
    // Check cells in the 30% down payment row
    const thirtyPercentCells = within(thirtyPercentRow).getAllByRole('cell');
    expect(thirtyPercentCells[1]).toHaveClass('sufficient'); // $2,500
  });

  it('should render the legend', () => {
    render(<MonthlyPaymentMatrix {...defaultProps} />);
    
    const legend = screen.getByRole('complementary', { name: /matrix legend/i });
    expect(within(legend).getByText('Within Target')).toBeInTheDocument();
    expect(within(legend).getByText('Within 10% of Target')).toBeInTheDocument();
    expect(within(legend).getByText('Exceeds Target by >10%')).toBeInTheDocument();
  });
}); 