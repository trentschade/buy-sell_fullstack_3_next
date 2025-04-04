import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../useCalculator';

describe('useCalculator', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.mainSliders.sale.value).toBe(500000);
    expect(result.current.mainSliders.sale.confidence).toBe('Likely');
    expect(result.current.mainSliders.payoff.value).toBe(300000);
    expect(result.current.mainSliders.purchase.value).toBe(600000);
    expect(result.current.targetMonthlyPayment).toBe(3000);
    expect(result.current.saleDetails.agentCommission).toBe(6);
    expect(result.current.purchaseDetails.downPayment).toBe(20);
  });

  it('should update sale price when handleMainSliderChange is called', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleMainSliderChange('sale', '550000');
    });

    expect(result.current.mainSliders.sale.value).toBe(550000);
  });

  it('should update confidence level when handleConfidenceChange is called', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleConfidenceChange('sale', 'Confident');
    });

    expect(result.current.mainSliders.sale.confidence).toBe('Confident');
  });

  it('should update sale details when handleDetailChange is called', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleDetailChange('sale', 'agentCommission', '7');
    });

    expect(result.current.saleDetails.agentCommission).toBe(7);
  });

  it('should update payoff details and main slider when handleDetailChange is called for payoff', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleDetailChange('payoff', 'firstMortgage', '350000');
    });

    expect(result.current.payoffDetails.firstMortgage).toBe(350000);
    expect(result.current.mainSliders.payoff.value).toBe(350000);
  });

  it('should toggle expanded state when toggleExpanded is called', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.toggleExpanded('sale');
    });

    expect(result.current.mainSliders.sale.expanded).toBe(true);

    act(() => {
      result.current.toggleExpanded('sale');
    });

    expect(result.current.mainSliders.sale.expanded).toBe(false);
  });

  it('should update target monthly payment when handleTargetPaymentChange is called', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleTargetPaymentChange({ target: { value: '3500' } });
    });

    expect(result.current.targetMonthlyPayment).toBe(3500);
  });

  it('should calculate results when initialized', () => {
    const { result } = renderHook(() => useCalculator());

    // Verify that tableData is a 2D array with the expected dimensions
    expect(Array.isArray(result.current.results.tableData)).toBe(true);
    expect(result.current.results.tableData.length).toBeGreaterThan(0);
    expect(Array.isArray(result.current.results.tableData[0])).toBe(true);
    expect(result.current.results.tableData[0].length).toBeGreaterThan(0);

    // Verify that each cell in the table has the expected properties
    const firstCell = result.current.results.tableData[0][0];
    expect(firstCell).toEqual(expect.objectContaining({
      netProceeds: expect.any(Number),
      netAtClosing: expect.any(Number),
      loanAmount: expect.any(Number),
      monthlyMortgage: expect.any(Number),
      monthlyPropertyTax: expect.any(Number),
      monthlyInsurance: expect.any(Number),
      monthlyHOA: expect.any(Number),
      totalMonthlyPayment: expect.any(Number),
      purchasePrice: expect.any(Number),
      salePrice: expect.any(Number)
    }));
  });
}); 