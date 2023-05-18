interface InputProps {
  id: string;
  type: string;
  label: string;
}

export const Input = (props: InputProps) => {

  const { id, type, label } = props;

  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300  bg-transparent
        dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 focus:outline-none focus:ring focus:ring-orange-500 transition duration-300"
      ></input>
    </div>
  );
};
