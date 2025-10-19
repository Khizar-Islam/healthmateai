// This file is: client/src/App.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    // This 'Outlet' component is where our pages (Login, Register) will be rendered
    <div className="min-h-screen bg-gray-100 p-8">
      <Outlet /> 
    </div>
  );
}