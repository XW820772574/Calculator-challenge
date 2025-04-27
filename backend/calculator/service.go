package calculator

import (
	"context"
	"errors"
	"fmt"
	"math"

	"connectrpc.com/connect"
	proto "github.com/calculator/proto"
)

// CalculatorService 实现了计算器服务
type CalculatorService struct{}

// Calculate 执行基础算术运算
func (s *CalculatorService) Calculate(
	ctx context.Context,
	req *connect.Request[proto.CalculateRequest],
) (*connect.Response[proto.CalculateResponse], error) {
	input := req.Msg
	result := &proto.CalculateResponse{}

	// 进行计算
	switch input.Operation {
	case proto.Operation_ADD:
		result.Result = input.Num1 + input.Num2
	case proto.Operation_SUBTRACT:
		result.Result = input.Num1 - input.Num2
	case proto.Operation_MULTIPLY:
		result.Result = input.Num1 * input.Num2
	case proto.Operation_DIVIDE:
		if input.Num2 == 0 {
			result.Error = "除数不能为零"
			return connect.NewResponse(result), errors.New("divide by zero")
		}
		result.Result = input.Num1 / input.Num2
	default:
		result.Error = "未知操作类型"
		return connect.NewResponse(result), fmt.Errorf("未知操作类型: %v", input.Operation)
	}

	// 处理可能的特殊情况
	if math.IsNaN(result.Result) {
		result.Error = "结果不是一个有效的数值"
	} else if math.IsInf(result.Result, 0) {
		result.Error = "结果是无穷大"
	}

	return connect.NewResponse(result), nil
}
