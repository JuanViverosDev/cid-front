import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';
import Switch from '@mui/material/Switch';

export const NoProcedeConfesion = ({ roles, currentUser, setDocumentAproved, documentAproved }: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
      <div className="w-full ml-4">
        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Documentos de No Procede confesión</h4>
        <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
        <table className="w-1/2">
          <thead className=" bg-cidSecundaryGrey">
            <th className="text-sm py-4 px-4">Documento</th>
            <th className="text-sm py-4 px-4">Estado</th>
            <th className="text-sm py-4 px-4">Acciones</th>
          </thead>

          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Notificación por estado</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {currentUser === roles.secretariaComunInstruccion && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Notificación por estado');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer && typeOfDocumentToEdit === 'Notificación por estado' && (
                    <DocumentToEdit
                      userLogged={currentUser}
                      openModalDocsViewer={openModalDocsViewer}
                      setOpenModalDocsViewer={setOpenModalDocsViewer}
                      documentName={'Notificación por estado'}
                    />
                  )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Auto de cierre de investigación y alegatos precalificatorios</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {currentUser === roles.profesionalInstruccion && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Auto de cierre de investigación y alegatos precalificatorios');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Auto de cierre de investigación y alegatos precalificatorios' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Auto de cierre de investigación y alegatos precalificatorios'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Auto vario allegando pruebas</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {(currentUser === roles.profesionalInstruccion ||
                currentUser === roles.directorInstruccion ||
                currentUser === roles.secretariaComunJuzgamiento) && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Auto vario allegando pruebas');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer && typeOfDocumentToEdit === 'Auto vario allegando pruebas' && (
                    <DocumentToEdit
                      userLogged={currentUser}
                      openModalDocsViewer={openModalDocsViewer}
                      setOpenModalDocsViewer={setOpenModalDocsViewer}
                      documentName={'Auto vario allegando pruebas'}
                    />
                  )}
                </>
              )}
              {/* Aprobbación del director de juzgamiento */}
              {currentUser === '398278a8-2e8e-4278-bf3c-55c7f7e1d299' && (
                <>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-cidPrimaryGreen"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Auto vario ordenar pruebas</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {(currentUser === roles.profesionalInstruccion ||
                currentUser === roles.directorInstruccion ||
                currentUser === roles.secretariaComunJuzgamiento) && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Auto vario ordenar pruebas');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer && typeOfDocumentToEdit === 'Auto vario ordenar pruebas' && (
                    <DocumentToEdit
                      userLogged={currentUser}
                      openModalDocsViewer={openModalDocsViewer}
                      setOpenModalDocsViewer={setOpenModalDocsViewer}
                      documentName={'Auto vario ordenar pruebas'}
                    />
                  )}
                </>
              )}
              {/* Aprobbación del director de juzgamiento */}
              {currentUser === '398278a8-2e8e-4278-bf3c-55c7f7e1d299' && (
                <>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-cidPrimaryGreen"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Memorando oficio solicitud de pruebas</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {(currentUser === roles.profesionalInstruccion ||
                currentUser === roles.directorInstruccion ||
                currentUser === roles.secretariaComunJuzgamiento) && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Memorando oficio solicitud de pruebas');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer && typeOfDocumentToEdit === 'Memorando oficio solicitud de pruebas' && (
                    <DocumentToEdit
                      userLogged={currentUser}
                      openModalDocsViewer={openModalDocsViewer}
                      setOpenModalDocsViewer={setOpenModalDocsViewer}
                      documentName={'Memorando oficio solicitud de pruebas'}
                    />
                  )}
                </>
              )}
              {/* Aprobbación del director de juzgamiento */}
              {currentUser === '398278a8-2e8e-4278-bf3c-55c7f7e1d299' && (
                <>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-cidPrimaryGreen"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Auto prórroga término de investigación disciplinaria 1952.1</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {(currentUser === roles.profesionalInstruccion ||
                currentUser === roles.directorInstruccion ||
                currentUser === roles.secretariaComunJuzgamiento) && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Auto prórroga término de investigación disciplinaria 1952.1');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Auto prórroga término de investigación disciplinaria 1952.1' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Auto prórroga término de investigación disciplinaria 1952.1'}
                      />
                    )}
                </>
              )}
              {/* Aprobbación del director de juzgamiento */}
              {currentUser === '398278a8-2e8e-4278-bf3c-55c7f7e1d299' && (
                <>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-cidPrimaryGreen"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Constrancia secretarial</p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secreatria juzgameinto */}
              {currentUser === roles.secretariaComunInstruccion && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit('Constrancia secretarial');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer && typeOfDocumentToEdit === 'Constrancia secretarial' && (
                    <DocumentToEdit
                      userLogged={currentUser}
                      openModalDocsViewer={openModalDocsViewer}
                      setOpenModalDocsViewer={setOpenModalDocsViewer}
                      documentName={'Constrancia secretarial'}
                    />
                  )}
                </>
              )}
            </td>
          </tr>
        </table>
        <div style={{ background: '#e8f5e9' }} className=" p-4 w-1/2">
          <Switch
            onChange={(e: any) => {
              setDocumentAproved({
                ...documentAproved,
                isAllDocumentsNoProcedeConfesionApproved: e.target.checked,
              });
            }}
            color="success"
          />
          ¿Todos los documentos fueron aprobados? {documentAproved.isAllDocumentsNoProcedeConfesionApproved}
        </div>
      </div>
    </div>
  );
};
