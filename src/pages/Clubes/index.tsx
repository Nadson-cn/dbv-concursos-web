import React, { useState } from 'react';
import { Select } from 'antd';
import { allClubes } from '../../utils/clubes';
import { useNavigate } from 'react-router-dom';

const clubeOptions = allClubes.map((clube) => ({
  value: clube,
  label: clube,
}));

const Clubes: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState<string>('');

  const handleClubChange = (value: string) => {
    setSelectedClub(value);
  };

  const handleViewClubScore = () => {
    if (selectedClub) {
      navigate(`/result-per-club?clube=${selectedClub}`);
    }
  };

  const handleViewProjetoSamuelScore = () => {
    if (selectedClub) {
      navigate(`/result-projeto-samuel?clube=${selectedClub}`);
    }
  };

  return (
    <>
      <div className="flex bg-gray-700 w-screen h-screen justify-center">
        <div className="flex flex-col m-5 gap-3 items-center">
          <button
            className="border-2 border-blue-600 bg-white hover:bg-gray-200 p-4 rounded text-xl text-blue-600 w-full xl:w-80"
            type="button"
            onClick={() => navigate('/home')}
          >
            Voltar
          </button>

          <div className="bg-white p-6 rounded shadow-md w-full xl:w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Ver Pontuação por Clube</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Clube:
              </label>
              <Select
                className="w-full"
                placeholder="Escolha um clube"
                value={selectedClub || undefined}
                onChange={handleClubChange}
                options={clubeOptions}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed p-3 rounded text-lg text-white w-full"
                type="button"
                onClick={handleViewClubScore}
                disabled={!selectedClub}
              >
                Ver Ambas Competições
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed p-3 rounded text-lg text-white w-full"
                type="button"
                onClick={handleViewProjetoSamuelScore}
                disabled={!selectedClub}
              >
                Ver Projeto Samuel
              </button>
            </div>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-800 p-4 rounded text-xl text-white w-full xl:w-80"
            type="button"
            onClick={() => navigate('/result?competicao=samuel')}
          >
            Ranking - Projeto Samuel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-800 p-4 rounded text-xl text-white w-full xl:w-80"
            type="button"
            onClick={() => navigate('/result?competicao=musical')}
          >
            Ranking - Concurso Musical
          </button>
        </div>
      </div>
    </>
  );
};

export default Clubes;
