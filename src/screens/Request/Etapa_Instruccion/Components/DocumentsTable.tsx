import { useEffect, useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';
import Switch from '@mui/material/Switch';
import { documentRequest } from '../../../../models/documentRequest.model';
import { useFetchAndLoad } from '../../../../hooks';
import { getDocuments } from '../../../../services/documents.service';
import { CrearComunicacion } from '../../components/CrearComunicacion';

export const DocumentsTable = ({
  currentUser,
  roles,
  setDocumentAproved,
  requestSelected,
  stage,
  comparationState,
  rolesAdmitidos
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  const [rechargeDocuments, setRechargeDocuments] = useState(false);
  const [documents, setDocuments] = useState<documentRequest[]>([]);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);

  useEffect(() => {
    if (!documentsLoaded) return;
    const isAllDocumentsCompleted = documents.every((document) => {
      return document.state === comparationState;
    });
    if (isAllDocumentsCompleted && setDocumentAproved) {
      setDocumentAproved(true);
    } else if (setDocumentAproved && !isAllDocumentsCompleted) {
      setDocumentAproved(false);
    }
  }, [documentsLoaded, rechargeDocuments]);

  useEffect(() => {
    setDocumentsLoaded(false);
    let dataDocs: any = [];
    const data = getDocumentsRequest();
    data.then((response) => {
      response?.forEach((e: any, i: number) => {
        if (Array.isArray(stage)) {
          if (stage.includes(e?.requestState?.id)) {
            dataDocs.push(e);
          }
        } else {
          if (e?.requestState?.id === stage) {
            dataDocs.push(e);
          }
        }
      });
      dataDocs.sort((d1: any, d2: any) => d1.order - d2.order);
      setDocuments(dataDocs);
      setDocumentsLoaded(true);
    });
  }, [rechargeDocuments]);

  const getDocumentsRequest = async () => {
    try {
      const response = await callEndpoint(getDocuments(requestSelected.id));
      return response.data;
    } catch (error) {}
  };

  const stateColor = (state: string) => {
    switch (state) {
      case 'Completado':
        return 'success';
      case 'Por completar':
        return 'warning';
      case 'Modificar':
        return 'danger';
      case 'Aceptado':
        return 'success';
      default:
        return 'danger';
    }
  };

  const enableButton = (i: number) => {
    if (i === 0) {
      return false;
    }
    const index = documents.findIndex((document) => {
      return document.state !== 'Completado' && document.state !== 'Aceptado';
    });
    if (index === -1) {
      return false;
    }
    if (i > index) {
      return true;
    }
  };


  return (
    <>
      {/* {currentUser !== roles.secretariaComunInstruccion && ( */}
      <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
        <div className="w-full ml-4">
          {/* <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Documentos de </h4> */}
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
                    {(currentUser === roles.profesionalInstruccion || currentUser === roles.profesionalJuzgamiento) && (
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
                      </>
                    )}
                    {(currentUser === roles.secretariaComunInstruccion || currentUser === roles.secretariaComunJuzgamiento) && (
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
                      </>
                    )}
                    {(currentUser === roles.directorInstruccion || currentUser === roles.directorJuzgamiento) && (
                      <button
                        type="button"
                        disabled={enableButton(i)}
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit(document.title);
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-cidPrimaryGreen"
                      >
                        Revisar
                      </button>
                    )}
                    {openModalDocsViewer && typeOfDocumentToEdit === document.title && (
                      <DocumentToEdit
                        roles={roles}
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={document.title}
                        contentDocument={document.content}
                        docSelected={document}
                        requestSelected={requestSelected}
                        stage={stage}
                        setRechargeDocuments={setRechargeDocuments}
                        rechargeDocuments={rechargeDocuments}
                        rolesAdmitidos={rolesAdmitidos}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* )} */}
      {/* {currentUser === roles.secretariaComunInstruccion && (
        <div className="col-span-3 col-start-1">
          {documents?.map((document) => (
            <div className="mt-5">
              <CrearComunicacion title={document.title} state={document.state} request={recepcionarSolicitudData} attachments={requestSelected?.attachments} documentPermissions={document} />
            </div>
          ))}
          <div className="flex justify-end gap-4 my-10">
            <button
              type="button"
              className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Enviar todos
            </button>
          </div>
        </div>
      )} */}
    </>
  );
};
