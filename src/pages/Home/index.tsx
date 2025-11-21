/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Select, Spin, notification, TimePicker } from 'antd';
import { useEffect, useState } from 'react';
import { MehOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import OptionsField from '../../components/OptionsField';
import Navigation from '../../components/Navigation/navigation';
import ProjetoSamuelForm from '../../components/ProjetoSamuelForm';
import ConcursoMusicalForm from '../../components/ConcursoMusicalForm';
import PreConcursoMusicalForm from '../../components/PreConcursoMusicalForm';
import { allClubes } from '../../utils/clubes';
import { useLocation } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import AnimationSuccess from '../../assets/AnimationSuccess.gif';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

const format = 'mm:ss';

const clubeOptions = allClubes.map((clube) => ({
  value: clube,
  label: clube,
}));

const initialOptionsProjetoSamuel: {
  conteudo: number | null;
  pontualidade: number | null;
  criatividade: number | null;
  aplicacaoBiblica: number | null;
  apresentacao: number | null;
} = {
  conteudo: null,
  pontualidade: null,
  criatividade: null,
  aplicacaoBiblica: null,
  apresentacao: null,
};

const initialOptionsConcursoMusical: {
  participacao: number | null;
  teveSolo: number | null;
  coral: number | null;
  harmonia: number | null;
  afinacao: number | null;
  apresentacao: number | null;
} = {
  participacao: null,
  teveSolo: null,
  coral: null,
  harmonia: null,
  afinacao: null,
  apresentacao: null,
};

const initialOptionsPreConcursoMusical: {
  musicaComposicaoPropria: number | null;
  temaMusica: number | null;
} = {
  musicaComposicaoPropria: null,
  temaMusica: null,
};

const COMPETITION_TYPES = {
  MUSICAL: 1,
  PROJETO_SAMUEL: 2,
  PRE_CONCURSO_MUSICAL: 3,
} as const;

const COMPETITION_NAMES = {
  [COMPETITION_TYPES.MUSICAL]: 'CONCURSO MUSICAL',
  [COMPETITION_TYPES.PROJETO_SAMUEL]: 'PROJETO SAMUEL',
  [COMPETITION_TYPES.PRE_CONCURSO_MUSICAL]: 'PRÉ - CONCURSO MUSICAL',
} as const;

const calculatePontualidade = (seconds: number): number => {
  if (seconds >= 180 && seconds <= 300) return 20;
  if (seconds >= 301 && seconds <= 360) return 10;
  if (seconds >= 0 && seconds <= 179) return 5;
  return 0;
};

const calculateTotal = (options: Record<string, number | null>): number => {
  return Object.entries(options)
    .filter(([key, value]) => key !== 'tempoUtilizado' && value !== null)
    .reduce((acc, [, value]) => acc + (value || 0), 0);
};


function App() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('jurado');
  const nameLocalStorage = window.localStorage.getItem('name');

  const [valueClube, setValueClube] = useState('');
  const [tempoUtilizado, setTempoUtilizado] = useState('');
  const [valueCompetition, setValueCompetition] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionsProjetoSamuel, setOptionsProjetoSamuel] = useState(initialOptionsProjetoSamuel);
  const [optionsConcursoMusical, setOptionsConcursoMusical] = useState(initialOptionsConcursoMusical);
  const [optionsPreConcursoMusical, setOptionsPreConcursoMusical] = useState(initialOptionsPreConcursoMusical);
  const [api, contextHolder] = notification.useNotification();
  const [showSuccess, setShowSuccess] = useState(false);

  // -- CRONOMETRO --
  // Efeito para iniciar e parar o cronômetro
  const [time, setTime] = useState<number>(0); // Tempo total
  const [editTime, setEditTime] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(false); // Cronômetro está ativo?
  const [isPaused, setIsPaused] = useState<boolean>(false); // Cronômetro está pausado?
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // ID do intervalo
  const [timeAnt, setTimeAnt] = useState<dayjs.Dayjs | null>(dayjs('00:00', format));

  useEffect(() => {
    if (isActive && !isPaused) {
      const id = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
      setIntervalId(id);
    } else if (!isActive || isPaused) {
      if (intervalId) clearInterval(intervalId);
    }
    // Função de limpeza para limpar o intervalo
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => setIsPaused(true);

  const handleResume = () => setIsPaused(false);

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0); // Optional: Reset time on stop
  };

  // ----------------
  const errorNotification = () => {
    api.open({
      message: 'Preencha todos os campos',
      icon: <MehOutlined style={{ color: '#e91010' }} />,
    });
  };

  const handleChangeClube = (value: { value: string; label: React.ReactNode }) => {
    setValueClube(value.value);
  };

  const handleChangeCompetition = ({ target: { value } }: RadioChangeEvent) => {
    setValueCompetition(value);
  };

  const handleReset = () => {
    setOptionsProjetoSamuel(initialOptionsProjetoSamuel);
    setOptionsConcursoMusical(initialOptionsConcursoMusical);
    setOptionsPreConcursoMusical(initialOptionsPreConcursoMusical);
    setValueCompetition(null);
    setSubmitted(false);
    setValueClube('');
    setTempoUtilizado('');
    setTimeAnt(null);
    setIntervalId(null);
    setIsPaused(false);
    setIsActive(false);
    setEditTime(false);
    setTime(0);
    handleStop();
  };

  const handleOptionProjetoSamuelChange = (
    optionName: keyof typeof initialOptionsProjetoSamuel,
    { target: { value } }: RadioChangeEvent,
  ) => {
    setOptionsProjetoSamuel((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const handleSliderProjetoSamuelChange = (
    optionName: keyof typeof initialOptionsProjetoSamuel,
    value: number,
  ) => {
    setOptionsProjetoSamuel((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const handleOptionConcursoMusicalChange = (
    optionName: keyof typeof initialOptionsConcursoMusical,
    { target: { value } }: RadioChangeEvent,
  ) => {
    setOptionsConcursoMusical((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const handleSliderConcursoMusicalChange = (
    optionName: keyof typeof initialOptionsConcursoMusical,
    value: number,
  ) => {
    setOptionsConcursoMusical((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const handleOptionPreConcursoMusicalChange = (
    optionName: keyof typeof initialOptionsPreConcursoMusical,
    { target: { value } }: RadioChangeEvent,
  ) => {
    setOptionsPreConcursoMusical((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const handleSliderPreConcursoMusicalChange = (
    optionName: keyof typeof initialOptionsPreConcursoMusical,
    value: number,
  ) => {
    setOptionsPreConcursoMusical((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };


  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('submit');
    e.preventDefault();

    setSubmitted(true);
    setLoading(true);
    setShowSuccess(false);

    let requiredFields;
    let options;

    if (valueCompetition === 2) {
      options = optionsProjetoSamuel;
      requiredFields = [
        optionsProjetoSamuel.conteudo,
        optionsProjetoSamuel.pontualidade,
        optionsProjetoSamuel.criatividade,
        optionsProjetoSamuel.aplicacaoBiblica,
        optionsProjetoSamuel.apresentacao,
      ];
    } else if (valueCompetition === 3) {
      options = optionsPreConcursoMusical;
      requiredFields = [
        optionsPreConcursoMusical.musicaComposicaoPropria,
        optionsPreConcursoMusical.temaMusica,
      ];
    } else {
      options = optionsConcursoMusical;
      requiredFields = [
        optionsConcursoMusical.participacao,
        optionsConcursoMusical.coral,
        optionsConcursoMusical.harmonia,
        optionsConcursoMusical.afinacao,
        optionsConcursoMusical.apresentacao,
      ];
    }

    // Validação dos campos obrigatórios
    if (!valueClube || !requiredFields.every((field) => field !== null)) {
      errorNotification();
      console.log('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    // Determinar nome da competição de forma mais segura
    const getCompetitionName = (value: number | null): string => {
      if (value === COMPETITION_TYPES.MUSICAL) return COMPETITION_NAMES[COMPETITION_TYPES.MUSICAL];
      if (value === COMPETITION_TYPES.PROJETO_SAMUEL) return COMPETITION_NAMES[COMPETITION_TYPES.PROJETO_SAMUEL];
      // PRE_CONCURSO_MUSICAL salva como "CONCURSO MUSICAL" no banco
      if (value === COMPETITION_TYPES.PRE_CONCURSO_MUSICAL) return COMPETITION_NAMES[COMPETITION_TYPES.MUSICAL];
      return 'PROJETO SAMUEL'; // fallback
    };

    const body = {
      competition: getCompetitionName(valueCompetition),
      club: valueClube,
      name: name || nameLocalStorage,
      time: tempoUtilizado,
      options,
      total: calculateTotal(options),
      submittedAt: new Date(),
    };

    console.log('body', body);

    try {
      await addDoc(collection(firestore, 'scores-2025'), body);
      setShowSuccess(true);
      handleReset();
      await delay(1600);
      setShowSuccess(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      api.open({
        message: 'Erro ao salvar dados',
        description: 'Tente novamente em alguns instantes',
        type: 'error',
      });
    } finally {
      // Sempre executar, independente de sucesso ou erro
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#f0ebf8] p-4">
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}

      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <img src={AnimationSuccess} width={90} height={90} alt="Sucesso." />
            <h2 className="text-xl font-bold">Sucesso!</h2>
            <p>Pontuação salva.</p>
          </div>
        </div>
      )}
      <Navigation />
      {contextHolder}
      <div className="mt-5 bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h2 className="text-xl font-semibold mb-2">CONCURSOS 2025</h2>
        <p>APaC - Região 09</p>
      </div>

      <form onSubmit={(e) => onSubmit(e)} className="w-full flex flex-col items-center">
        <OptionsField
          onChange={handleChangeCompetition}
          options={[
            { label: 'Projeto Samuel', value: 2 },
            { label: 'Concurso Musical', value: 1 },
            { label: 'Pré - Concurso Musical', value: 3 },
          ]}
          title="Escolha o Concurso:"
          value={valueCompetition}
          submitted={submitted}
        />
        {valueCompetition !== null ? (
          <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
            <h3 className="text-xl font-semibold mb-2">Selecione o clube: </h3>
            <Select
              labelInValue
              defaultValue={{ value: '', label: 'Escolha um clube' }}
              style={{ width: 300, display: 'flex', flexDirection: 'column' }}
              onChange={handleChangeClube}
              options={clubeOptions}
            />
          </div>
        ) : null}

        {valueClube === '' ? null : valueCompetition === 2 ? (
          <ProjetoSamuelForm
            options={optionsProjetoSamuel}
            handleOptionChange={handleOptionProjetoSamuelChange}
            handleSliderChange={handleSliderProjetoSamuelChange}
            submitted={submitted}
            loading={loading}
            clubeLabel={clubeOptions.find((option) => option.value === valueClube)?.label || ''}
            time={time}
            isActive={isActive}
            isPaused={isPaused}
            editTime={editTime}
            handleStart={handleStart}
            handlePause={handlePause}
            handleResume={handleResume}
            handleStop={handleStop}
          />
        ) : valueCompetition === 1 ? (
          <ConcursoMusicalForm
            options={optionsConcursoMusical}
            handleOptionChange={handleOptionConcursoMusicalChange}
            handleSliderChange={handleSliderConcursoMusicalChange}
            submitted={submitted}
            loading={loading}
            clubeLabel={clubeOptions.find((option) => option.value === valueClube)?.label || ''}
          />
        ) : valueCompetition === 3 ? (
          <PreConcursoMusicalForm
            options={optionsPreConcursoMusical}
            handleOptionChange={handleOptionPreConcursoMusicalChange}
            handleSliderChange={handleSliderPreConcursoMusicalChange}
            submitted={submitted}
            loading={loading}
            clubeLabel={clubeOptions.find((option) => option.value === valueClube)?.label || ''}
          />
        ) : null
        }
      </form >
    </div >
  );
}

export default App;
