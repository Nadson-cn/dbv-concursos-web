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
  const isBack = searchParams.get('isBack');

  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Alterado para null
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState<ClubeData[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (competicao) {
      setLoading(true);
      getClubRanking(competicao)
        .then((rankingData) => {
          setRanking(rankingData);
          if (isBack) {
            setCurrentIndex(3);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch ranking:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [competicao]);

  useEffect(() => {
    if (isBack === 'true') {
      setCurrentIndex(3);
    }
  }, [isBack]);

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

    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentIndex === null && ranking.length > 0) {
      setCurrentIndex(ranking.length - 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex !== null && currentIndex < ranking.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentClube = currentIndex !== null ? ranking[currentIndex] : null;

  const Ranking = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="gap-2 flex flex-col w-screen justify-center items-center">
          <div className="flex gap-[2px] items-end">
            <div className="w-[22rem] font-semibold text-xl text-center">Posição</div>
            <div className="w-[60rem] font-semibold text-center">Clube</div>
            <div className="w-[24rem] font-semibold text-center">Pontuação</div>
          </div>
          <div key={currentClube?.key} className="flex gap-[2px]">
            <div className="h-[15rem] w-[22rem] rounded-l-full flex items-center justify-center bg-neutral-600">
              <p className="font-extrabold text-8xl text-gray-300 text-center animate-fadeIn">
                {currentClube ? `${currentIndex + 1}°` : ''}
              </p>
            </div>
            <div className="h-[15rem] w-[60rem] flex items-center justify-center bg-neutral-600">
              <p className="font-extrabold text-8xl text-gray-300 text-center animate-fadeIn">
                {currentClube ? currentClube.clube : ''}
              </p>
            </div>
            <div className="h-[15rem] w-[24rem] rounded-r-full flex items-center justify-center bg-neutral-600">
              <p className="font-extrabold text-8xl text-gray-300 text-center animate-fadeIn">
                {currentClube ? currentClube.pontuacao : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          disabled={currentIndex === null || currentIndex === ranking.length - 1}
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
      <div className="bg-custom-background bg-scroll flex flex-col items-center justify-center">
        <div className="flex items-center -mt-20">
          <img src={logoProjeto} alt="logo" className="object-cover w-[280px] h-[300px] ml-5 mr-5" />
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-8xl">
              {competicao === 'samuel' ? 'PROJETO SAMUEL' : 'CONCURSO MUSICAL'}
            </h1>
          </div>
          <img src={logoRegiao} alt="" className="w-[200px] h-[200px] mr-20" />
        </div>
        <div className="flex justify-center items-center">
          <div className="flex">
            <div className="flex flex-col items-center">
              {loading ? (
                <LoadingSpiner />
              ) : (
                <>
                  <Ranking />
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
