import React from "react";
import QueryModal from "./QueryModal";
import { ContactQuery } from "@prisma/client";
import QueryCard from "./QueryCard";

type QueriesTableProps = {
  queries: ContactQuery[];
};

const QueriesTable = (props: QueriesTableProps) => {
  const { queries } = props;

  const [isQueryModalOpen, setIsQueryModalOpen] = React.useState(false);
  const [selectedQuery, setSelectedQuery] = React.useState<ContactQuery>();

  const handleToggleModal = (query: ContactQuery) => {
    setSelectedQuery(query);
    setIsQueryModalOpen(!isQueryModalOpen);
  };

  const repliedQueries = queries.filter((query) => query.replied === true);
  const notRepliedQueries = queries.filter((query) => query.replied === false);

  return (
    <div className="flex flex-col gap-6 items-center justify-center">
      <div className="w-full">
        <h6 className="text-sm">
          Esperando respuesta {`(${notRepliedQueries.length})`}
        </h6>
        <div className="w-full grid grid-cols-1 mt-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-start text-white">
          {notRepliedQueries.map((query, index) => (
            <div key={index} onClick={() => handleToggleModal(query)}>
              <QueryCard query={query} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <h6 className="text-sm">Respondidos {`(${repliedQueries.length})`}</h6>
        <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-start text-white">
          {repliedQueries.map((query, index) => (
            <div key={index} onClick={() => handleToggleModal(query)}>
              <QueryCard query={query} index={index} />
            </div>
          ))}
        </div>
      </div>
      {isQueryModalOpen && (
        <QueryModal
          handleToggleModal={handleToggleModal}
          query={selectedQuery as ContactQuery}
        />
      )}
    </div>
  );
};

export default QueriesTable;
