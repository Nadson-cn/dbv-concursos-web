import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Ranking from '../pages/Ranking/Ranking';
import ResultsScreen from '../pages/Result';
import RankingView from '../pages/RankingView/aa';
import Clubes from '../pages/Clubes';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/ranking-view" element={<RankingView />} />
        <Route path="/result" element={<ResultsScreen />} />
      </Routes>
    </BrowserRouter>
  );
};
