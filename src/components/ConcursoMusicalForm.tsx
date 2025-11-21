import { Slider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import OptionsField from './OptionsField';

const participacaoOptions = [
  { label: 'Desbravadores e até 20% da liderança', value: 7 },
  { label: 'Desbravadores e 100% liderança', value: 4 },
  { label: 'Apenas liderança', value: 2 },
];

const teveSoloOptions = [
  { label: 'Sim', value: 0 },
  { label: 'Não', value: 5 }
];

type ConcursoMusicalOptions = {
  participacao: number | null;
  teveSolo: number | null;
  coral: number | null;
  harmonia: number | null;
  afinacao: number | null;
  apresentacao: number | null;
};

interface ConcursoMusicalFormProps {
  options: ConcursoMusicalOptions;
  handleOptionChange: (optionName: keyof ConcursoMusicalOptions, event: RadioChangeEvent) => void;
  handleSliderChange: (optionName: keyof ConcursoMusicalOptions, value: number) => void;
  submitted: boolean;
  loading: boolean;
  clubeLabel: string;
}

const ConcursoMusicalForm: React.FC<ConcursoMusicalFormProps> = ({
  options,
  handleOptionChange,
  handleSliderChange,
  submitted,
  loading,
  clubeLabel,
}: ConcursoMusicalFormProps) => {
  return (
    <>
      <OptionsField
        onChange={(value) => handleOptionChange('participacao', value)}
        options={participacaoOptions}
        title={`PARTICIPAÇÃO: ${options.participacao ?? ''}`}
        value={options.participacao}
        submitted={submitted}
      />

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">CORAL: <span className='text-black'>{options.coral}</span></h3>
        <p>Uniformidade
          (todos os integrantes devem estar de gala; os
          desbravadores que não possuírem
          o uniforme oficial devem estar com a camisa de
          atividades do clube; se o
          clube não possuir camisa de atividades, o clube pode
          padronizar uma cor de vestimenta para todos)</p>
        <Slider
          min={0}
          max={10}
          step={1}
          value={options.coral || 0}
          onChange={(value) => handleSliderChange('coral', value)}
          marks={{
            0: '0',
            2: '2',
            4: '4',
            6: '6',
            8: '8',
            10: '10',
          }}
          tooltip={{ formatter: (value) => `${value} pontos` }}
        />
        {submitted && options.coral === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">HARMONIA: <span className='text-black'>{options.harmonia}</span></h3>
        <p>Qualidade do conjunto harmonioso de vozes no coral. <b>Não deve haver solos durante a apresentação.</b> Caso haja solos em partes da música o clube <b>perderá 5 pontos neste item</b>.</p>
        <Slider
          min={0}
          max={15}
          step={1}
          value={options.harmonia || 0}
          onChange={(value) => handleSliderChange('harmonia', value)}
          marks={{
            0: '0',
            5: '5',
            10: '10',
            15: '15',
            // 20: '20',
          }}
          tooltip={{ formatter: (value) => `${value} pontos` }}
        />

        {submitted && options.harmonia === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>
      <OptionsField
        onChange={(value) => handleOptionChange('teveSolo', value)}
        options={teveSoloOptions}
        title={`TEVE SOLO: ${options.teveSolo ?? ''}`}
        value={options.teveSolo}
        submitted={submitted}
      />

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">AFINAÇÃO: <span className='text-black'>{options.afinacao}</span></h3>
        <p>Qualidade técnica das vozes do coral ao longo da apresentação</p>
        <Slider
          min={0}
          max={25}
          step={1}
          value={options.afinacao || 0}
          onChange={(value) => handleSliderChange('afinacao', value)}
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
        {submitted && options.afinacao === null && (
          <p className="text-red-500 text-sm mt-2">Campo obrigatório</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h3 className="text-xl font-semibold mb-2">APRESENTAÇÃO: <span className='text-black'>{options.apresentacao}</span></h3>
        <p>Energia, intensidade do canto, gesticulação, dinamismo e
          postura do coral. A criatividade será pontuada neste item
          (o uso de LIBRAS, materiais de apoio, encenação ou outros
          meios criativos <b>não são obrigatórios</b>, mas <b>podem contribuir</b> na Nota Final a partir deste item).</p>
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

export default ConcursoMusicalForm;
