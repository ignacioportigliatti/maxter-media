import * as React from 'react';

export interface EmailQueryResponse {
    response: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    selectedGroup: string;
    selectedAgency: string;
    message: string;
}

interface EmailTemplateProps {
  queryResponse: EmailQueryResponse;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    queryResponse,
}) => (
  <div>
    <h1>Estimado/a, {queryResponse.firstName} {queryResponse.lastName}</h1>
    <h6>Datos de su consulta: {queryResponse.selectedGroup} - {queryResponse.selectedAgency}</h6>
    <p>{queryResponse.response}</p>
  </div>
);
