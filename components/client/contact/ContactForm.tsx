"use client";

import { Group } from "@prisma/client";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Props {}

interface ContactInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  code: string;
  selectedGroup: Group;
  selectedAgency: ContactInputs;
  message: string;
}

const ContactForm = (props: Props) => {
  const selectedAgency = useSelector((state: any) => state.agency);
  const selectedGroup = useSelector((state: any) => state.group);
  const currentCode = useSelector((state: any) => state.code);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactInputs>({
    defaultValues: {
      code: currentCode.code,
      selectedAgency: selectedAgency.name,
      selectedGroup: selectedGroup.name,
    },
  });
  const onSubmit: SubmitHandler<ContactInputs> = async (data) => {
    try {
      const response = await axios.post('/api/contact/create-query', data).then((res) => res.data)
      if (response.success) {
        console.log("response", response);
        toast.success(`Consulta enviada con éxito, nos pondremos en contacto a la brevedad. ID de consulta ${response.queryId.id}`);
      } else if (response.error) {
        toast.error("Error al enviar la consulta, por favor intenta nuevamente.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="lg:w-3/5 flex items-center justify-center flex-col p-6 lg:p-16 gap-10 rounded-lg backdrop-blur-xl backdrop-opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(315deg, " +
          selectedAgency.secondaryColor +
          " 0%, " +
          selectedAgency.primaryColor +
          " 74%)",
      }}
    >
      <div className="text-center w-full lg:w-3/4">
        <img
          src={selectedAgency.logoSrc as string}
          alt="logo"
          className="w-12 lg:w-16 object-contain mx-auto"
        />
        <h1 className="mb-1 text-2xl lg:text-4xl">Contacto</h1>
        <h6 className="text-xs lg:text-base">
          Si tenes alguna duda, consulta o reclamo respecto al material
          audiovisual de tu viaje, completa los datos y déjanos tu consulta para
          poder responderte lo antes posible.
        </h6>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-2xl gap-2"
      >
        {/* register your input into the hook by invoking the "register" function */}
        <div className="flex flex-col md:flex-row items-center lg:flex w-full justify-center gap-1">
          <div className="flex flex-col w-full lg:w-1/2 gap-1">
            <label htmlFor="firstName" className="text-xs md:text-sm">
              Nombre
            </label>
            <input
              id="firstName"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none text-sm lg:text-base"
              placeholder="Tu Nombre"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500">
                Este campo es necesario para enviar tu consulta.
              </span>
            )}
          </div>
          <div className="flex flex-col w-full lg:w-1/2 gap-1">
            <label htmlFor="lastName" className="text-xs md:text-sm">
              Apellido
            </label>
            <input
              id="lastName"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none text-sm lg:text-base"
              placeholder="Tu Apellido"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500">
                Este campo es necesario para enviar tu consulta.
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center lg:flex w-full justify-center gap-1">
          <div className="flex flex-col w-full lg:w-1/2 gap-1">
            <label htmlFor="phone" className="text-xs md:text-sm">
              Telefono
            </label>
            <input
              id="phone"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none text-sm lg:text-base"
              placeholder="Tu Telefono"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <span className="text-xs text-red-500">
                Este campo es necesario para enviar tu consulta.
              </span>
            )}
          </div>
          <div className="flex flex-col w-full lg:w-1/2 gap-1">
            <label htmlFor="email" className="text-xs md:text-sm">
              Email
            </label>
            <input
              id="email"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none text-sm lg:text-base"
              placeholder="Tu Email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                Este campo es necesario para enviar tu consulta.
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center lg:flex w-full justify-center gap-1">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="code" className="text-xs md:text-sm">
              Codigo
            </label>
            <input
              disabled
              id="code"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none opacity-60 text-sm lg:text-base"
              defaultValue={currentCode.code}
              {...register("code")}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center lg:flex w-full justify-center gap-1">
          <div className="flex flex-col w-full lg:w-1/2 gap-1 cursor-not-allowed">
            <label htmlFor="selectedAgency" className="text-xs md:text-sm">
              Agencia de Viaje
            </label>
            <input
              id="selectedAgency"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none opacity-60 text-sm lg:text-base"
              defaultValue={selectedAgency.name}
              disabled
              {...register("selectedAgency")}
            />
          </div>
          <div className="flex flex-col w-full lg:w-1/2 gap-1 cursor-not-allowed">
            <label htmlFor="selectedGroup" className="text-xs md:text-sm">
              Grupo
            </label>
            <input
              id="selectedGroup"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none opacity-60 text-sm lg:text-base"
              defaultValue={selectedGroup.name}
              disabled
              {...register("selectedGroup")}
            />
          </div>
        </div>
        <div className="flex flex-col items-center lg:flex w-full justify-center gap-1">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="message" className="text-xs md:text-sm">
              Consulta
            </label>
            <textarea
              id="message"
              className="p-1 rounded-sm backdrop-blur-lg bg-medium-gray/60 outline-none text-sm lg:text-base"
              placeholder="Tu consulta..."
              {...register("message", { required: true })}
            />
            {errors.message && (
              <span className="text-xs text-red-500">
                Este campo es necesario para enviar tu consulta.
              </span>
            )}
          </div>
        </div>
        <button
          className="button !bg-opacity-0 hover:bg-opacity-100 !border-white w-full"
          type="submit"
          style={{
            border: "1px solid " + selectedAgency.secondaryColor,
            backgroundImage:
              "linear-gradient(315deg, " +
              selectedAgency.secondaryColor +
              " 0%, " +
              selectedAgency.primaryColor +
              " 74%)",
          }}
        >
          Enviar Consulta
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
