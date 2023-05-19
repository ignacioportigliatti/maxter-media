
import { AgencyTable } from "./components/AgencyTable";


export default function EnterprisesPage() {

    const agencies  = [
        {
            name: "Astros Turism",
            location: "SantaFe",
            groups: 2,
            phone: "123456789",
            email: "astrosturismo@gmail.com",
            imgSource: "/agency/astros-logo.png",
        },
        {
            name: "Astros Turism",
            location: "SantaFe",
            groups: 1,
            phone: "123456789",
            email: "astrosturismo@gmail.com",
            imgSource: "/agency/astros-logo.png",
        },
        {
            name: "Astros Turism",
            location: "SantaFe",
            groups: 2,
            phone: "123456789",
            email: "astrosturismo@gmail.com",
            imgSource: "/agency/astros-logo.png",
        },

    ]

  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className="w-full flex flex-row dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 
      text-black dark:text-white drop-shadow-sm items-center">
        <h2>Empresas</h2>
      </div>
      <div className="mx-auto p-7">
        <AgencyTable 
          names={agencies.map((agency) => agency.name)}
          locations={agencies.map((agency) => agency.location)}
          groups={agencies.map((agency) => agency.groups)}
          phones={agencies.map((agency) => agency.phone)}
          emails={agencies.map((agency) => agency.email)}
          imgSources={agencies.map((agency) => agency.imgSource)}
        />
      </div>
    </div>
  );
}
