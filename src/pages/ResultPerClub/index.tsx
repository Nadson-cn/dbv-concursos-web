
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoRegiao from '../../assets/Logo-regiao-9.png';
import logoProjeto from '../../assets/Logo-mda-apac.png';
import LoadingSpiner from '../../components/Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import Confetti from 'react-confetti';

type BothScores = {
  projetoSamuel: number;
  concursoMusical: number;
};

const ResultPerClub: React.FC = () => {
  const searchParams = new URLSearchParams(location.search);
  const clube = searchParams.get('clube');

  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<BothScores>({ projetoSamuel: 0, concursoMusical: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    if (clube) {
      setLoading(true);
      getBothCompetitionScores(clube)
        .then((scoreData) => {
          setScores(scoreData);
        })
        .catch((error) => {
          console.error('Failed to fetch club scores:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clube]);

  const getBothCompetitionScores = async (clubName: string): Promise<BothScores> => {
    // Fetch both competition scores in parallel
    const [samuelScore, musicalScore] = await Promise.all([
      getScoreForCompetition(clubName, 'PROJETO SAMUEL'),
      getScoreForCompetition(clubName, 'CONCURSO MUSICAL'),
    ]);

    return {
      projetoSamuel: samuelScore,
      concursoMusical: musicalScore,
    };
  };

  const getScoreForCompetition = async (clubName: string, competitionValue: string): Promise<number> => {
    // Fetch all scores for the competition
    const q = query(
      collection(firestore, 'scores-2025'),
      where('competition', '==', competitionValue)
    );
    const querySnapshot = await getDocs(q);
    const scores: any[] = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    // Filter scores by club name (case-insensitive)
    const clubNameLower = clubName.toLowerCase();
    const filteredScores = scores.filter((score) => score.club.toLowerCase() === clubNameLower);

    let totalScore = 0;
    filteredScores.forEach((score: any) => {
      totalScore += score.total || 0;
    });

    // Round to 1 decimal place for display
    return Math.round(totalScore * 10) / 10;
  };
  return (
    <>
    <Confetti numberOfPieces={400} />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 relative overflow-hidden">
      {/* Back Button - Top Left */}
      <div className="absolute top-5 left-5 z-20">
        <button
          className="border-2 border-blue-500 bg-white hover:bg-gray-300 text-blue-500 font-bold py-2 px-4 rounded"
          onClick={() => navigate('/clubes')}
        >
          Voltar
        </button>
      </div>

      <div
        className="bg-custom-background absolute inset-0 opacity-30"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-14">
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-8">
            {/* Left Logo - logoRegiao */}
            <img src={logoRegiao} alt="Logo Região 9" className="w-48 h-48 md:w-48 md:h-48 flex-shrink-0 object-contain" />

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tight text-gray-900 mb-2">
                PONTUAÇÃO
              </h1>
              <p className="text-2xl md:text-3xl lg:text-7xl text-gray-800 font-light">{clube || 'Servos do Rei'}</p>
            </div>

            {/* Right Logo - logoProjeto */}
            <img src={logoProjeto} alt="Logo Projeto Samuel" className="w-48 h-48 md:w-48 md:h-48 flex-shrink-0 object-contain" />
          </div>
        </div>

        {/* Scores Section */}
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingSpiner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-6xl mx-auto">
            {/* Projeto Samuel */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-6xl text-gray-700 mb-6 md:mb-8">
                Projeto <span className="font-bold text-gray-900">Samuel</span>
              </h2>
              <div className="text-[120px] md:text-[160px] lg:text-[200px] font-black leading-none text-gray-900 tracking-tighter">
                {scores.projetoSamuel.toFixed(1)}
              </div>
            </div>

            {/* Concurso Musical */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-6xl text-gray-700 mb-6 md:mb-8">
                Concurso <span className="font-bold text-gray-900">Musical</span>
              </h2>
              <div className="text-[120px] md:text-[160px] lg:text-[200px] font-black leading-none text-gray-900 tracking-tighter">
                {scores.concursoMusical.toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>

  )
}
 export default ResultPerClub;