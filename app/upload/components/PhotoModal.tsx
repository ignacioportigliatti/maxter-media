import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";
import { Agency, Group } from "@prisma/client";
import { Input, Select, MasterInput } from "@/app/components/ui";

interface GroupModalProps {
  toggleModal: () => void;
  handleEditGroup?: () => Promise<string>;
  getGroups?: () => void;
}

const GroupModal: React.FC<GroupModalProps> = ({
  toggleModal,
  handleEditGroup,
  getGroups,
}) => {
  const [formErrors, setFormErrors] = useState({

  });

  const [formData, setFormData] = useState({

  });


  const [editMode, setEditMode] = useState(false);

  const checkEditMode = async () => {
    
  };

  useEffect(() => {
    setEditMode(false);
    checkEditMode();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    setFormErrors({ ...formErrors, [field]: "" });
  };
  

  return (
    <div>
      <ToastContainer />
      <div className="animate-in animate-out duration-500 fade-in flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-70">
        <div className="flex flex-col gap-4 pb-7  justify-center items-center bg-white dark:bg-dark-gray w-[50%]">
          <div className="py-2 bg-orange-500 w-full text-center relative">
            <h2 className="text-white">Añadir nuevo grupo</h2>
            <button onClick={toggleModal} className="absolute top-3 right-4">
              <TfiClose className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full px-7 flex flex-col justify-center">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4 mx-auto">
                <div>
                  
                </div>
              </div>
              <div className="grid grid-cols-1 pt-5 gap-4">
                <div className="grid grid-cols-2 gap-4 w-[50%] mx-auto ">
                  <button
                    className="p-1 button !text-white text-center !bg-green-700 hover:!bg-green-500"
                    type="submit"
                  >
                    Agregar Grupo
                  </button>
                  <button
                    className="p-1 button !text-white text-center !bg-red-700 hover:!bg-red-500"
                    onClick={toggleModal}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
