import { Steps } from "@/components/home/Steps";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center mx-auto p-7">
      <div className="flex flex-col gap-5 text-center">
        <h4 className="-mb-[5px]">SECCION ADMINISTRADOR</h4>
        <h1>Maxter Descargas</h1>
        <h2>Bienvenido/a al portal de recuerdos de tu viaje de egresados</h2>
        <p className="mt-2">Aquí podras ver y descargar las fotos y/o videos de tu viaje.</p>
      </div>
    </div>
  );
}
