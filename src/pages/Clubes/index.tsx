import React, { useState } from 'react';
import { List, Select, Radio } from 'antd';
import { allClubes } from '../../utils/clubes';
import { Link, useNavigate } from 'react-router-dom';
import type { RadioChangeEvent } from 'antd';

const data = allClubes.map((clube) => ({ title: clube }));

const clubeOptions = allClubes.map((clube) => ({
  value: clube,
  label: clube,
}));

const Clubes: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('samuel');

  const handleClubChange = (value: string) => {
    setSelectedClub(value);
  };

  const handleCompetitionChange = (e: RadioChangeEvent) => {
    setSelectedCompetition(e.target.value);
  };

  const handleViewClubScore = () => {
    if (selectedClub && selectedCompetition) {
      navigate(`/result-per-club?clube=${selectedClub}&competicao=${selectedCompetition}`);
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione a Competição:
              </label>
              <Radio.Group onChange={handleCompetitionChange} value={selectedCompetition}>
                <Radio value="samuel" className="block mb-2">Projeto Samuel</Radio>
                <Radio value="musical" className="block">Concurso Musical</Radio>
              </Radio.Group>
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed p-3 rounded text-lg text-white w-full"
              type="button"
              onClick={handleViewClubScore}
              disabled={!selectedClub}
            >
              Ver Pontuação do Clube
            </button>
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

      <div className="bg-custom-background bg-fixed flex flex-col items-center">
        <div className="w-full h-screen bg-fixed bg-slate-400 flex">
          <div className="w-full m-5 xl:w-1/2 xl:ml-auto xl:mr-auto">
            <List
              className="xl:ml-28 bg-slate-100 rounded"
              itemLayout="horizontal"
              dataSource={data.reverse()}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta className="ml-5 text-xl font-semibold" title={'#' + index + ' - ' + item.title} />
                  <Link className="mr-10" to={`/result?clube=${item.title}`}>
                    Resultado
                  </Link>
                </List.Item>
              )}
            />
            <button
              className="bg-slate-800 hover:bg-slate-700 mr-5 p-4 rounded text-xl text-white w-full xl:hidden mt-5"
              type="submit"
            >
              <Link to="/home">Voltar</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clubes;
