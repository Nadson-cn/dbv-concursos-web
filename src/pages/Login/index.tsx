import React, { useState } from 'react';
import { Button, Input, Select, Space, Switch, notification } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, MehOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logoProjeto from '../../assets/Logo-projeto-samuel-2023.png';
const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isOtherName, setIsOtherName] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const errorNotification = () => {
    api.open({
      message: 'Senha incorreta',
      icon: <MehOutlined style={{ color: '#e91010' }} />,
    });
  };

  const handleChange = (value: string) => {
    setName(value);
    console.log(`selected ${value}`);
  };

  const handleLogin = () => {
    const body = {
      name,
      password,
    };

    // Lógica de autenticação
    if (body.password === 'regiao9') {
      navigate(`/home?jurado=${body.name}`); // Substitua '/dashboard' pela rota desejada
    } else {
      errorNotification();
    }
  };
  const onChangeSwitch = (checked: boolean) => {
    setIsOtherName(checked);
    console.log(`switch to ${checked}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      {contextHolder}
      <img src={logoProjeto} className="w-[300px]" alt="" />
      <div className="flex flex-col w-4/5 mt-4">
        <div className="flex flex-col w-3/5">
          <div className="flex items-center">
            <div className="mr-5">
              <h1 className="font-semibold">Nome do jurado:</h1>
              <Select
                defaultValue=""
                // style={{ width: 120 }}
                className="w-full mb-4"
                onChange={handleChange}
                size="large"
                options={[
                  { value: '', label: 'Escolha seu nome' },
                  { value: 'Pastor Leonardo', label: 'Pastor Leonardo' },
                  { value: 'Diego', label: 'Diego' },
                  { value: 'Clóvis', label: 'Clóvis' },
                ]}
              />
            </div>

            <div>
              <h1 className="font-semibold">Outro:</h1>
              <Switch className="w-3 mb-3" defaultChecked={false} onChange={onChangeSwitch} />
            </div>
          </div>
          {isOtherName ? (
            <>
              <h1 className="font-semibold">Insira seu nome:</h1>
              <Input className="w-full h-12" placeholder="Nome do jurado" onChange={(e) => setName(e.target.value)} />
            </>
          ) : null}
        </div>
        <div className="flex flex-col w-full mt-5">
          <h1 className="font-semibold">Senha:</h1>
          <Space className="w-full" direction="vertical">
            <Input.Password
              className="w-full h-12"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Space>
        </div>
        <Button
          type="primary"
          onClick={handleLogin}
          className=" mt-5 bg-blue-600 hover:bg-blue-700 p-4 rounded text-base text-white h-auto w-auto xl:w-1/2"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
};

export default Login;
