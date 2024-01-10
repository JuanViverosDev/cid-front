import * as React from 'react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import { border } from '@mui/system';

export const ExportToExcel = ({ fileName, content }: any) => {
  let data: any = [];
  const handleDownloadExcel = () => {
    if (content.length === 0) return;
    data = content?.map((params: any) => {
      return {
        'Nº de Radicado': params?.id,
        'Nº de Expediente': params?.expediente,
        'Nombre del solicitante': params?.nombreSolicitante,
        Etapa: params?.requestState?.stageName,
        Estado: params?.requestState?.stateName,
        'Asignado a': `${params?.agentSelected?.userName} ${params?.agentSelected?.userLastName}`,
        Asunto: params?.subject,
        'Fecha/Hora de Recibido': moment(params?.createdAt).format('YYYY-MM-DD HH:MM:ss'),
        'Fecha de Vencimiento': moment(params?.expireDate).format('YYYY-MM-DD HH:MM:ss'),
        Anexos: params?.attachments?.map((item: any) => item.fileName).join(', '),
        'Última Actualización': moment(params?.updatedAt).format('YYYY-MM-DD HH:MM:ss'),
      };
    });

    const headers = Object.keys(data[0]);
    downloadExcel({
      fileName: fileName,
      sheet: 'Peticiones',
      tablePayload: {
        header: headers,
        body: data,
      },
    });
  };

  return (
    <>
      <button onClick={handleDownloadExcel}>Exportar Tabla</button>
    </>
  );
};
