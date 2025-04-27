
# 计算器应用

这是一个简单的计算器应用，支持基础的加减乘除运算。

## 项目结构

项目分为前端和后端两部分：

### 后端

- 使用 Go + ConnectRPC 实现
- 支持基础的加减乘除运算
- 提供RESTful API和Connect协议API

### 前端

- 使用 Next.js 构建UI
- 包含输入框、操作符选择和结果展示
- 通过ConnectRPC调用后端，并显示运算结果

## 安装与运行

### 后端

```bash
cd backend
go mod download
go run main.go
```

后端服务将在 http://localhost:8080 启动

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端应用将在 http://localhost:3000 启动

## 技术栈

- 后端：Go、ConnectRPC、HTTP/2
- 前端：Next.js、TypeScript、React
- 通信：Connect协议

## 功能特点

1. 支持加、减、乘、除四种基本运算
2. 优雅处理除以零等错误情况
3. 同时支持RESTful API和Connect协议API
4. 前端响应式设计
5. 完善的错误处理 

