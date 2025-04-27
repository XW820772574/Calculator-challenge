package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/calculator/calculator"
	"github.com/calculator/proto/proto/protoconnect"

	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

// 计算请求结构
type CalculateRequest struct {
	Num1      float64 `json:"num1"`
	Num2      float64 `json:"num2"`
	Operation string  `json:"operation"`
}

// 计算响应结构
type CalculateResponse struct {
	Result float64 `json:"result,omitempty"`
	Error  string  `json:"error,omitempty"`
}

// initCalculatorService 初始化并返回计算器服务
func initCalculatorService() *calculator.CalculatorService {
	return &calculator.CalculatorService{}
}

// calculateHandler 处理计算请求
func calculateHandler(w http.ResponseWriter, r *http.Request, service *calculator.CalculatorService) {
	// 只处理POST请求
	if r.Method != http.MethodPost {
		http.Error(w, "只支持POST方法", http.StatusMethodNotAllowed)
		return
	}

	// 读取请求体
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "读取请求体失败", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// 解析JSON
	var req CalculateRequest
	if err := json.Unmarshal(body, &req); err != nil {
		resp := CalculateResponse{Error: "无效的JSON格式: " + err.Error()}
		sendJSONResponse(w, resp, http.StatusBadRequest)
		return
	}

	// 处理计算请求
	result, err := performCalculation(req.Num1, req.Num2, req.Operation)
	if err != nil {
		resp := CalculateResponse{Error: err.Error()}
		sendJSONResponse(w, resp, http.StatusBadRequest)
		return
	}

	// 发送成功响应
	resp := CalculateResponse{Result: result}
	sendJSONResponse(w, resp, http.StatusOK)
}

// performCalculation 执行计算操作
func performCalculation(num1, num2 float64, operation string) (float64, error) {
	switch operation {
	case "add":
		return num1 + num2, nil
	case "subtract":
		return num1 - num2, nil
	case "multiply":
		return num1 * num2, nil
	case "divide":
		if num2 == 0 {
			return 0, fmt.Errorf("除数不能为零")
		}
		return num1 / num2, nil
	default:
		return 0, fmt.Errorf("未知的操作类型: %s", operation)
	}
}

// sendJSONResponse 发送JSON响应
func sendJSONResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("编码响应失败: %v", err)
	}
}

func main() {
	// 创建新的计算器服务实例
	calculatorService := initCalculatorService()

	// 创建计算器服务的处理器
	calculatorPath, calculatorHandler := protoconnect.NewCalculatorServiceHandler(calculatorService)

	// 设置路由
	mux := http.NewServeMux()
	mux.Handle(calculatorPath, calculatorHandler)

	// 添加REST API路由
	mux.HandleFunc("/calculate", func(w http.ResponseWriter, r *http.Request) {
		calculateHandler(w, r, calculatorService)
	})

	// 设置 CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // 前端地址
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// 包装处理器
	handler := corsHandler.Handler(mux)

	// 创建支持 HTTP/2 的服务器
	server := &http.Server{
		Addr:    ":8080",
		Handler: h2c.NewHandler(handler, &http2.Server{}),
	}

	log.Println("计算器服务器启动于: http://localhost:8080")
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务器错误: %v", err)
	}
}
