import React from 'react';
import { List } from 'antd';
import { allClubes } from '../../utils/clubes';
import { useNavigate } from 'react-router-dom';
const data = allClubes.map((clube) => ({ title: clube }));

const Clubes: React.FC = () => {
  const navigate = useNavigate();

  return (
    // <>
    <div className="flex bg-gray-700 w-screen h-screen justify-center">
      <div className="flex flex-col m-5 gap-3 items-center">
        <button
          className="border-2 border-blue-600 bg-white hover:bg-gray-200 p-4 rounded text-xl text-blue-600 w-full xl:w-80"
          type="button"
          onClick={() => navigate('/home')}
        >
          Voltar
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-800 p-4 rounded text-xl text-white w-full xl:w-80"
          type="button"
          onClick={() => navigate('/ranking-view?competicao=samuel')}
        >
          Ranking - Projeto Samuel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-800 p-4 rounded text-xl text-white w-full xl:w-80"
          type="button"
          onClick={() => navigate('/ranking-view?competicao=musical')}
        >
          Ranking - Concurso Musical
        </button>
      </div>
    </div>
  );
};

export default Clubes;
