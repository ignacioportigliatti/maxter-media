'use client'

import { useState, useEffect } from "react";

interface MasterInputProps {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const MasterInput = (props: MasterInputProps) => {
  const { id, type, label, required = false, value, onChange, error } = props;
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;
    const formattedInput = userInput.replace(/[^0-9]/g, "");
    const formattedValue = formattedInput ? "M" + ("0000" + formattedInput).slice(-4) : "";
    setInputValue(formattedValue);

    // Invocamos el callback de `onChange`, si está definido
    if (onChange) {
      event.target.value = formattedValue; // Actualizamos el valor en el evento
      onChange(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && inputValue === "M0000") {
      event.preventDefault();
      setInputValue("");
    }
  };

  useEffect(() => {
    if (inputValue === "") {
      setInputValue("M0000");
    }
  }, [inputValue]);


  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          required={required}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 bg-transparent dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 focus:outline-none focus:ring focus:ring-orange-500 transition duration-300"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
