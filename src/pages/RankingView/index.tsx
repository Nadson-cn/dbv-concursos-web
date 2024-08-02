import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
// import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

// import logoMda from '../../assets/Logo-mda-apac.png';
import logoRegiao from '../../assets/Logo-regiao-9.png';
import trofeu1 from '../../assets/Trofeu-1-lugar.png';
import trofeu2 from '../../assets/Trofeu-2-lugar.png';
import trofeu3 from '../../assets/Trofeu-3-lugar.png';
import logoProjeto from '../../assets/Logo-projeto-samuel-2024-nobg.png';

const TrophyDisplay = ({ place, trophy, data, show }: any) => (
  <div className={`flex flex-col items-center ${place === '1º Lugar' ? '-mt-14' : 'mt-5'} animate-fadeIn`}>
    <img src={trophy} alt={`${place} Trophy`} className="w-[150px] h-[150px] ml-5 mr-5" />
    <h2 className="font-extrabold font-rubik text-7xl">{place}</h2>
    {show && data && (
      <>
        <h1 className="font-extrabold font-rubik text-9xl tracking-widest animate-fadeIn">{data.total}</h1>
        <h1 className="font-extrabold font-rubik text-5xl animate-fadeIn">{data.club}</h1>
      </>
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
          Sair
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
          onClick={() => navigate(`/result?competicao=${competicao}&isBack=true`)}
          disabled={showFirst}
        >
          Voltar
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
          <img src={logoProjeto} alt="Logo MDA" className="object-cover w-[200px] h-[200px] mr-20" />
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

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { firestore } from '../../configs/firebase';
// // import useWindowSize from 'react-use/lib/useWindowSize';
// import Confetti from 'react-confetti';

// import logoMda from '../../assets/Logo-mda-apac.png';
// import logoRegiao from '../../assets/Logo-regiao-9.png';
// import trofeu1 from '../../assets/Trofeu-1-lugar.png';
// import trofeu2 from '../../assets/Trofeu-2-lugar.png';
// import trofeu3 from '../../assets/Trofeu-3-lugar.png';
// import logoProjeto from '../../assets/Logo-projeto-samuel-2024-nobg.png';

// const Button = ({ onClick, className, children }: any) => (
//   <button className={`hover:bg-slate-700 hover:text-white p-4 rounded text-xl ${className}`} onClick={onClick}>
//     {children}
//   </button>
// );

// const TrophyDisplay = ({ place, trophy, data, show }: any) => (
//   <div className={`flex flex-col items-center ${place === '1º Lugar' ? '-mt-14' : 'mt-5'}`}>
//     <img src={trophy} alt={`${place} Trophy`} className="w-[150px] h-[150px] ml-5 mr-5" />
//     <h2 className="font-extrabold text-7xl">{place}</h2>
//     {show && data && (
//       <>
//         <h1 className="font-extrabold text-9xl tracking-widest">{data.total}</h1>
//         <h1 className="font-bold text-5xl">{data.club}</h1>
//       </>
//     )}
//   </div>
// );

// const RankingView: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const competicao = searchParams.get('competicao');
//   const [ranking, setRanking] = useState<any[]>([]);
//   const [showFirst, setShowFirst] = useState(false);
//   const [showSecond, setShowSecond] = useState(false);
//   const [showThird, setShowThird] = useState(false);

//   useEffect(() => {
//     if (competicao) {
//       getClubRanking(competicao).catch((error) => {
//         console.error('Failed to fetch ranking:', error);
//       });
//     }
//   }, [competicao]);

//   const getClubRanking = async (competition: string) => {
//     let value: string;

//     if (competition === 'musical') {
//       value = 'CONCURSO MUSICAL';
//     } else if (competition === 'samuel') {
//       value = 'PROJETO SAMUEL';
//     } else {
//       throw new Error('Incorrect competition name');
//     }

//     const q = query(collection(firestore, 'scores'), where('competition', '==', value));
//     const querySnapshot = await getDocs(q);
//     const scores: any[] = [];
//     querySnapshot.forEach((doc) => {
//       scores.push({ id: doc.id, ...doc.data() });
//     });

//     const clubRanking: { [key: string]: any[] } = {};

//     scores.forEach((score: any) => {
//       const { club, competition, total } = score;

//       if (!clubRanking[club]) {
//         clubRanking[club] = [];
//       }

//       const existingEntry = clubRanking[club].find((entry) => entry.competition === competition);

//       if (existingEntry) {
//         existingEntry.total += total;
//       } else {
//         clubRanking[club].push({
//           club,
//           competition,
//           total,
//         });
//       }
//     });

//     const finalRanking = Object.values(clubRanking).flat();

//     finalRanking.sort((a, b) => b.total - a.total);

//     setRanking(finalRanking);

//     return finalRanking;
//   };

//   const handleDisplay = () => {
//     if (showThird) {
//       setShowSecond(true);
//       if (showSecond) {
//         setShowFirst(true);
//       }
//     } else {
//       setShowThird(true);
//     }
//   };

//   const data = [
//     { position: 1, club: 'Servos do Rei', points: 150, color: 'bg-yellow-500' },
//     { position: 2, club: 'Semeadores', points: 110, color: 'bg-gray-500' },
//     { position: 3, club: 'Falcão', points: 100, color: 'bg-orange-800' },
//   ];

//   const Ranking = () => {
//     return (
//       <div className="flex flex-col items-center">
//         <div className="gap-2 flex flex-col w-screen  justify-center items-center">
//           <div className="flex gap-[2px] items-end">
//             <div className="w-[11rem] font-semibold text-center">Posição</div>
//             <div className="w-[50rem] font-semibold text-center">Clube</div>
//             <div className="w-[15rem] font-semibold text-center">Pontuação</div>
//           </div>
//           {data.map((item) => (
//             <div key={item.position} className="flex gap-[2px]">
//               <div
//                 className={`px-16 py-10 w-[11rem] font-extrabold text-7xl text-gray-300 rounded-l-full text-center ${item.color}`}
//               >
//                 {item.position}º
//               </div>
//               <div className={`px-16 py-10 w-[50rem] font-extrabold text-7xl text-gray-300 text-center ${item.color}`}>
//                 {item.club}
//               </div>
//               <div
//                 className={`px-10 py-10 w-[15rem] font-extrabold text-7xl text-gray-300 rounded-r-full text-center ${item.color}`}
//               >
//                 {item.points}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       {showFirst && <Confetti numberOfPieces={400} />}
//       <div className="absolute flex flex-col m-5">
//         <button
//           className="mt-4 border-2 border-blue-500 bg-white hover:bg-gray-300 text-blue-500 font-bold py-2 px-4 rounded"
//           onClick={() => navigate('/clubes')}
//         >
//           Voltar
//         </button>
//         <button
//           className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
//           onClick={() => {
//             setShowThird(false);
//             setShowSecond(false);
//             setShowFirst(false);
//           }}
//           disabled={!showThird}
//         >
//           Limpar
//         </button>
//         <button
//           className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
//           onClick={handleDisplay}
//           disabled={showFirst}
//         >
//           Próximo
//         </button>
//       </div>
//       <div className="bg-custom-background bg-fixed flex flex-col items-center">
//         <div className="flex gap-10 mt-16 items-center">
//           <img src={logoProjeto} alt="Logo MDA" className="object-cover w-[180px] h-[180px] mr-10" />
//           {/* <div className="flex flex-col items-center"> */}
//           <h1 className="font-extrabold text-7xl">{competicao === 'samuel' ? 'PROJETO SAMUEL' : 'CONCURSO MUSICAL'}</h1>
//           {/* <h1 className="font-medium text-6xl mt-4"></h1> */}
//           {/* </div> */}
//           <img src={logoRegiao} alt="Logo Regiao" className="w-[200px] h-[200px] mr-20" />
//         </div>
//         <div className="flex justify-center items-center mt-14">
//           <div className="flex gap-32">
//             <Ranking />
//             {/* <TrophyDisplay place="2º Lugar" trophy={trofeu2} data={ranking[1]} show={showSecond} />
//             <TrophyDisplay place="1º Lugar" trophy={trofeu1} data={ranking[0]} show={showFirst} />
//             <TrophyDisplay place="3º Lugar" trophy={trofeu3} data={ranking[2]} show={showThird} /> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RankingView;
