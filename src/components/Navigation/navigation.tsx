import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className="flex gap-3 text-blue-600">
        <li>
          <button
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white w-full xl:w-18"
            type="submit"
          >
            <Link to="/ranking">Ranking</Link>
          </button>
        </li>
        <li>
          <button
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white w-full xl:w-18 "
            type="submit"
          >
            <Link to="/clubes">Clubes</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
