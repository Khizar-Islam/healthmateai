// This file is: client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

import './index.css'; // This file now includes our Tailwind styles

// This creates all the "routes" (pages) for our app
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Our main layout
    children: [
      // When the URL is /login, show the LoginPage
      {
        path: '/login',
        element: <LoginPage />,
      },
      // When the URL is /register, show the RegisterPage
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
]);

// This starts the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);