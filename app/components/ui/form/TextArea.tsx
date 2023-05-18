import React from "react";

interface TextAreaProps {
    label: string;
    id: string;
}

export const TextArea = (props: TextAreaProps) => {

    const { label, id } = props;

  return (
    <div>
      <label className="text-dark-gray dark:text-light-gray">{label}</label>
      <textarea
        id={id}
        className="block w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 rounded-md bg-transparent
        dark:text-gray-300 dark:border-gray-600 focus:border-orange-500 focus:outline-none focus:ring focus:ring-orange-500 transition duration-300"
      ></textarea>
    </div>
  );
};


