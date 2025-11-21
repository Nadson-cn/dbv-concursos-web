import { Slider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import OptionsField from './OptionsField';

const musicaComposicaoPropriaOptions = [
  { label: 'Sim', value: 8 },
  { label: 'Não', value: 0 },
];

type PreConcursoMusicalOptions = {
  musicaComposicaoPropria: number | null;
  temaMusica: number | null;
};

interface PreConcursoMusicalFormProps {
  options: PreConcursoMusicalOptions;
  handleOptionChange: (optionName: keyof PreConcursoMusicalOptions, event: RadioChangeEvent) => void;
  handleSliderChange: (optionName: keyof PreConcursoMusicalOptions, value: number) => void;
  submitted: boolean;
  loading: boolean;
  clubeLabel: string;
}

const PreConcursoMusicalForm: React.FC<PreConcursoMusicalFormProps> = ({
  options,
  handleOptionChange,
  handleSliderChange,
  submitted,
  loading,
  clubeLabel,
}: PreConcursoMusicalFormProps) => {
  return (
    <>
      <OptionsField
        onChange={(value) => handleOptionChange('musicaComposicaoPropria', value)}
        options={musicaComposicaoPropriaOptions}
        title={`MÚSICA DE COMPOSIÇÃO PRÓPRIA: ${options.musicaComposicaoPropria ?? ''}`}
        value={options.musicaComposicaoPropria}
        submitted={submitted}
      />

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">TEMA DA MÚSICA RELACIONADO AO TEMA DO CONCURSO (A PROMESSA): <span className='text-black'>{options.temaMusica}</span></h3>
        <p>Avalie se o tema da música está relacionado ao tema do concurso (A Promessa)</p>
        <Slider
          min={0}
          max={5}
          step={1}
          value={options.temaMusica || 0}
          onChange={(value) => handleSliderChange('temaMusica', value)}
          marks={{
            0: '0',
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
          }}
          tooltip={{ formatter: (value) => `${value} pontos` }}
        />
        {submitted && options.temaMusica === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-xl text-white w-full xl:w-1/2"
        type="submit"
      >
        {loading
          ? 'Salvando...'
          : `Enviar pontuação de ${clubeLabel}`}
      </button>
    </>
  );
};

export default PreConcursoMusicalForm;

