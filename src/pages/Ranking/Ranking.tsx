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
  submittedAt: string;
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
    const clubNameMap: { [key: string]: string } = {}; // Map lowercase to original name

    dadosFirestore.forEach((score: any) => {
      const { club, competition, total, name, id, submittedAt } = score;
      const clubKey = club.toLowerCase(); // Normalize to lowercase for grouping

      // Store the first occurrence of the club name (original casing)
      if (!clubNameMap[clubKey]) {
        clubNameMap[clubKey] = club;
      }

      if (!clubRanking[clubKey]) {
        clubRanking[clubKey] = [];
      }

      if (!judgeScore[clubKey]) {
        judgeScore[clubKey] = [];
      }

      const existingEntry = clubRanking[clubKey].find((entry) => entry.competition === competition);

      if (existingEntry) {
        existingEntry.total += total;
      } else {
        clubRanking[clubKey].push({
          id,
          club: clubNameMap[clubKey], // Use the original name for display
          competition,
          total,
          submittedAt,
        });
      }

      judgeScore[clubKey].push({
        id,
        name,
        submittedAt,
        score: total, // Aqui assumimos que `total` é a pontuação dada pelo jurado
      });
    });

    const finalRanking = Object.values(clubRanking)
      .flat()
      .map((item) => ({
        ...item,
        total: Math.round(item.total * 10) / 10, // Round to 1 decimal place
      }))
      .sort((a, b) => b.total - a.total);

    const judgeScoresArray = Object.keys(judgeScore).map((clubKey) => ({
      club: clubNameMap[clubKey], // Use the original name for display
      judgeScores: judgeScore[clubKey].map((score) => ({
        ...score,
        score: Math.round(score.score * 10) / 10, // Round to 1 decimal place
      })),
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
        pontuacao: item.total.toFixed(1), // Display with 1 decimal place
        submittedAt: item.submittedAt,
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
            <Column
              title="Pontuação"
              dataIndex="score"
              key="score"
              render={(score) => typeof score === 'number' ? score.toFixed(1) : score}
            />
            <Column
              title="Enviado em"
              dataIndex="submittedAt"
              key="submittedAt"
              render={(submittedAt) => {
                if (!submittedAt) return '-';
                try {
                  // Se for um Timestamp do Firestore
                  if (submittedAt.seconds) {
                    const date = new Date(submittedAt.seconds * 1000);
                    return date.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      // year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  }
                  // Se for um objeto Date
                  if (submittedAt instanceof Date) {
                    return submittedAt.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      // year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  }
                  // Se for uma string
                  return new Date(submittedAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    // year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                } catch (error) {
                  console.error('Erro ao formatar data:', error);
                  return '-';
                }
              }}
            />
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
