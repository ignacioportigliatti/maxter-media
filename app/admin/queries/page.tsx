"use client";

import QueriesTable from "@/components/admin/queries/QueriesTable";
import { formattedDate } from "@/utils/formattedDate";
import { ContactQuery } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {}

const QueriesPage = (props: Props) => {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);

  useEffect(() => {
    const getQueries = async () => {
      const response = await axios
        .get("/api/contact/get-queries")
        .then((res) => res.data);
      const queries: ContactQuery[] = response.queries;
      if (response.success) {
        setQueries(queries);
      }
    };
    getQueries();
  }, []);

  return (
    <div className="w-full mx-auto justify-center items-start">
      <div className=" bg-dark-gray themeTransition py-[26px] px-7 text-white items-center">
        <h1 className="text-xl">
          Consultas/Reclamos {queries.length > 0 ? `(${queries.length})` : ""}
        </h1>
      </div>
      <div className="mx-auto p-7">
        <QueriesTable queries={queries} />
      </div>
    </div>
  );
};

export default QueriesPage;
