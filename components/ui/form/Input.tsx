interface InputProps {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Input = (props: InputProps) => {

  const { id, type, label, required = false, value, onChange, error } = props;

  return (
    <div>
      <label className="text-dark-gray text-sm dark:text-light-gray">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        required={required}
        id={id}
        type={type}
        className="block w-full px-4 py-2 text-gray-700 border border-gray-300  bg-transparent
        dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 focus:outline-none focus:ring focus:ring-orange-500 transition duration-300"
      />
      {error && <p className="mt-1 text-red-500 text-xs">{error}</p>} {/* Mostrar el mensaje de error si existe */}
    </div>
  );
};
