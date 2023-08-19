import { Select, notification } from 'antd';
import { useState } from 'react';
import { MehOutlined, SmileOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import OptionsField from '../../components/OptionsField';
import Navigation from '../../components/Navigation/navigation';
import { Api } from '../../configs/api';
import { AxiosError, AxiosResponse } from 'axios';
import { allClubes } from '../../utils/clubes';
import OptionsInputField from '../../components/OptionsInputField';
import { useLocation } from 'react-router-dom';

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

function App() {
  const API = new Api();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('jurado');

  const [valueClube, setValueClube] = useState('');
  const [tempoUtilizado, setTempoUtilizado] = useState('');
  const [valueCompetition, setValueCompetition] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionsProjetoSamuel, setOptionsProjetoSamuel] = useState(initialOptionsProjetoSamuel);
  const [optionsConcursoMusical, setOptionsConcursoMusical] = useState(initialOptionsConcursoMusical);
  const [api, contextHolder] = notification.useNotification();

  const successNotification = () => {
    api.open({
      message: 'Pontuação salva.',
      icon: <SmileOutlined style={{ color: '#14e910' }} />,
    });
  };

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);

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
        competition: valueCompetition === 1 ? 'CONCURSO MUSICAL' : 'PROJETO SAMUEL',
        club: valueClube,
        name,
        time: tempoUtilizado,
        options,
        total: Object.keys(options).reduce((acc, key) => {
          if (key !== 'tempoUtilizado') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return acc + options![key]!;
          }
          return acc;
        }, 0),
      };
      console.log('body', body);
      // return;
      await API.axios
        .post('scores', body)
        .then((response: AxiosResponse) => {
          console.log(response.data);
          handleReset();
          successNotification();
        })
        .catch((error: AxiosError) => {
          console.error('Erro na requisição:', error);
        });
    } else {
      errorNotification();
      console.log('Preencha todos os campos obrigatórios');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center  p-4">
      <Navigation />
      {contextHolder}
      <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2">
        <h2 className="text-xl font-semibold mb-2">PROJETO SAMUEL</h2>
        <p>APaC - Região 09</p>
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
            <OptionsInputField
              submitted={submitted}
              title="Tempo utilizado"
              value={tempoUtilizado}
              onChange={(e) => setTempoUtilizado(e.target.value)}
            />
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
            <OptionsInputField
              submitted={submitted}
              title="Tempo utilizado"
              value={tempoUtilizado}
              onChange={(e) => setTempoUtilizado(e.target.value)}
            />
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
