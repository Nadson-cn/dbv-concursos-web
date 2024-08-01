import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
// import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import logoMda from '../../assets/Logo-mda-apac.png';
import logoRegiao from '../../assets/Logo-regiao-9.png';
import trofeu1 from '../../assets/Trofeu-1-lugar.png';
import trofeu2 from '../../assets/Trofeu-2-lugar.png';
import trofeu3 from '../../assets/Trofeu-3-lugar.png';

const Button = ({ onClick, className, children }: any) => (
  <button className={`hover:bg-slate-700 hover:text-white p-4 rounded text-xl ${className}`} onClick={onClick}>
    {children}
  </button>
);

const TrophyDisplay = ({ place, trophy, data, show }: any) => (
  <div className={`flex flex-col items-center ${place === '1º Lugar' ? '-mt-14' : 'mt-5'}`}>
    <img src={trophy} alt={`${place} Trophy`} className="w-[150px] h-[150px] ml-5 mr-5" />
    <h2 className="font-extrabold text-7xl">{place}</h2>
    {show && data ? (
      <>
        <h1 className="font-extrabold text-9xl tracking-widest">{data.total}</h1>
        <h1 className="font-bold text-5xl">{data.club}</h1>
      </>
    ) : (
      <></>
      // <svg
      //   aria-hidden="true"
      //   className="inline w-32 h-32 mr-2 mt-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-200"
      //   viewBox="0 0 100 101"
      //   fill="none"
      //   xmlns="http://www.w3.org/2000/svg"
      // >
      //   <path
      //     d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      //     fill="currentColor"
      //   />
      //   <path
      //     d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      //     fill="currentFill"
      //   />
      // </svg>
    )}
  </div>
);

const RankingView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const competicao = searchParams.get('competicao');
  const [ranking, setRanking] = useState<any[]>([]);
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);

  useEffect(() => {
    if (competicao) {
      getClubRanking(competicao).catch((error) => {
        console.error('Failed to fetch ranking:', error);
      });
    }
  }, [competicao]);

  const getClubRanking = async (competition: string) => {
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

    const finalRanking = Object.values(clubRanking).flat();

    finalRanking.sort((a, b) => b.total - a.total);

    setRanking(finalRanking);

    return finalRanking;
  };

  const handleDisplay = () => {
    if (showThird) {
      setShowSecond(true);
      if (showSecond) {
        setShowFirst(true);
      }
    } else {
      setShowThird(true);
    }
  };

  return (
    <>
      {showFirst && <Confetti numberOfPieces={400} />}
      <div className="absolute flex flex-col m-5">
        <button
          className="mt-4 border-2 border-blue-500 bg-white hover:bg-gray-300 text-blue-500 font-bold py-2 px-4 rounded"
          onClick={() => navigate('/clubes')}
        >
          Voltar
        </button>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setShowThird(false);
            setShowSecond(false);
            setShowFirst(false);
          }}
          disabled={!showThird}
        >
          Limpar
        </button>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
          onClick={handleDisplay}
          disabled={showFirst}
        >
          Próximo
        </button>
      </div>
      <div className="bg-custom-background bg-fixed flex flex-col items-center">
        <div className="flex gap-10 mt-16">
          <img src={logoMda} alt="Logo MDA" className="w-[200px] h-[200px] mr-20" />
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-8xl">RANKING</h1>
            <h1 className="font-medium text-6xl mt-4">
              {competicao === 'samuel' ? 'PROJETO SAMUEL' : 'CONCURSO MUSICAL'}
            </h1>
          </div>
          <img src={logoRegiao} alt="Logo Regiao" className="w-[200px] h-[200px] mr-20" />
        </div>
        <div className="flex justify-center items-center mt-20">
          <div className="flex gap-32">
            <TrophyDisplay place="2º Lugar" trophy={trofeu2} data={ranking[1]} show={showSecond} />
            <TrophyDisplay place="1º Lugar" trophy={trofeu1} data={ranking[0]} show={showFirst} />
            <TrophyDisplay place="3º Lugar" trophy={trofeu3} data={ranking[2]} show={showThird} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RankingView;
