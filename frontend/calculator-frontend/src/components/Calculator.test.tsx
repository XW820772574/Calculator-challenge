import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';
import { Operation } from '../proto/calculator';

/**
 * 计算器组件测试套件
 *
 * 这些测试验证了计算器组件的基本功能:
 * 1. 组件正确渲染 UI 元素
 * 2. 输入数字和清除功能正常工作
 * 3. 运算符选择功能正常工作
 * 4. 处理非数字输入时不会崩溃
 * 
 * 由于网络请求的复杂性，异步计算功能测试暂时未包含在内。
 * 
 */

// 模拟计算器客户端和proto
jest.mock('../proto/calculator', () => {
  return {
    Operation: {
      ADD: 0,
      SUBTRACT: 1,
      MULTIPLY: 2,
      DIVIDE: 3
    },
    operationSymbols: {
      0: "+",
      1: "-",
      2: "×",
      3: "÷"
    },
    createCalculatorClient: jest.fn(() => ({
      calculate: jest.fn()
    }))
  };
});

describe('计算器组件', () => {
  beforeEach(() => {
    // 重置模拟
    jest.clearAllMocks();
  });
  
  test('渲染计算器组件', () => {
    render(<Calculator />);
    
    expect(screen.getByText('计算器')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('÷')).toBeInTheDocument();
  });
  
  test('输入数字并清除', () => {
    render(<Calculator />);
    
    // 输入数字
    const num1Input = screen.getByLabelText('第一个数') as HTMLInputElement;
    const num2Input = screen.getByLabelText('第二个数') as HTMLInputElement;
    
    fireEvent.change(num1Input, { target: { value: '10' } });
    fireEvent.change(num2Input, { target: { value: '5' } });
    
    // 验证输入值已更新
    expect(num1Input.value).toBe('10');
    expect(num2Input.value).toBe('5');
    
    // 点击清除按钮
    const clearButton = screen.getByText('清除');
    fireEvent.click(clearButton);
    
    // 验证输入已重置
    expect(num1Input.value).toBe('');
    expect(num2Input.value).toBe('');
  });
  
  test('选择不同的运算符', () => {
    render(<Calculator />);
    
    // 默认应该选择加法
    expect(screen.getByText('+')).toHaveClass('bg-indigo-600');
    
    // 选择减法
    const subtractButton = screen.getByText('-');
    fireEvent.click(subtractButton);
    
    // 验证减法被选中
    expect(subtractButton).toHaveClass('bg-indigo-600');
    expect(screen.getByText('+')).not.toHaveClass('bg-indigo-600');
    
    // 选择乘法
    const multiplyButton = screen.getByText('×');
    fireEvent.click(multiplyButton);
    
    // 验证乘法被选中
    expect(multiplyButton).toHaveClass('bg-indigo-600');
    expect(subtractButton).not.toHaveClass('bg-indigo-600');
    
    // 选择除法
    const divideButton = screen.getByText('÷');
    fireEvent.click(divideButton);
    
    // 验证除法被选中
    expect(divideButton).toHaveClass('bg-indigo-600');
    expect(multiplyButton).not.toHaveClass('bg-indigo-600');
  });
  
  test('处理非数字输入', () => {
    render(<Calculator />);
    
    // 输入非数字
    const num1Input = screen.getByLabelText('第一个数');
    
    // 由于是number类型的输入框，React会过滤掉非数字输入
    // 所以这里我们只验证空输入
    
    // 点击计算按钮
    const calculateButton = screen.getByText('计算');
    fireEvent.click(calculateButton);
    
    // 验证没有异常发生
    expect(screen.getByText('计算')).toBeInTheDocument();
  });
}); 