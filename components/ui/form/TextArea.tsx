import React from "react";

interface TextAreaProps {
    label: string;
    id: string;
}

export const TextArea = (props: TextAreaProps) => {

    const { label, id } = props;

  return (
    <div>
      <label className="text-light-gray">{label}</label>
      <textarea
        id={id}
        className="block w-full px-4 py-2 mt-2 border bg-transparent
        text-gray-300 border-gray-600 focus:border-red-600 focus:outline-none focus:ring focus:ring-red-600 transition duration-300"
      ></textarea>
    </div>
  );
};


