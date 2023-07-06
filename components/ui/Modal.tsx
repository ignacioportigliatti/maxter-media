'use client'

import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  children: React.ReactNode;
  button: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, button }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
      className="w-full" 
      onClick={openModal}
      >
        {button}
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center z-[1000] justify-center bg-black bg-opacity-70">
          <div className="bg-white w-4/5 md:w-2/3 lg:w-1/2">
            <div className="p-4">{children}</div>
            <button
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <AiOutlineClose className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
