const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 指向Next.js应用的路径
  dir: './',
});

// Jest的自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 处理模块别名
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  }
};

// createJestConfig会为每个测试环境处理Next.js的配置
module.exports = createJestConfig(customJestConfig); 