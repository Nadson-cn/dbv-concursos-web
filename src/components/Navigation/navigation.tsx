import React from 'react';
import { useNavigate } from 'react-router-dom';
const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav>
      <ul className="flex gap-3 text-blue-600">
        <li>
          <button
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white w-full xl:w-18"
            type="button"
            onClick={() => navigate('/ranking')}
          >
            Ranking
          </button>
        </li>
        <li>
          <button
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white w-full xl:w-18 "
            type="button"
            onClick={() => navigate('/clubes')}
          >
            Clubes
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
