"use client";

import { UsersTable } from "@/components/users";

interface UsersPageProps {}

const page = (props: UsersPageProps) => {
  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className=" bg-dark-gray themeTransitionpy-[26px] px-7 text-white items-center">
        <h2>Usuarios</h2>
      </div>
      <div className="mx-auto p-7">
        <UsersTable />
      </div>
    </div>
  );
};

export default page;
