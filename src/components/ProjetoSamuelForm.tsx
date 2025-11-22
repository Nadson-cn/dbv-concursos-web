import { Slider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import OptionsField from './OptionsField';

const conteudoOptions = [
  { label: 'Abrangeu o tema proposto', value: 20 },
  { label: 'Não falou diretamente o tema', value: 10 },
  { label: 'Não abordou o tema', value: 5 },
];

const pontualidadeOptions = [
  { label: 'Mais de 6 minutos', value: 0 },
  { label: 'Entre 5 e 6 minutos', value: 10 },
  { label: 'Entre 3 e 5 minutos', value: 20 },
  { label: 'Até 3 min', value: 5 },
];

const espiritoDeProfeciaOptions = [
  { label: 'Sim', value: 5 },
  { label: 'Não', value: 0 }
];

type ProjetoSamuelOptions = {
  conteudo: number | null;
  pontualidade: number | null;
  criatividade: number | null;
  aplicacaoBiblica: number | null;
  apresentacao: number | null;
  espiritoDeProfecia: number | null;
};

interface ProjetoSamuelFormProps {
  options: ProjetoSamuelOptions;
  handleOptionChange: (optionName: keyof ProjetoSamuelOptions, event: RadioChangeEvent) => void;
  handleSliderChange: (optionName: keyof ProjetoSamuelOptions, value: number) => void;
  submitted: boolean;
  loading: boolean;
  clubeLabel: string;
  time: number;
  isActive: boolean;
  isPaused: boolean;
  editTime: boolean;
  handleStart: () => void;
  handlePause: () => void;
  handleResume: () => void;
  handleStop: () => void;
}

const ProjetoSamuelForm: React.FC<ProjetoSamuelFormProps> = ({
  options,
  handleOptionChange,
  handleSliderChange,
  submitted,
  loading,
  clubeLabel,
  time,
  isActive,
  isPaused,
  editTime,
  handleStart,
  handlePause,
  handleResume,
  handleStop,
}: ProjetoSamuelFormProps) => {
  return (
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
        </div>
      )}
      <OptionsField
        onChange={(value) => handleOptionChange('conteudo', value)}
        options={conteudoOptions}
        title={`CONTEÚDO: ${options.conteudo ?? ''}`}
        value={options.conteudo}
        submitted={submitted}
      />

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">CRIATIVIDADE: <span className='text-black'>{options.criatividade}</span></h3>
        <p>Uso criativo de recursos audiovisuais
          e métodos inovadores para apresentação do sermão.</p>
        <Slider
          min={0}
          max={15}
          step={1}
          value={options.criatividade || 0}
          onChange={(value) => handleSliderChange('criatividade', value)}
          marks={{
            0: '0',
            3: '3',
            6: '6',
            9: '9',
            12: '12',
            15: '15',
          }}
          tooltip={{ formatter: (value) => `${value} pontos` }}
        />
        {submitted && options.criatividade === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">APLICAÇÃO BÍBLICA: <span className='text-black'>{options.aplicacaoBiblica}</span></h3>
        <p>Abordagem bíblica do tema, Palavra de Deus como base
          do conteúdo apresentado e utilização da Bíblia durante o
          sermão.</p>
        <Slider
          min={0}
          max={20}
          step={1}
          value={options.aplicacaoBiblica || 0}
          onChange={(value) => handleSliderChange('aplicacaoBiblica', value)}
          marks={{
            0: '0',
            5: '5',
            10: '10',
            15: '15',
            20: '20',
          }}
          tooltip={{ formatter: (value) => `${value} pontos` }}
        />
        {submitted && options.aplicacaoBiblica === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>

      <OptionsField
        onChange={(value) => handleOptionChange('espiritoDeProfecia', value)}
        options={espiritoDeProfeciaOptions}
        title={`FEZ USO DO ESPÍRITO DE PROFECIA: ${options.espiritoDeProfecia ?? ''}`}
        value={options.espiritoDeProfecia}
        submitted={submitted}
      />

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">APRESENTAÇÃO: <span className='text-black'>{options.apresentacao}</span></h3>
        <p>Dinamismo, oratória, gesticulação e
          desenvoltura. Uso de ilustrações e outros meios que
          tornem a apresentação do tema fluida e cativante.</p>
        <Slider
          min={0}
          max={25}
          step={1}
          value={options.apresentacao || 0}
          onChange={(value) => handleSliderChange('apresentacao', value)}
          marks={{
            0: '0',
            5: '5',
            10: '10',
            15: '15',
            20: '20',
            25: '25',
          }}
          tooltip={{ formatter: (value) => `${value} pontos` }}
        />
        {submitted && options.apresentacao === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>
      <OptionsField
        onChange={(value) => handleOptionChange('pontualidade', value)}
        options={pontualidadeOptions}
        title={`PONTUALIDADE: ${options.pontualidade ?? ''}`}
        value={options.pontualidade}
        submitted={submitted}
      />
      {editTime && (
        <></>
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
          : `Enviar pontuação de ${clubeLabel}`}
      </button>
    </>
  );
};

export default ProjetoSamuelForm;

