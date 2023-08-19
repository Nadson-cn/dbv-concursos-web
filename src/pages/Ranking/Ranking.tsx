import React, { useEffect, useState } from 'react';
import { Radio, RadioChangeEvent, Table } from 'antd';
import { Api } from '../../configs/api';
import { AxiosError, AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';

const { Column } = Table;

interface DataType {
  key: React.Key | string;
  clube: string;
  pontuacao: number;
  time: string;
}
interface ResultType {
  competition: string;
  club: string;
  total: number;
  time: string;
}

function Ranking() {
  const api = new Api();
  const [valueCompetition, setValueCompetition] = useState('samuel');
  const [result, setResult] = useState<any>();

  const handleChangeCompetition = ({ target: { value } }: RadioChangeEvent) => {
    setValueCompetition(value);
  };

  useEffect(() => {
    api.axios
      .get(`/scores/ranking/${valueCompetition}`)
      .then((response: AxiosResponse) => {
        console.log(response.data);
        setResult(response.data);
      })
      .catch((error: AxiosError) => {
        console.error('Erro na requisição:', error);
      });
  }, [valueCompetition]);

  const data =
    result &&
    result.map((item: ResultType, index: number) => ({
      key: (index + 1).toString(),
      clube: item.club,
      pontuacao: item.total,
      time: item.time,
    }));

  return (
    <>
      <div className="absolute m-5">
        <button
          className="bg-slate-600 hover:bg-slate-700 p-4 rounded text-xl text-white w-full xl:w-24 "
          type="submit"
        >
          <Link to="/home">Voltar</Link>
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/5 border-2 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Selecione o concurso</h3>
          <Radio.Group
            options={[
              { label: 'Projeto Samuel', value: 'samuel' },
              { label: 'Concurso Musical', value: 'musical' },
            ]}
            onChange={handleChangeCompetition}
            value={valueCompetition}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <Table size="large" dataSource={data}>
          <Column title="Posição" dataIndex="key" key="key" />
          <Column title="Clube" dataIndex="clube" key="clube" />
          <Column title="Pontuação" dataIndex="pontuacao" key="pontuacao" />
          <Column title="Tempo" dataIndex="time" key="time" />
        </Table>
      </div>
    </>
  );
}

export default Ranking;
