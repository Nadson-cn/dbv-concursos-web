import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

interface OptionsFieldProps {
  title: string;
  options: { label: string; value: number }[];
  value: number | null;
  submitted: boolean;
  onChange: ({ target: { value } }: RadioChangeEvent) => void;
}

const OptionsField: React.FC<OptionsFieldProps> = ({ title, options, value, submitted, onChange }) => {
  return (
    <div
      className={`bg-white shadow-md rounded p-4 mb-4 w-full xl:w-1/2 border-2 ${
        submitted && value === null ? 'border-red-500' : ''
      }`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <Radio.Group options={options} onChange={onChange} value={value} optionType="button" buttonStyle="solid" />
    </div>
  );
};

export default OptionsField;
