import { Select, notification } from 'antd';
import { useState } from 'react';
import { MehOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import OptionsField from '../../components/OptionsField';

const clubeOptions = [
  {
    value: 'AguiaReal',
    label: 'Águia Real',
  },
  {
    value: 'AmigosdoParaíso',
    label: 'Amigos do Paraíso',
  },
  {
    value: 'Albatroz',
    label: 'Albatroz',
  },
  {
    value: 'GuardioesDaAlvorada',
    label: 'Guardiões da Alvorada',
  },
  {
    value: 'Sírius',
    label: 'Sírius',
  },
  {
    value: 'ExercitoReal',
    label: 'Exército Real',
  },
  {
    value: 'Falcão',
    label: 'Falcão',
  },
  {
    value: 'GuerreirosDaFe',
    label: 'Guerreiros da Fé',
  },
  {
    value: 'LeoesDosPinheiros',
    label: 'Leões dos Pinheiros',
  },
  {
    value: 'LuzDoUniverso',
    label: 'Luz do Universo',
  },
  {
    value: 'Semeadores',
    label: 'Semeadores',
  },
  {
    value: 'ServosDoRei',
    label: 'Servos do Rei',
  },
  {
    value: 'VitoriaRegia',
    label: 'Vitória Régia',
  },
];

const commonOptions = [
  { label: 'Excelente', value: 10 },
  { label: 'Ótimo', value: 8 },
  { label: 'Bom', value: 6 },
  { label: 'Regular', value: 4 },
];

const initialOptionsProjetoSamuel = {
  concurso: null,
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

function App() {
  const [valueClube, setValueClube] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [optionsProjetoSamuel, setOptionsProjetoSamuel] = useState(initialOptionsProjetoSamuel);
  const [optionsConcursoMusical, setOptionsConcursoMusical] = useState(initialOptionsConcursoMusical);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Preencha todos os campos',
      icon: <MehOutlined style={{ color: '#e91010' }} />,
    });
  };

  const handleChangeClube = (value: { value: string; label: React.ReactNode }) => {
    setValueClube(value.value);
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    let requiredFields;
    let options;

    if (optionsProjetoSamuel.concurso === 2) {
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
      ];
    }

    if (valueClube && requiredFields.every((field) => field !== null)) {
      const body = {
        concurso: 'PROJETO SAMUEL',
        clube: valueClube,
        options,
        total: Object.entries(options).reduce((acc, [key, value]) => {
          if (key !== 'concurso') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return acc + value!;
          }
          return acc;
        }, 0),
      };
      console.log('body', body);
      setOptionsProjetoSamuel(initialOptionsProjetoSamuel);
      setOptionsConcursoMusical(initialOptionsConcursoMusical);
      setValueClube('');
    } else {
      openNotification();
      console.log('Preencha todos os campos obrigatórios');
    }
  };

  return (
    <div className="flex flex-col items-center  p-4">
      {contextHolder}
      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h2 className="text-xl font-semibold mb-2">PROJETO SAMUEL</h2>
        <p>APaC - Região 09</p>
      </div>
      <form onSubmit={(e) => onSubmit(e)} className="w-full flex flex-col items-center">
        <OptionsField
          onChange={(value) => handleOptionProjetoSamuelChange('concurso', value)}
          options={[
            { label: 'Projeto Samuel', value: 2 },
            { label: 'Concurso Musical', value: 1 },
          ]}
          title="Escolha o Concurso:"
          value={optionsProjetoSamuel.concurso}
          submitted={submitted}
        />
        {optionsProjetoSamuel.concurso !== null ? (
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

        {valueClube === '' ? null : optionsProjetoSamuel.concurso === 2 ? (
          <>
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
              title="Citação E.P.:"
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
            <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-white w-full xl:w-1/2" type="submit">
              {`Classificar ${clubeOptions.find((option) => option.value === valueClube)?.label}`}
            </button>
          </>
        ) : (
          <>
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

            <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded text-white w-full xl:w-1/2" type="submit">
              {`Classificar ${clubeOptions.find((option) => option.value === valueClube)?.label}`}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default App;
