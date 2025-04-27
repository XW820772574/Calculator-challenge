
import { createConnectTransport } from "@connectrpc/connect-web";

// 操作枚举
export enum Operation {
  ADD = 0,
  SUBTRACT = 1,
  MULTIPLY = 2,
  DIVIDE = 3,
}

// 操作符号映射
export const operationSymbols: Record<Operation, string> = {
  [Operation.ADD]: "+",
  [Operation.SUBTRACT]: "-",
  [Operation.MULTIPLY]: "×",
  [Operation.DIVIDE]: "÷",
};

// 请求接口
export interface CalculateRequest {
  num1: number;
  num2: number;
  operation: Operation;
}

// 响应接口
export interface CalculateResponse {
  result: number;
  error: string;
}

// 计算器服务客户端接口
export interface CalculatorServiceClient {
  calculate: (request: CalculateRequest) => Promise<CalculateResponse>;
}

// 创建传输层
const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

// 创建客户端函数
export function createCalculatorClient(): CalculatorServiceClient {
  return {
    calculate: async (request: CalculateRequest): Promise<CalculateResponse> => {
      try {
        const response = await fetch("http://localhost:8080/calculator.CalculatorService/Calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            num1: request.num1,
            num2: request.num2,
            operation: request.operation,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return {
          result: data.result || 0,
          error: data.error || "",
        };
      } catch (error) {
        console.error("计算请求错误:", error);
        return {
          result: 0,
          error: error instanceof Error ? error.message : "未知错误",
        };
      }
    },
  };
} 