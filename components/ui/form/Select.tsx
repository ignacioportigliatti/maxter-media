import { Agency, Group } from "@prisma/client";

interface Props {
  options: Agency[] | Group[];
  label: string;
  id: string;
  value?: string;
  onChange?: (selectedOption : any) => void;
  required?: boolean;
  error?: string;
  selectedItem?: any;
  defaultValue?: string;
  disabled?: boolean;
  defaultOption?: string;
}

export const Select = (props: Props) => {
  const { options, disabled, label, id, onChange, defaultValue, value, required, error, selectedItem, defaultOption } = props;

  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">{label}</label>
      <select
      defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        id={id}
        disabled={disabled}
        required={required}
        className="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 bg-transparent
        dark:text-gray-300 dark:border-gray-600 focus:border-red-600 focus:outline-none focus:ring focus:ring-red-600 transition duration-300"
      >
        <option value="" key="default">{selectedItem ? `${selectedItem.name}` : defaultOption}</option>
        {options.map((option, index) => {
          return <option value={option.id} key={index} className="dark:bg-dark-gray">{option.name}</option>;
        })}
      </select>
      {error && <p className="text-red-600 text-xs">{error}</p>} {/* Mostrar el mensaje de error si existe */}
    </div>
  );
};
