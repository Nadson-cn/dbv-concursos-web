import React, { useEffect, useState } from 'react';
import { Radio, RadioChangeEvent, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import ArrowBack from '../../assets/arrow-back.svg';
const { Column } = Table;

interface ResultType {
  competition: string;
  club: string;
  total: number;
  time: string;
}

function Ranking() {
  const navigate = useNavigate();
  const [valueCompetition, setValueCompetition] = useState('PROJETO SAMUEL');
  const [result, setResult] = useState<any>();

  const handleChangeCompetition = ({ target: { value } }: RadioChangeEvent) => {
    setValueCompetition(value);
  };

  const fetchData = async () => {
    const q = query(collection(firestore, 'scores'), where('competition', '==', valueCompetition));
    const querySnapshot = await getDocs(q);
    const dadosFirestore: any[] = [];
    querySnapshot.forEach((doc) => {
      dadosFirestore.push({ id: doc.id, ...doc.data() });
    });

    setResult(dadosFirestore);
    console.log('querySnapshot', querySnapshot);
    console.log('dadosFirestore', dadosFirestore);
  };

  useEffect(() => {
    fetchData();
  }, [valueCompetition]);

  const data =
    result &&
    result
      .sort((a: any, b: any) => b.total - a.total)
      .map((item: ResultType, index: number) => ({
        key: (index + 1).toString(),
        clube: item.club,
        pontuacao: item.total,
        time: item.time,
      }));

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/5 border-2 flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-3">
            <img onClick={() => navigate('/home')} src={ArrowBack} width={30} height={30} alt="" />
            <h3 className="text-xl font-semibold">Selecione o concurso</h3>
            <span></span>
          </div>
          <Radio.Group
            options={[
              { label: 'Projeto Samuel', value: 'PROJETO SAMUEL' },
              { label: 'Concurso Musical', value: 'CONCURSO MUSICAL' },
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
