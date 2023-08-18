import React from 'react';
import { Space, Table, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

function Ranking() {
  const result = [
    {
      clube: '',
      concuso: '',
      options: {},
      total: 0,
    },
    {
      clube: '',
      concuso: '',
      options: {},
      total: 0,
    },
    {
      clube: '',
      concuso: '',
      options: {},
      total: 0,
    },
  ];

  interface DataType {
    key: React.Key;
    clube: string;
    pontuacao: number;
  }

  const data: DataType[] = [
    {
      key: '1',
      clube: 'Servos do Rei',
      pontuacao: 32,
    },
    {
      key: '2',
      clube: 'Albatroz',
      pontuacao: 42,
    },
    {
      key: '3',
      clube: 'Amigos do Paraiso',
      pontuacao: 80,
    },
  ];
  return (
    <>
      <Table size="large" dataSource={data}>
        <ColumnGroup title="Name">
          <Column title="Posição" dataIndex="key" key="firstName" />
          <Column title="Clube" dataIndex="clube" key="lastName" />
        </ColumnGroup>
        <Column title="Pontuação" dataIndex="pontuacao" key="age" />
      </Table>
    </>
  );
}

export default Ranking;
