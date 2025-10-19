import React from 'react';
import { Outlet } from 'react-router-dom';
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Outlet /> 
    </div>
  );
}