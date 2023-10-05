"use client";

import { formattedDate } from "@/utils/formattedDate";
import { ContactQuery } from "@prisma/client";
import { TfiClose } from "react-icons/tfi";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

type QueryModalProps = {
  handleToggleModal: any;
  query: ContactQuery;
};

const QueryModal = (props: QueryModalProps) => {
  const { handleToggleModal, query } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const finalResponse = `Querido/a ${query.firstName} ${query.lastName},\n\n${data.response}\n\nSaludos,\n\nMaxter Producciones`;
      const emailResponse = await axios.post("/api/emails/send/", {
        from: "Maxter Producciones <info@maxterproducciones.com.ar>",
        to: query.email,
        subject: `Respuesta a tu consulta/reclamo sobre el material de tu viaje - ${query.selectedAgency} - ${query.selectedGroup}`,
        response: finalResponse,
        query: query,
      });
      console.log("email", emailResponse);
      if (emailResponse.data.success === true) {
        toast.success(`Respuesta enviada con éxito a ${query.email}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Error al enviar la respuesta, por favor intenta nuevamente."
      );
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center py-4 sm:py-0 bg-black bg-opacity-80">
      <div className="bg-medium-gray w-full max-w-4xl mx-4 rounded-lg shadow-lg">
        <div className="py-4 bg-dark-gray flex justify-between px-4 text-white text-center rounded-t-lg">
          <h2 className="text-lg font-light uppercase">Detalles de Consulta</h2>
          <button onClick={handleToggleModal} className="text-white">
            <TfiClose className="w-4 h-4" />
          </button>
        </div>
        <div className="w-full flex flex-col  justify-center items-center p-14 gap-4">
          <div className="w-full flex justify-between gap-4">
            <div className="">
              <h6 className="p-1 bg-red-500 rounded-lg text-xs text-center">
                Nombre
              </h6>
              <p className="text-xs p-1 text-white">
                {query.firstName} {query.lastName}
              </p>
            </div>
            <div>
              <h6 className="p-1 bg-red-500 rounded-lg text-xs text-center">
                Email
              </h6>
              <p className="text-xs p-1 text-white">{query.email}</p>
            </div>
            <div>
              <h6 className="p-1 bg-red-500 rounded-lg text-xs text-center">
                Telefono
              </h6>
              <p className="text-xs p-1 text-white">{query.phone}</p>
            </div>
            <div>
              <h6 className="p-1 bg-red-500 rounded-lg text-xs text-center">
                Fecha
              </h6>
              <p className="text-xs p-1 text-white">
                {formattedDate(query.createdAt)}
              </p>
            </div>
            <div>
              <h6 className="p-1 bg-red-500 rounded-lg text-xs text-center">
                Grupo
              </h6>
              <p className="text-xs p-1 text-white">{query.selectedGroup}</p>
            </div>
            <div>
              <h6 className="p-1 bg-red-500 rounded-lg text-xs text-center">
                Agencia
              </h6>
              <p className="text-xs p-1 text-white">{query.selectedAgency}</p>
            </div>
            <div>
              {query.replied ? (
                <>
                  <h6 className="p-1 bg-green-500 rounded-lg text-xs text-center">
                    Estado
                  </h6>
                  <p className="text-xs p-1 text-white">Respondido</p>
                </>
              ) : (
                <>
                  <h6 className="p-1 bg-yellow-700 rounded-lg text-xs text-center">
                    Estado
                  </h6>
                  <p className="text-xs p-1 text-white">Esperando respuesta</p>
                </>
              )  
              }
            </div>
          </div>
          <div className="w-full">
            <h6 className="text-sm font-light text-white/80 mb-1">Consulta:</h6>
            <p className="p-2 text-xs bg-black/20 rounded-lg text-white">
              {query.message}
            </p>
          </div>
          <div className="w-full">
            {query.replied ? (
              <>
                <h6 className="text-sm font-light text-white/80 mb-1">
                  Respuesta:
                </h6>
                <textarea
                  disabled
                  className="w-full h-32 border text-xs border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={query.reply as string}
                />
              </>
            ) : (
              <>
                <h6 className="text-sm font-light text-white/80 mb-1">
                  Responder:
                </h6>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <textarea
                    className="w-full h-32 border text-xs border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    {...register("response", { required: true })}
                    placeholder="Escribe tu respuesta aquí..."
                  />
                  {errors.response && (
                    <span className="text-red-500 mt-1 block">
                      Este campo es obligatorio
                    </span>
                  )}

                  <button
                    type="submit"
                    className="mt-4 text-sm px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:border-transparent"
                  >
                    Responder
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryModal;
