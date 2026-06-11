import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

export const App = () => {
  return (
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
  )
}
