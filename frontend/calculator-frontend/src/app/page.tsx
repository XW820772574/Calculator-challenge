"use client";

import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Go+ConnectRPC 计算器</h1>
       
      </div>
      <Calculator />
    </main>
  );
} 