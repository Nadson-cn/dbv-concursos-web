/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Select, Spin, notification, TimePicker } from 'antd';
import { useEffect, useState } from 'react';
import { MehOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import OptionsField from '../../components/OptionsField';
import Navigation from '../../components/Navigation/navigation';
import { allClubes } from '../../utils/clubes';
import OptionsInputField from '../../components/OptionsInputField';
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

const commonOptions = [
  { label: 'Excelente', value: 10 },
  { label: 'Ótimo', value: 8 },
  { label: 'Bom', value: 6 },
  { label: 'Regular', value: 4 },
];

const initialOptionsProjetoSamuel = {
  uniforme: null,
  tempo: null,
  conteudo: null,
  usoBiblia: null,
  citacao: null,
  aplicacaoBiblia: null,
  dinamismo: null,
  gestos: null,
  criatividade: null,
  ilustracoes: null,
};

const initialOptionsConcursoMusical = {
  membros: null,
  organizacao: null,
  musica: null,
  grauDificuldade: null,
  afinacao: null,
  harmonia: null,
  criatividade: null,
  dinamismo: null,
  gestos: null,
  ilustracoes: null,
};

const COMPETITION_TYPES = {
  MUSICAL: 1,
  PROJETO_SAMUEL: 2,
} as const;

const COMPETITION_NAMES = {
  [COMPETITION_TYPES.MUSICAL]: 'CONCURSO MUSICAL',
  [COMPETITION_TYPES.PROJETO_SAMUEL]: 'PROJETO SAMUEL',
} as const;

// Função auxiliar também fora do componente
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

  const secondsToTimePickerValue = (seconds: number): dayjs.Dayjs => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return dayjs().minute(minutes).second(remainingSeconds); // Cria um objeto dayjs com os minutos e segundos
  };

  const handleSaveTime = () => {
    const fomatted = secondsToTimePickerValue(time);
    // setSecondsTime(time);
    setTempoUtilizado(formatSeconds(time));
    setTimeAnt(fomatted); // Atualize o campo de tempo utilizado com o tempo atual do cronômetro
    setEditTime(true);
  };

  const handleChange = (value: dayjs.Dayjs | null) => {
    console.log('value', value);
    setTimeAnt(value); // Atualiza o estado com o novo valor

    if (value) {
      const hours = value.hour(); // Obtém a hora
      const minutes = value.minute(); // Obtém os minutos
      const totalSeconds = hours * 3600 + minutes * 60; // Converte para segundos
      setTempoUtilizado(formatSeconds(totalSeconds));

      console.log('Minutos:', minutes);
      console.log('Total em segundos:', totalSeconds);
    }
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

  const handleOptionConcursoMusicalChange = (
    optionName: keyof typeof initialOptionsConcursoMusical,
    { target: { value } }: RadioChangeEvent,
  ) => {
    setOptionsConcursoMusical((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
        optionsProjetoSamuel.uniforme,
        optionsProjetoSamuel.tempo,
        optionsProjetoSamuel.conteudo,
        optionsProjetoSamuel.usoBiblia,
        optionsProjetoSamuel.citacao,
        optionsProjetoSamuel.aplicacaoBiblia,
        optionsProjetoSamuel.dinamismo,
        optionsProjetoSamuel.gestos,
        optionsProjetoSamuel.criatividade,
        optionsProjetoSamuel.ilustracoes,
        tempoUtilizado,
      ];
    } else {
      options = optionsConcursoMusical;
      requiredFields = [
        optionsConcursoMusical.afinacao,
        optionsConcursoMusical.criatividade,
        optionsConcursoMusical.dinamismo,
        optionsConcursoMusical.gestos,
        optionsConcursoMusical.grauDificuldade,
        optionsConcursoMusical.harmonia,
        optionsConcursoMusical.ilustracoes,
        optionsConcursoMusical.membros,
        optionsConcursoMusical.musica,
        optionsConcursoMusical.organizacao,
        tempoUtilizado,
      ];
    }

    // Validação dos campos obrigatórios
    if (!valueClube || !requiredFields.every((field) => field !== null) || tempoUtilizado === '') {
      errorNotification();
      console.log('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    // Determinar nome da competição de forma mais segura
    const getCompetitionName = (value: number | null): string => {
      if (value === COMPETITION_TYPES.MUSICAL) return COMPETITION_NAMES[COMPETITION_TYPES.MUSICAL];
      if (value === COMPETITION_TYPES.PROJETO_SAMUEL) return COMPETITION_NAMES[COMPETITION_TYPES.PROJETO_SAMUEL];
      return 'PROJETO SAMUEL'; // fallback
    };

    const body = {
      competition: getCompetitionName(valueCompetition),
      club: valueClube,
      name: name || nameLocalStorage,
      time: tempoUtilizado,
      options,
      total: calculateTotal(options),
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
      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <p className="text-base font-normal mb-2">
          <ul>
            <li>Excelente (10 pontos) | Ótimo (8 pontos)</li>
            <li>Bom (6 pontos) | Regular (4 pontos)</li>
          </ul>
        </p>
      </div>

      <form onSubmit={(e) => onSubmit(e)} className="w-full flex flex-col items-center">
        <OptionsField
          onChange={handleChangeCompetition}
          options={[
            { label: 'Projeto Samuel', value: 2 },
            { label: 'Concurso Musical', value: 1 },
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
          <>
            <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
              <h3 className="text-xl font-semibold mb-2">
                Tema do Projeto Samuel 2025: <p className="italic">A Promessa</p>
              </h3>
            </div>
            {!editTime && (
              <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
                <div className="flex flex-col gap-4 text-xl font-bold mb-2">
                  <p>
                    Cronômetro: {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)} Minutos
                  </p>
                  {/* CRONOMETRO */}
                  <div className="flex">
                    {!isActive ? (
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                        onClick={handleStart}
                      >
                        Iniciar
                      </button>
                    ) : isPaused ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                          onClick={handleResume}
                        >
                          Retomar
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                          onClick={handleStop}
                        >
                          Resetar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                          onClick={handlePause}
                        >
                          Pausar
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                          onClick={handleStop}
                        >
                          Resetar
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* FIM - CRONOMETRO */}
              </div>
            )}
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('uniforme', value)}
              options={commonOptions}
              title="Uniforme Oficial:"
              value={optionsProjetoSamuel.uniforme}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('tempo', value)}
              options={commonOptions}
              title="Tempo:"
              value={optionsProjetoSamuel.tempo}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('conteudo', value)}
              options={commonOptions}
              title="Conteudo:"
              value={optionsProjetoSamuel.conteudo}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('usoBiblia', value)}
              options={commonOptions}
              title="Uso da Bíblia:"
              value={optionsProjetoSamuel.usoBiblia}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('citacao', value)}
              options={commonOptions}
              title="Citação Espirito de Profêcia:"
              value={optionsProjetoSamuel.citacao}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('aplicacaoBiblia', value)}
              options={commonOptions}
              title="Aplicação Bíblica:"
              value={optionsProjetoSamuel.aplicacaoBiblia}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('criatividade', value)}
              options={commonOptions}
              title="Criatividade:"
              value={optionsProjetoSamuel.criatividade}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('dinamismo', value)}
              options={commonOptions}
              title="Dinamismo:"
              value={optionsProjetoSamuel.dinamismo}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('gestos', value)}
              options={commonOptions}
              title="Gestos:"
              value={optionsProjetoSamuel.gestos}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionProjetoSamuelChange('ilustracoes', value)}
              options={commonOptions}
              title="Ilustrações:"
              value={optionsProjetoSamuel.ilustracoes}
              submitted={submitted}
            />
            {editTime && (
              <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Tempo utilizado - mm:ss</h3>
                <TimePicker
                  defaultValue={dayjs('00:00', format)}
                  size="large"
                  value={timeAnt} // Define o valor atual do TimePicker
                  format={format} // Define o formato para exibição
                  onChange={(value: any) => handleChange(value)} // Atualiza o valor no estado
                  minuteStep={1}
                  secondStep={1}
                  changeOnScroll={true}
                  showNow={false}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onFocus={(event) => {
                    event.preventDefault();
                    event.target.blur();
                  }}
                />
              </div>
            )}
            <div
              className={`${editTime ? 'hidden' : 'flex flex-col'} bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2`}
            >
              <div className="flex items-center py-5 justify-between">
                <h3 className="text-xl font-semibold mb-2">Tempo utilizado</h3>
              </div>
              <div className="flex-col gap-4 text-xl font-bold mb-2">
                <p>
                  Cronômetro: {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)} Minutos
                </p>
                {/* CRONOMETRO */}
                <div className="flex">
                  {!isActive ? (
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                      onClick={handleStart}
                    >
                      Iniciar
                    </button>
                  ) : isPaused ? (
                    <>
                      <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                        onClick={handleResume}
                      >
                        Retomar
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 hover:bg-green-600 p-2 rounded text-white"
                        onClick={handleSaveTime}
                      >
                        Salvar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                        onClick={handlePause}
                      >
                        Pausar
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                        onClick={handleStop}
                      >
                        Resetar
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* FIM - CRONOMETRO */}
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-xl text-white w-full xl:w-1/2"
              type="submit"
            >
              {loading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {loading
                ? 'Salvando...'
                : `Classificar ${clubeOptions.find((option) => option.value === valueClube)?.label}`}
            </button>
          </>
        ) : (
          <>
            {!editTime && (
              <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
                <div className="flex flex-col gap-4 text-xl font-bold mb-2">
                  <p>
                    Cronômetro: {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)} Minutos
                  </p>
                  {/* CRONOMETRO */}
                  <div className="flex">
                    {!isActive ? (
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                        onClick={handleStart}
                      >
                        Iniciar
                      </button>
                    ) : isPaused ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                          onClick={handleResume}
                        >
                          Retomar
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                          onClick={handleStop}
                        >
                          Resetar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                          onClick={handlePause}
                        >
                          Pausar
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                          onClick={handleStop}
                        >
                          Resetar
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* FIM - CRONOMETRO */}
              </div>
            )}
            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('membros', value)}
              options={commonOptions}
              title="Membros:"
              value={optionsConcursoMusical.membros}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('organizacao', value)}
              options={commonOptions}
              title="Organização:"
              value={optionsConcursoMusical.organizacao}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('musica', value)}
              options={commonOptions}
              title="Musica:"
              value={optionsConcursoMusical.musica}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('grauDificuldade', value)}
              options={commonOptions}
              title="Grau de Dificuldade:"
              value={optionsConcursoMusical.grauDificuldade}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('afinacao', value)}
              options={commonOptions}
              title="Afinação:"
              value={optionsConcursoMusical.afinacao}
              submitted={submitted}
            />

            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('harmonia', value)}
              options={commonOptions}
              title="Harmonia:"
              value={optionsConcursoMusical.harmonia}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('criatividade', value)}
              options={commonOptions}
              title="Criatividade:"
              value={optionsConcursoMusical.criatividade}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('dinamismo', value)}
              options={commonOptions}
              title="Dinamismo:"
              value={optionsConcursoMusical.dinamismo}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('gestos', value)}
              options={commonOptions}
              title="Gestos:"
              value={optionsConcursoMusical.gestos}
              submitted={submitted}
            />
            <OptionsField
              onChange={(value) => handleOptionConcursoMusicalChange('ilustracoes', value)}
              options={commonOptions}
              title="Ilustrações:"
              value={optionsConcursoMusical.ilustracoes}
              submitted={submitted}
            />
            {editTime && (
              <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Tempo utilizado - mm:ss</h3>
                <TimePicker
                  defaultValue={dayjs('00:00', format)}
                  size="large"
                  value={timeAnt} // Define o valor atual do TimePicker
                  format={format} // Define o formato para exibição
                  onChange={(value: any) => handleChange(value)} // Atualiza o valor no estado
                  minuteStep={1}
                  secondStep={1}
                  changeOnScroll={true}
                  showNow={false}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  onFocus={(event) => {
                    event.preventDefault();
                    event.target.blur();
                  }}
                />
              </div>
            )}
            <div
              className={`${editTime ? 'hidden' : 'flex flex-col'} bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2`}
            >
              <div className="flex items-center py-5 justify-between">
                <h3 className="text-xl font-semibold mb-2">Tempo utilizado</h3>
              </div>
              <div className="flex-col gap-4 text-xl font-bold mb-2">
                <p>
                  Cronômetro: {Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)} Minutos
                </p>
                {/* CRONOMETRO */}
                <div className="flex">
                  {!isActive ? (
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white"
                      onClick={handleStart}
                    >
                      Iniciar
                    </button>
                  ) : isPaused ? (
                    <>
                      <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                        onClick={handleResume}
                      >
                        Retomar
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 hover:bg-green-600 p-2 rounded text-white"
                        onClick={handleSaveTime}
                      >
                        Salvar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white mx-2"
                        onClick={handlePause}
                      >
                        Pausar
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                        onClick={handleStop}
                      >
                        Resetar
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* FIM - CRONOMETRO */}
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-xl text-white w-full xl:w-1/2"
              type="submit"
            >
              {loading
                ? 'Salvando...'
                : `Classificar ${clubeOptions.find((option) => option.value === valueClube)?.label}`}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default App;
