import React from 'react';
import { List } from 'antd';
import { allClubes } from '../../utils/clubes';
import { Link } from 'react-router-dom';
const data = allClubes.map((clube) => ({ title: clube }));

const Clubes: React.FC = () => {
  return (
    <>
      <div className="absolute m-5">
        <button
          className="bg-slate-800 hover:bg-slate-700 mr-5 p-4 rounded text-xl text-white w-full xl:w-24 "
          type="submit"
        >
          <Link to="/home">Voltar</Link>
        </button>
        <div className="flex flex-col mt-5">
          <button
            className="bg-yellow-700 hover:bg-slate-700 p-4 rounded text-xl text-white w-full xl:w-60 "
            type="submit"
          >
            <Link to="/ranking-view?competicao=samuel">Ranking - Samuel</Link>
          </button>
          <button
            className="bg-yellow-700 hover:bg-slate-700 p-4 rounded text-xl text-white w-full xl:w-60 mt-6 "
            type="submit"
          >
            <Link to="/ranking-view?competicao=musical">Ranking - Musical</Link>
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
