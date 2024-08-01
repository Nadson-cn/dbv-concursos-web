import React from 'react';
import { List } from 'antd';
import { allClubes } from '../../utils/clubes';
import { Link, useNavigate } from 'react-router-dom';
const data = allClubes.map((clube) => ({ title: clube }));

const Clubes: React.FC = () => {
  const navigate = useNavigate();

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
          <button
            className="bg-blue-600 hover:bg-blue-800 p-4 rounded text-xl text-white w-full xl:w-80"
            type="button"
            onClick={() => navigate('/ranking-view?competicao=samuel')}
          >
            TOP 3 - Projeto Samuel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-800 p-4 rounded text-xl text-white w-full xl:w-80"
            type="button"
            onClick={() => navigate('/ranking-view?competicao=musical')}
          >
            TOP 3 - Concurso Musical
          </button>
          <button
            className="bg-green-600 hover:bg-green-800 p-4 rounded text-xl text-white w-full xl:w-80"
            type="button"
            onClick={() => navigate('/result?competicao=samuel')}
          >
            Ranking - Projeto Samuel
          </button>
          <button
            className="bg-green-600 hover:bg-green-800 p-4 rounded text-xl text-white w-full xl:w-80"
            type="button"
            onClick={() => navigate('/result?competicao=musical')}
          >
            Ranking - Concurso Musical
          </button>
        </div>
      </div>

      {/* <div className="bg-custom-background bg-fixed flex flex-col items-center">
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
      </div> */}
    </>
  );
};

export default Clubes;
