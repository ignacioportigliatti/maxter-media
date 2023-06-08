'use client'

import { UsersTable } from "@/components/users"
import "react-toastify/dist/ReactToastify.css";

interface UsersPageProps {
    
}

const page = (props: UsersPageProps) => {
    return (
        <div className="w-full mx-auto justify-center items-start">
      <div className="w-full flex flex-row dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm items-center">
        <h2>Usuarios</h2>
      </div>
      <div className="mx-auto p-7">
       <UsersTable/>
      </div>
    </div>
    )
}

export default page
