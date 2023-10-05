import { formattedDate } from '@/utils/formattedDate';
import { ContactQuery } from '@prisma/client'
import React from 'react'
import { TbCheck, TbClock } from 'react-icons/tb';

interface QueryCardProps {
    query: ContactQuery;
    index: number;
}

const QueryCard = (props: QueryCardProps) => {
    const { query, index } = props;
    return (
        <div
        
          key={`query-${index}`}
          className=" relative min-h-full flex flex-col justify-between p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-300"
        >
          
          <div className="mt-2 flex flex-col">
          {query.replied ? (
            <>
            <TbCheck className="bg-dark-gray p-[2px] rounded-full absolute top-0 right-0 -translate-y-2 translate-x-2 text-green-500 text-2xl" /> 
           <p className="w-max text-xs !text-white p-1 rounded-md bg-green-500">Respondido</p>
            </>
          ) :  <>
          <TbClock className="bg-dark-gray p-[2px] rounded-full absolute top-0 right-0 -translate-y-2 translate-x-2 text-yellow-700 text-2xl" /> 
           <p className="w-max text-xs !text-white p-1 rounded-md bg-yellow-700">Esperando respuesta</p>
          </>}
            <h6 className="text-lg mt-3 leading-none">
              {query.firstName} {query.lastName}{" "}
              
            </h6>
            <p className="text-sm font-bold text-gray-300">
                {query.email}
              </p>
            <p className="text-white text-xs font-semibold">Teléfono: {query.phone}</p>
            <p className="text-sm p-1 mt-2 leading-4 bg-black/20 rounded-lg h-full">
              {query.message.length > 96
                ? `${query.message.substring(0, 96)}...`
                : query.message}
            </p>
          </div>
          <div className="text-gray-400 mt-2">
            <p className="text-xs font-bold">{query.currentCode}</p>
            <p className="text-xs">
              {query.selectedGroup} - {query.selectedAgency}
            </p>
            <p className="text-xs font-semibold">
              {formattedDate(query.createdAt)}
            </p>
          </div>
        </div>
    )
}

export default QueryCard
