import { Group } from "@prisma/client";
import React from "react";
import { useForm, SubmitHandler } from 'react-hook-form';

interface CodesGeneratorProps {
  selectedGroup: Group;
};

enum CodeType {
  PHOTO = "photo",
  VIDEO = "video",
  FULL = "full",
}

interface CodesGeneratorForm {
  type: CodeType;
  quantity: number;
  included: boolean;
  optional: boolean;
  optionalComment?: string;
}

const CodesGenerator = (props: CodesGeneratorProps) => {
  const { selectedGroup } = props;
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CodesGeneratorForm>();
  const onSubmit: SubmitHandler<CodesGeneratorForm> = (data) => console.log(data);

  const isOptionalChecked = watch("optional");

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-base font-semibold w-full text-center">
          Generar Codigos
        </h2>
        <div className="flex flex-col gap-2 text-xs mt-2">
          <div className="flex flex-col gap-1">
            <label className="" htmlFor="">
              Tipo
            </label>
            <select className="text-sm p-1" {...register('type', { required: true })} aria-invalid={errors.type ? "true" : "false"}>
              <option value="photo">Foto</option>
              <option value="video">Video</option>
              <option value="full">Foto + Video</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Cantidad</label>
            <input {...register('quantity', { required: true })} aria-invalid={errors.quantity ? "true" : "false"} className="input text-sm p-1" />
            {errors.quantity?.type === "required" && (
        <p className="text-xs !text-red-600" role="alert">Debes ingresar una cantidad.</p>
      )}
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="">Incluido por contrato</label>
            <input {...register('included')} type="checkbox" className="input text-sm p-1" />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="">Opcional</label>
            <input {...register('optional')} type="checkbox" className="input text-sm p-1" />
          </div>
          {isOptionalChecked && ( // Mostrar el campo de comentarios solo si el checkbox opcional está marcado
            <div className="flex flex-col gap-2 items-start max-h-[100px] ">
              <textarea {...register('optionalComment')} className="input w-full text-xs p-1" />
            </div>
          )}
        </div>

        <div className="flex justify-start mt-2">
          <button type="submit" className="button w-full">
            Generar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodesGenerator;
