import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../useCalculator';

describe('useCalculator', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.mainSliders.sale.value).toBe(500000);
    expect(result.current.mainSliders.payoff.value).toBe(300000);
    expect(result.current.mainSliders.purchase.value).toBe(600000);
    expect(result.current.targetMonthlyPayment).toBe(3000);
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
}); 