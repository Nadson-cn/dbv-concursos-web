import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoRegiao from '../../assets/Logo-regiao-9.png';
import logoProjeto from '../../assets/Logo-projeto-samuel-2024-nobg.png';
import LoadingSpiner from '../../components/Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import Confetti from 'react-confetti';

type ClubScore = {
  clube: string;
  pontuacao: number;
  competicao: string;
};

const ResultPerClub: React.FC = () => {
  const searchParams = new URLSearchParams(location.search);
  const clube = searchParams.get('clube');
  const competicao = searchParams.get('competicao');

  const [loading, setLoading] = useState(false);
  const [clubScore, setClubScore] = useState<ClubScore | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (clube && competicao) {
      setLoading(true);
      getClubScore(clube, competicao)
        .then((scoreData) => {
          setClubScore(scoreData);
        })
        .catch((error) => {
          console.error('Failed to fetch club score:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clube, competicao]);

  const getClubScore = async (clubName: string, competition: string): Promise<ClubScore> => {
    let competitionValue: string;

    if (competition === 'musical') {
      competitionValue = 'CONCURSO MUSICAL';
    } else if (competition === 'samuel') {
      competitionValue = 'PROJETO SAMUEL';
    } else {
      throw new Error('Incorrect competition name');
    }

    const q = query(
      collection(firestore, 'scores-2025'),
      where('competition', '==', competitionValue),
      where('club', '==', clubName)
    );
    const querySnapshot = await getDocs(q);
    const scores: any[] = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    let totalScore = 0;
    scores.forEach((score: any) => {
      totalScore += score.total || 0;
    });

    return {
      clube: clubName,
      pontuacao: totalScore,
      competicao: competitionValue,
    };
  };

  return (
    <>
      <Confetti numberOfPieces={400} />
      <div className="flex flex-col absolute m-5">
        <button
          className="mt-4 border-2 border-blue-500 bg-white hover:bg-gray-300 text-blue-500 font-bold py-2 px-4 rounded"
          onClick={() => navigate('/clubes')}
        >
          Voltar
        </button>
      </div>
      <div className="bg-custom-background bg-scroll flex flex-col items-center justify-center min-h-screen">
        <div className="flex items-center -mt-20">
          <img src={logoProjeto} alt="logo" className="object-cover w-[280px] h-[300px] ml-5 mr-5" />
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-8xl">
              {competicao === 'samuel' ? 'PROJETO SAMUEL' : 'CONCURSO MUSICAL'}
            </h1>
          </div>
          <img src={logoRegiao} alt="" className="w-[200px] h-[200px] mr-20" />
        </div>
        <div className="flex justify-center items-center mt-10">
          <div className="flex">
            <div className="flex flex-col items-center">
              {loading ? (
                <LoadingSpiner />
              ) : clubScore ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="gap-2 flex flex-col w-screen justify-center items-center">
                    <div className="flex gap-[2px] items-end">
                      <div className="w-[60rem] font-semibold text-xl text-center">Clube</div>
                      <div className="w-[24rem] font-semibold text-xl text-center">Pontuação Total</div>
                    </div>
                    <div className="flex gap-2 items-center justify-center">
                      <div className="h-[15rem] w-[60rem] rounded-l-full flex items-center justify-center bg-gray-700">
                        <p className="font-extrabold text-8xl -mb-[1px] text-gray-300 text-center animate-fadeIn">
                          {clubScore.clube}
                        </p>
                      </div>
                      <div className="h-[15rem] w-[24rem] rounded-r-full flex items-center justify-center bg-gray-700">
                        <p className="font-extrabold text-8xl -mb-[1px] text-gray-300 text-center animate-fadeIn">
                          {clubScore.pontuacao}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white text-2xl">Nenhum resultado encontrado</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPerClub;

