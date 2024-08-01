import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoMda from '../../assets/Logo-mda-apac.png';
import logoRegiao from '../../assets/Logo-regiao-9.png';
import logoProjeto from '../../assets/Logo-projeto-samuel-2024-nobg.png';
import LoadingSpiner from '../../components/Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';

type ClubeData = {
  key: string;
  clube: string;
  pontuacao: number;
};

const ClubesPontuacao: React.FC = () => {
  const searchParams = new URLSearchParams(location.search);
  const competicao = searchParams.get('competicao');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState<ClubeData[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (competicao) {
      setLoading(true);
      getClubRanking(competicao)
        .then((rankingData) => {
          setRanking(rankingData);
          setCurrentIndex(rankingData.length - 1);
        })
        .catch((error) => {
          console.error('Failed to fetch ranking:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [competicao]);

  const getClubRanking = async (competition: string): Promise<ClubeData[]> => {
    let value: string;

    if (competition === 'musical') {
      value = 'CONCURSO MUSICAL';
    } else if (competition === 'samuel') {
      value = 'PROJETO SAMUEL';
    } else {
      throw new Error('Incorrect competition name');
    }

    const q = query(collection(firestore, 'scores'), where('competition', '==', value));
    const querySnapshot = await getDocs(q);
    const scores: any[] = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    const clubRanking: { [key: string]: any[] } = {};

    scores.forEach((score: any) => {
      const { club, competition, total } = score;

      if (!clubRanking[club]) {
        clubRanking[club] = [];
      }

      const existingEntry = clubRanking[club].find((entry) => entry.competition === competition);

      if (existingEntry) {
        existingEntry.total += total;
      } else {
        clubRanking[club].push({
          club,
          competition,
          total,
        });
      }
    });

    const finalRanking = Object.values(clubRanking)
      .flat()
      .map((item, index) => ({
        key: (index + 1).toString(),
        clube: item.club,
        pontuacao: item.total,
      }))
      .sort((a, b) => b.pontuacao - a.pontuacao);

    return finalRanking;
  };

  const handleNext = () => {
    if (currentIndex === 3) {
      navigate(`/ranking-view?competicao=${competicao}`);
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex < ranking.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentClube = ranking[currentIndex];

  return (
    <>
      <div className="flex flex-col absolute m-5">
        <button
          className="mt-4 border-2 border-blue-500 bg-white hover:bg-gray-300 text-blue-500 font-bold py-2 px-4 rounded"
          onClick={() => navigate('/clubes')}
        >
          Voltar
        </button>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setCurrentIndex(ranking.length - 1);
          }}
        >
          Resetar
        </button>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
          onClick={handlePrevious}
          disabled={currentIndex === ranking.length - 1}
        >
          Anterior
        </button>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
          onClick={handleNext}
          disabled={currentIndex === 0}
        >
          Próximo
        </button>
      </div>
      <div className="bg-custom-background bg-fixed flex flex-col items-center justify-center">
        <div className="flex">
          <img src={logoMda} alt="" className="w-[200px] h-[200px] mr-20" />
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-8xl">PONTUAÇÃO</h1>
            <img src={logoProjeto} alt="" className="object-cover w-[280px] h-[300px] ml-5 mr-5" />
            <div className="flex flex-row items-center gap-4">
              <h1 className="font-extrabold text-8xl">{currentIndex + 1}°</h1>
              <h1 className="font-medium text-6xl mt-4">
                {' '}
                - {competicao === 'samuel' ? 'PROJETO SAMUEL' : 'CONCURSO MUSICAL'}
              </h1>
            </div>
          </div>
          <img src={logoRegiao} alt="" className="w-[200px] h-[200px] mr-20" />
        </div>
        <div className="flex mt-3 justify-center items-center">
          <div className="flex">
            <div className="flex flex-col items-center">
              {loading ? (
                <LoadingSpiner />
              ) : (
                <>
                  <h2 className="font-extrabold text-7xl">{currentClube?.clube}</h2>
                  <h1 className="font-extrabold text-9xl tracking-widest">{currentClube?.pontuacao}</h1>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubesPontuacao;
