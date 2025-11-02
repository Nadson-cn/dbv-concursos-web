import { useEffect, useState } from 'react';
import { Button, Radio, RadioChangeEvent, Table, Modal, Form, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../configs/firebase';
import ArrowBack from '../../assets/arrow-back.svg';
const { Column } = Table;

export interface ResultType {
  competition: string;
  club: string;
  total: number;
  time: string;
}
export interface JudgeScoreType {
  club: string;
  judgeScores: [{ name: string; score: number }];
}

function Ranking() {
  const navigate = useNavigate();
  const [valueCompetition, setValueCompetition] = useState('PROJETO SAMUEL');
  const [result, setResult] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [judgeScores, setJudgeScores] = useState<any>(null);
  const nameLocalStorage = window.localStorage.getItem('name');

  const [editForm] = Form.useForm();
  const handleChangeCompetition = ({ target: { value } }: RadioChangeEvent) => {
    setValueCompetition(value);
  };

  const fetchData = async () => {
    const q = query(collection(firestore, 'scores-2025'), where('competition', '==', valueCompetition));
    const querySnapshot = await getDocs(q);
    const dadosFirestore: any[] = [];
    querySnapshot.forEach((doc) => {
      dadosFirestore.push({ id: doc.id, ...doc.data() });
    });
    const judgeScore: { [key: string]: any[] } = {};
    const clubRanking: { [key: string]: any[] } = {};

    dadosFirestore.forEach((score: any) => {
      const { club, competition, total, name, id, time } = score;

      if (!clubRanking[club]) {
        clubRanking[club] = [];
      }

      if (!judgeScore[club]) {
        judgeScore[club] = [];
      }

      const existingEntry = clubRanking[club].find((entry) => entry.competition === competition);

      if (existingEntry) {
        existingEntry.total += total;
      } else {
        clubRanking[club].push({
          id,
          club,
          competition,
          total,
          time,
        });
      }

      judgeScore[club].push({
        id,
        name,
        time,
        score: total, // Aqui assumimos que `total` é a pontuação dada pelo jurado
      });
    });

    const finalRanking = Object.values(clubRanking)
      .flat()
      .sort((a, b) => b.total - a.total);

    const judgeScoresArray = Object.keys(judgeScore).map((club) => ({
      club,
      judgeScores: judgeScore[club],
    }));
    setJudgeScores(judgeScoresArray);
    setResult(finalRanking);
    // setResult(dadosFirestore);
  };

  const deleteScore = async (scoreId: string) => {
    try {
      await deleteDoc(doc(firestore, 'scores-2025', scoreId));
      fetchData(); // Re-fetch data to update the state after deletion
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting score: ', error);
    }
  };

  const editScore = async (scoreId: string, newScore: number) => {
    try {
      const scoreDoc = doc(firestore, 'scores-2025', scoreId);
      await updateDoc(scoreDoc, { total: newScore });
      fetchData(); // Re-fetch data to update the state after editing
      setShowModal(false);
    } catch (error) {
      console.error('Error updating score: ', error);
    }
  };

  const confirmDeletion = (scoreId: string) => {
    Modal.confirm({
      title: 'Você tem certeza que deseja excluir esta pontuação?',
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => deleteScore(scoreId),
    });
  };

  useEffect(() => {
    fetchData();
  }, [valueCompetition]);

  const data =
    result &&
    result
      .sort((a: any, b: any) => b.total - a.total)
      .map((item: ResultType, index: number) => ({
        key: (index + 1).toString(),
        clube: item.club,
        pontuacao: item.total,
        time: item.time,
      }));

  return (
    <>
      {showModal && selectedClub && (
        <Modal
          title={`Detalhes - Clube ${selectedClub?.club}`}
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer
        >
          <Table pagination={false} bordered dataSource={selectedClub?.judgeScores} rowKey="name">
            <Column title="Jurado" dataIndex="name" key="name" />
            <Column title="Pontuação" dataIndex="score" key="score" />
            <Column title="Tempo" dataIndex="time" key="time" />
            {nameLocalStorage === 'Nadson' && (
              <Column
                title="Ações"
                dataIndex="acoes"
                key="acoes"
                render={(text, record: { id: string; key: string; clube: string; pontuacao: string }) => (
                  <div className="flex flex-row justify-center items-center gap-2">
                    <Button
                      onClick={() => {
                        console.log('record', record);
                        confirmDeletion(record.id);
                      }}
                    >
                      Excluir
                    </Button>
                    <Button
                      onClick={() => {
                        editForm.setFieldsValue({ newScore: record.pontuacao });
                        Modal.confirm({
                          title: 'Editar Pontuação',
                          content: (
                            <Form form={editForm}>
                              <Form.Item
                                name="newScore"
                                label="Nova Pontuação"
                                rules={[{ required: true, message: 'Insira a nova pontuação' }]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>
                            </Form>
                          ),
                          okText: 'Atualizar',
                          okType: 'default',
                          onOk: () => {
                            const newScore = editForm.getFieldValue('newScore');
                            editScore(record.id, newScore);
                          },
                        });
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                )}
              />
            )}
          </Table>
        </Modal>
      )}
      <div className="flex flex-col items-center">
        <div className="bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/5 border-2 flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-3">
            <img onClick={() => navigate('/home')} src={ArrowBack} width={30} height={30} alt="" />
            <h3 className="text-xl font-semibold">Selecione o concurso</h3>
            <span></span>
          </div>
          <Radio.Group
            options={[
              { label: 'Projeto Samuel', value: 'PROJETO SAMUEL' },
              { label: 'Concurso Musical', value: 'CONCURSO MUSICAL' },
            ]}
            onChange={handleChangeCompetition}
            value={valueCompetition}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <Table size="small" dataSource={data}>
          <Column title="Posição" dataIndex="key" key="key" />
          <Column title="Clube" dataIndex="clube" key="clube" />
          <Column title="Pontuação" dataIndex="pontuacao" key="pontuacao" />
          <Column
            title="Ver Detalhes"
            dataIndex="time"
            key="jurados"
            render={(text, record: { key: string; clube: string; pontuacao: string }) => (
              <Button
                onClick={() => {
                  setSelectedClub(judgeScores.find((judgeScore: any) => judgeScore.club === record.clube));
                  setShowModal(true);
                }}
              >
                Detalhes
              </Button>
            )}
          />
        </Table>
      </div>
    </>
  );
}

export default Ranking;
