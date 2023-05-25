import React from "react";

interface Props {
  options: {name: string, value: string}[];
  label: string;
  id: string;
  value?: string;
  onChange?: (selectedOption : any) => void;
  required?: boolean;
  error?: string;
}

export const Select = (props: Props) => {
  const { options, label, id, onChange, value, required, error } = props;

  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">{label}</label>
      <select
        value={value}
        onChange={onChange}
        id={id}
        required={required}
        className="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 bg-transparent
        dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 focus:outline-none focus:ring focus:ring-orange-500 transition duration-300"
      >
        <option value="" key="default">-- Selecciona una opción --</option>
        {options.map((option, index) => {
          return <option value={option.value} key={index} className="dark:bg-dark-gray">{option.name}</option>;
        })}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>} {/* Mostrar el mensaje de error si existe */}
    </div>
  );
};
