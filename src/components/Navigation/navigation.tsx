import React from 'react';
import { useNavigate } from 'react-router-dom';
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const nameLocalStorage = window.localStorage.getItem('name');

  return (
    // <nav>
    <div className="flex gap-3">
      <button
        className="border-2 border-blue-600 bg-white hover:bg-blue-700 p-4 rounded text-base text-blue-600 w-full xl:w-18"
        type="button"
        onClick={() => navigate('/')}
      >
        Sair
      </button>

      {nameLocalStorage === 'Fábio' && (
        <>
          <button
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white w-full xl:w-18"
            type="button"
            onClick={() => navigate('/ranking')}
          >
            Clubes
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white w-full xl:w-18 "
            type="button"
            onClick={() => navigate('/clubes')}
          >
            Ranking
          </button>
        </>
      )}
    </div>
  );
};

export default Navigation;
