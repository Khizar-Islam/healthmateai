// This file is: client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // <-- 1. IMPORT THIS
import TimelinePage from './pages/TimelinePage.jsx';
import ViewReportPage from './pages/ViewReportPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/dashboard', // <-- 2. ADD THIS NEW ROUTE
        element: <DashboardPage />,
      },
      { // <-- ADD THIS BLOCK
        path: '/timeline', 
        element: <TimelinePage />,
      }, // <-- AND THIS COMMA
      {
        path: '/view-report/:fileId', // <-- 2. ADD THIS NEW ROUTE
        element: <ViewReportPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
