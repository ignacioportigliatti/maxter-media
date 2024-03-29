"use client";

import { Group } from "@prisma/client";
import axios from "axios";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { getGroupCodes } from "./utils/getGroupCodes";
import { useRouter } from "next/navigation";

interface CodesGeneratorProps {
  selectedGroup: Group;
}

enum CodeType {
  PHOTO = "photo",
  VIDEO = "video",
  FULL = "full",
}

export interface CodesGeneratorForm {
  type: CodeType;
  quantity: number;
  included: boolean;
  optional: boolean;
  expirationDays: string;
  optionalComment?: string;
}

const CodesGenerator = (props: CodesGeneratorProps) => {
  const { selectedGroup } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CodesGeneratorForm>();

  const router = useRouter();

  const onSubmit: SubmitHandler<CodesGeneratorForm> = async (data) => {
    const response = await axios
      .post("/api/codes/add", {
        formData: data,
        groupId: selectedGroup.id,
      })
      .then((res) => res.data);
    if (response.success) {
      toast.success("Códigos generados exitosamente.");
      router.refresh();
    }
  };

  const isOptionalChecked = watch("optional");

  return (
    <div className="w-full max-h-fit h-full flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-base font-semibold w-full text-center">
          Generar Codigos
        </h2>
        <div className="flex flex-col gap-2 text-xs mt-2">
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="">
              Tipo
            </label>
            <select
              className="text-xs p-1 bg-medium-gray text-white"
              {...register("type", { required: true })}
              aria-invalid={errors.type ? "true" : "false"}
            >
              <option value="full">Foto + Video</option>
              <option value="photo">Foto</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Cantidad</label>
            <input
              {...register("quantity", { required: true })}
              aria-invalid={errors.quantity ? "true" : "false"}
              className="input text-xs p-1 bg-medium-gray text-white"
            />
            {errors.quantity?.type === "required" && (
              <p className="text-xs !text-red-600" role="alert">
                Debes ingresar una cantidad.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Dias de expiracion</label>
            <input
              {...register("expirationDays", { required: true })}
              defaultValue={30}
              aria-invalid={errors.expirationDays ? "true" : "false"}
              className="input text-xs p-1 bg-medium-gray text-white"
            />
            {errors.expirationDays?.type === "required" && (
              <p className="text-xs !text-red-600" role="alert">
                Debes ingresar una cantidad de dias.
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="">Incluido por contrato</label>
            <input
              {...register("included")}
              type="checkbox"
              className="input text-sm p-1"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="">Opcional</label>
            <input
              {...register("optional")}
              type="checkbox"
              className="input text-sm p-1"
            />
          </div>
          {isOptionalChecked && ( // Mostrar el campo de comentarios solo si el checkbox opcional está marcado
            <div className="flex flex-col gap-2 items-start max-h-[100px] ">
              <textarea
                {...register("optionalComment")}
                className="input w-full text-xs p-1"
              />
            </div>
          )}
        </div>

        <div className="flex justify-start mt-2">
          <button
            type="submit"
            className="button !text-xs w-full !border-white"
          >
            Generar código/s
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodesGenerator;
