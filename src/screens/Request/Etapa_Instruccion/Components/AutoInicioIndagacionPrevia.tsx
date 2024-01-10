import { useEffect, useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';
import Switch from '@mui/material/Switch';
import { documentRequest } from '../../../../models/documentRequest.model';
import { useFetchAndLoad } from '../../../../hooks';
import { getDocuments } from '../../../../services/documents.service';

export const AutoInicioIndagacionPrevia = ({
  currentUser,
  roles,
  setDocumentAproved,
  documentAproved,
  requestSelected,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  const [rechargeDocuments, setRechargeDocuments] = useState(false);
  const [documents, setDocuments] = useState<documentRequest[]>([]);

  useEffect(() => {
    const isAllDocumentsCompleted = documents.every((document) => document.state === 'Completado');
    if (isAllDocumentsCompleted) {
      setDocumentAproved({
        ...documentAproved,
        isAllDocumentsAutoInicioIndagacionPreviaAproved: true,
      });
    }
  }, []);

  useEffect(() => {
    const data = getDocumentsRequest();
    data.then((response) => {
      setDocuments(response);
    });
  }, [rechargeDocuments]);

  const getDocumentsRequest = async () => {
    try {
      const response = await callEndpoint(getDocuments(requestSelected.id, 'AutoInicioIndagacionPrevia'));
      if (response?.data.length === 0) {
        const newData = [
          {
            title: 'Auto de inicio de indagación previa',
            state: 'Por completar',
            content: '',
            requestId: requestSelected.id,
            stage: 'AutoInicioIndagacionPrevia',
          },
        ];
        return newData;
      }
      return response.data;
    } catch (error) {
    }
  };

  const stateColor = (state: string) => {
    switch (state) {
      case 'Completado':
        return 'success';
      case 'Por completar':
        return 'warning';
      case 'Modificar':
        return 'danger';
      default:
        return 'danger';
    }
  };

  const enableButton = (i: number) => {
    if (i === 0) {
      return false;
    }
    const index = documents.findIndex((document) => document.state !== 'Completado');
    if (index === -1) {
      return false;
    }
    if (i > index) {
      return true;
    }
  };

  return (
    <>
      <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
        <div className="w-full ml-4">
          <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Documentos de indagación previa</h4>
          <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
          <table className="w-1/2">
            <thead className=" bg-cidSecundaryGrey">
              <tr>
                <th className="text-sm py-4 px-4">Documento</th>
                <th className="text-sm py-4 px-4">Estado</th>
                <th className="text-sm py-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documents?.map((document, i) => (
                <tr key={document.id}>
                  <td className="py-2 px-2">
                    <p className="text-sm underline">{document.title}</p>
                  </td>
                  <td>
                    <StateBadge label={document.state} state={stateColor(document.state)} />
                  </td>
                  <td className="py-2 px-2">
                    {currentUser !== roles.directorInstruccion && (
                      <>
                        <button
                          type="button"
                          disabled={enableButton(i)}
                          onClick={() => {
                            setOpenModalDocsViewer(true);
                            setTypeOfDocumentToEdit(document.title);
                          }}
                          className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                        >
                          Crear
                        </button>
                        {openModalDocsViewer && typeOfDocumentToEdit === document.title && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={document.title}
                            contentDocument={document.content}
                            docSelected={document}
                            requestSelected={requestSelected}
                            stage={document.stage}
                            setRechargeDocuments={setRechargeDocuments}
                            rechargeDocuments={rechargeDocuments}
                          />
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
