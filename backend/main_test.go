package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCalculateHandler(t *testing.T) {
	// 设置测试用例
	tests := []struct {
		name           string
		requestBody    string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "有效的加法请求",
			requestBody:    `{"num1": 5, "num2": 3, "operation": "add"}`,
			expectedStatus: http.StatusOK,
			expectedBody:   `{"result":8}`,
		},
		{
			name:           "有效的减法请求",
			requestBody:    `{"num1": 5, "num2": 3, "operation": "subtract"}`,
			expectedStatus: http.StatusOK,
			expectedBody:   `{"result":2}`,
		},
		{
			name:           "无效的操作类型",
			requestBody:    `{"num1": 5, "num2": 3, "operation": "invalid"}`,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"error":"未知的操作类型: invalid"}`,
		},
		{
			name:           "除以零错误",
			requestBody:    `{"num1": 5, "num2": 0, "operation": "divide"}`,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"error":"除数不能为零"}`,
		},
		{
			name:           "无效的JSON格式",
			requestBody:    `{invalid json}`,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"error":"`,
		},
	}

	// 执行测试用例
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 创建模拟请求
			req := httptest.NewRequest("POST", "/calculate", strings.NewReader(tt.requestBody))
			req.Header.Set("Content-Type", "application/json")

			// 创建响应记录器
			rr := httptest.NewRecorder()

			// 初始化处理器并处理请求
			initializeAndHandleRequest(rr, req)

			// 检查状态码
			assert.Equal(t, tt.expectedStatus, rr.Code)

			// 检查响应体
			if tt.expectedStatus == http.StatusOK {
				assert.Equal(t, tt.expectedBody, strings.TrimSpace(rr.Body.String()))
			} else {
				// 对于错误情况，只检查是否包含预期的错误消息前缀
				assert.Contains(t, rr.Body.String(), tt.expectedBody)
			}
		})
	}
}

// 初始化并处理请求的辅助函数
func initializeAndHandleRequest(w http.ResponseWriter, r *http.Request) {
	// 初始化服务并创建处理器
	service := initCalculatorService()
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calculateHandler(w, r, service)
	})

	// 处理请求
	handler.ServeHTTP(w, r)
}
