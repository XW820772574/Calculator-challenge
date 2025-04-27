import React, { useState } from 'react';
import { Operation, operationSymbols, createCalculatorClient } from '../proto/calculator';

// 创建计算器客户端
const calculatorClient = createCalculatorClient();

export default function Calculator() {
  // 状态管理
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<Operation>(Operation.ADD);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // 处理计算操作
  const handleCalculate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setShowResult(true);

    try {
      // 验证输入
      const parsedNum1 = parseFloat(num1);
      const parsedNum2 = parseFloat(num2);

      if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
        setError('请输入有效的数字');
        return;
      }

      // 发送请求
      const response = await calculatorClient.calculate({
        num1: parsedNum1,
        num2: parsedNum2,
        operation,
      });

      // 处理响应
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 清除表单
  const handleClear = () => {
    setNum1('');
    setNum2('');
    setOperation(Operation.ADD);
    setResult(null);
    setError('');
    setShowResult(false);
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-xl shadow-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          计算器
        </h1>
        
        <div className="space-y-6">
          {/* 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="num1">
                第一个数
              </label>
              <input
                id="num1"
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="输入第一个数"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="num2">
                第二个数
              </label>
              <input
                id="num2"
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="输入第二个数"
              />
            </div>
          </div>
          
          {/* 运算符选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              运算符
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(Operation).filter(op => !isNaN(Number(op))).map((op) => (
                <button
                  key={op}
                  onClick={() => setOperation(op as Operation)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    operation === op
                      ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {operationSymbols[op as Operation]}
                </button>
              ))}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleClear}
              className="py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              清除
            </button>
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 focus:ring-2 focus:ring-indigo-300 disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  计算中...
                </span>
              ) : '计算'}
            </button>
          </div>
        </div>
        
        {/* 结果展示区域 */}
        {showResult && (
          <div className={`mt-6 p-4 rounded-lg transition-all duration-300 ease-in-out ${
            error ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 
            result !== null ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : ''
          }`}>
            {error ? (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            ) : result !== null ? (
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">计算表达式:</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {num1} {operationSymbols[operation]} {num2}
                  </p>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">=</span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}