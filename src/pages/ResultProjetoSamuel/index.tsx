import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoRegiao from '../../assets/Logo-regiao-9.png';
import logoProjeto from '../../assets/Logo-mda-apac.png';
import LoadingSpiner from '../../components/Loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import Confetti from 'react-confetti';

const ResultProjetoSamuel: React.FC = () => {
  const searchParams = new URLSearchParams(location.search);
  const clube = searchParams.get('clube');

  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (clube) {
      setLoading(true);
      getProjetoSamuelScore(clube)
        .then((scoreData) => {
          setScore(scoreData);
        })
        .catch((error) => {
          console.error('Failed to fetch Projeto Samuel score:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clube]);

  const getProjetoSamuelScore = async (clubName: string): Promise<number> => {
    const q = query(
      collection(firestore, 'scores-2025'),
      where('competition', '==', 'PROJETO SAMUEL'),
      where('club', '==', clubName)
    );
    const querySnapshot = await getDocs(q);
    const scores: any[] = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    let totalScore = 0;
    scores.forEach((scoreDoc: any) => {
      totalScore += scoreDoc.total || 0;
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

        <div className="bg-custom-background absolute inset-0 opacity-30" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16 md:mb-14">
            <div className="flex items-center justify-center gap-8 md:gap-16 mb-8">
              {/* Left Logo - logoRegiao */}
              <img
                src={logoRegiao}
                alt="Logo Região 9"
                className="w-48 h-48 md:w-48 md:h-48 flex-shrink-0 object-contain"
              />

              {/* Title */}
              <div>
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tight text-gray-900 mb-2">
                  PONTUAÇÃO
                </h1>
                <p className="text-2xl md:text-3xl lg:text-7xl text-gray-800 font-light">
                  {clube || 'Clube'}
                </p>
              </div>

              {/* Right Logo - logoProjeto */}
              <img
                src={logoProjeto}
                alt="Logo Projeto Samuel"
                className="w-48 h-48 md:w-48 md:h-48 flex-shrink-0 object-contain"
              />
            </div>
          </div>

          {/* Score Section - Centered */}
          {loading ? (
            <div className="flex justify-center items-center">
              <LoadingSpiner />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl lg:text-7xl text-gray-700 mb-8 md:mb-12">
                  Projeto <span className="font-bold text-gray-900">Samuel</span>
                </h2>
                <div className="text-[150px] md:text-[200px] lg:text-[250px] font-black leading-none text-gray-900 tracking-tighter">
                  {score.toFixed(1)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultProjetoSamuel;

