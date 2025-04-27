package calculator

import (
	"context"
	"math"
	"testing"

	"connectrpc.com/connect"
	proto "github.com/calculator/proto"
	"github.com/stretchr/testify/assert"
)

// TestCalculate_BasicOperations 使用表驱动测试方法测试所有基本运算
func TestCalculate_BasicOperations(t *testing.T) {
	// 定义测试表
	tests := []struct {
		name      string
		num1      float64
		num2      float64
		operation proto.Operation
		expected  float64
		errorMsg  string
	}{
		{
			name:      "加法运算",
			num1:      10,
			num2:      5,
			operation: proto.Operation_ADD,
			expected:  15,
			errorMsg:  "",
		},
		{
			name:      "减法运算",
			num1:      10,
			num2:      5,
			operation: proto.Operation_SUBTRACT,
			expected:  5,
			errorMsg:  "",
		},
		{
			name:      "乘法运算",
			num1:      10,
			num2:      5,
			operation: proto.Operation_MULTIPLY,
			expected:  50,
			errorMsg:  "",
		},
		{
			name:      "除法运算",
			num1:      10,
			num2:      5,
			operation: proto.Operation_DIVIDE,
			expected:  2,
			errorMsg:  "",
		},
		{
			name:      "除以零",
			num1:      10,
			num2:      0,
			operation: proto.Operation_DIVIDE,
			expected:  0,
			errorMsg:  "除数不能为零",
		},
		{
			name:      "大数值",
			num1:      1e10,
			num2:      1e10,
			operation: proto.Operation_ADD,
			expected:  2e10,
			errorMsg:  "",
		},
		{
			name:      "负数",
			num1:      -10,
			num2:      5,
			operation: proto.Operation_ADD,
			expected:  -5,
			errorMsg:  "",
		},
		{
			name:      "小数",
			num1:      2.5,
			num2:      1.5,
			operation: proto.Operation_MULTIPLY,
			expected:  3.75,
			errorMsg:  "",
		},
	}

	// 执行测试表中的每个测试
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := &CalculatorService{}

			req := &connect.Request[proto.CalculateRequest]{
				Msg: &proto.CalculateRequest{
					Num1:      tc.num1,
					Num2:      tc.num2,
					Operation: tc.operation,
				},
			}

			resp, err := service.Calculate(context.Background(), req)

			if tc.errorMsg != "" {
				assert.Error(t, err)
				assert.Equal(t, tc.errorMsg, resp.Msg.Error)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expected, resp.Msg.Result)
				assert.Empty(t, resp.Msg.Error)
			}
		})
	}
}

// TestCalculate_ErrorCases 测试各种错误情况
func TestCalculate_ErrorCases(t *testing.T) {
	tests := []struct {
		name      string
		num1      float64
		num2      float64
		operation proto.Operation
		errorMsg  string
	}{
		{
			name:      "除以零",
			num1:      10,
			num2:      0,
			operation: proto.Operation_DIVIDE,
			errorMsg:  "除数不能为零",
		},
		{
			name:      "未知操作类型",
			num1:      10,
			num2:      5,
			operation: proto.Operation(99),
			errorMsg:  "未知操作类型",
		},
		{
			name:      "NaN结果",
			num1:      math.NaN(),
			num2:      5,
			operation: proto.Operation_ADD,
			errorMsg:  "结果不是一个有效的数值",
		},
		{
			name:      "无穷大结果",
			num1:      math.Inf(1),
			num2:      5,
			operation: proto.Operation_ADD,
			errorMsg:  "结果是无穷大",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := &CalculatorService{}

			req := &connect.Request[proto.CalculateRequest]{
				Msg: &proto.CalculateRequest{
					Num1:      tc.num1,
					Num2:      tc.num2,
					Operation: tc.operation,
				},
			}

			resp, _ := service.Calculate(context.Background(), req)

			assert.Equal(t, tc.errorMsg, resp.Msg.Error)
		})
	}
}
