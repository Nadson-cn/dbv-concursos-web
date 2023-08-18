import React, { useState, useEffect } from 'react';

interface ClubResult {
  clube: string;
  pontuacao: number;
}

const ResultsScreen: React.FC = () => {
  const [counting, setCounting] = useState(false);
  const [position, setPosition] = useState(3); // Começa com 3 para terceiro lugar
  const [resultIndex, setResultIndex] = useState(0); // Índice do resultado exibido
  const [winnerRevealed, setWinnerRevealed] = useState(false); // Novo estado para controlar se o vencedor foi revelado

  const clubResults: ClubResult[] = [
    {
      clube: 'Clube A',
      pontuacao: 80,
    },
    {
      clube: 'Clube B',
      pontuacao: 60,
    },
    {
      clube: 'Clube c',
      pontuacao: 30,
    },
  ];

  const startCounting = () => {
    setCounting(true);
  };

  useEffect(() => {
    if (counting) {
      if (position > 0) {
        const interval = setInterval(() => {
          setPosition((prevPosition) => prevPosition - 1);
        }, 1000);

        return () => clearInterval(interval);
      } else if (!winnerRevealed) {
        setResultIndex(resultIndex + 1);
        setPosition(3);
      } else {
        const timeout = setTimeout(() => {
          setWinnerRevealed(false);
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }
  }, [counting, position, winnerRevealed, resultIndex]);

  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-3 mt-20">
        <div className="items-center flex flex-col">
          <h1 className="text-4xl mb-4 font-bold">2º Lugar</h1>
          <div className="w-[600px] h-[600px] bg-[#3a4246] border-[10px] border-gray-600 text-[white] text-5xl flex justify-center items-center rounded-[50%]">
            <p className="text-center font-bold">{clubResults[2].clube}</p>
          </div>
        </div>
        <div className="items-center flex flex-col">
          <h1 className="text-4xl mb-4 -[10px]">1º Lugar</h1>
          <div className="w-[600px] h-[600px] bg-[#fbd827] border-[10px] border-yellow-600 mb-52 text-[white] text-5xl flex justify-center items-center rounded-[50%]">
            <p className="text-center font-bold text-black">{clubResults[0].clube}</p>
          </div>
        </div>
        <div className="items-center flex flex-col">
          <h1 className="text-4xl mb-4 font-bold">3º Lugar</h1>
          <div className="w-[600px] h-[600px] bg-[#3498db] border-4 border-b-orange-950 text-[white] text-5xl flex justify-center items-center rounded-[50%]">
            <p className="text-center font-bold">{clubResults[1].clube}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
