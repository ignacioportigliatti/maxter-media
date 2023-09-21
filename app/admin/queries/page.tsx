"use client";

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
        <h1>Consultas/Reclamos {queries.length > 0 ? `(${queries.length})` : ''}</h1>
      </div>
      <div className="mx-auto p-7">
        <div className="flex flex-wrap w-full gap-6">
          {queries.map((query, index) => (
            <div key={`query-${index}`} className="flex flex-col items-start rounded-lg border max-w-sm !text-white border-light-gray p-6 justify-start">
              <p className="text-lg">{query.firstName} {query.lastName}</p>
              <p className="font-bold text-red-500">{query.email}</p>
              <p className="font-bold text-red-300">{query.phone}</p>
              <p>{query.message}</p>
              <p>{query.selectedGroup} - {query.selectedAgency}</p>
              <p className="text-xs font-bold">{query.currentCode}</p>
              <p className="italic text-xs font-semibold">{formattedDate(query.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueriesPage;
