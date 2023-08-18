import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Ranking from '../pages/Ranking/Ranking';
import ResultsScreen from '../pages/Result';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Navigate to="admin/login" replace />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/result" element={<ResultsScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
