import React from 'react';
import { Input } from 'antd';

interface OptionsFieldProps {
  title: string;
  value: string;
  submitted: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

const OptionsInputField: React.FC<OptionsFieldProps> = ({ title, value, submitted, onChange }) => {
  return (
    <div
      className={`bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2 border-2 ${
        submitted && value === null ? 'border-red-500' : ''
      }`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <Input placeholder={title} size="large" className="h-14" onChange={onChange} />
    </div>
  );
};

export default OptionsInputField;
