// 导入jest-dom的扩展
import '@testing-library/jest-dom';

// 模拟TextEncoder和TextDecoder
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = require('util').TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = require('util').TextDecoder;
}

// 模拟fetch API
global.fetch = jest.fn();

// 重置所有模拟
beforeEach(() => {
  jest.resetAllMocks();
}); 