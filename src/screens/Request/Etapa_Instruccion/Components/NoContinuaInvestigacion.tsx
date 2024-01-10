import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';

export const NoContinuaInvestigacion = ({ roles, currentUser, setDocumentAproved, documentAproved }: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <>
      <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
        <div className="w-full ml-4">
          <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Documentos de investigación</h4>
          <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
          <table className="w-1/2">
            <thead className=" bg-cidSecundaryGrey">
              <th className="text-sm py-4 px-4">Documento</th>
              <th className="text-sm py-4 px-4">Estado</th>
              <th className="text-sm py-4 px-4">Acciones</th>
            </thead>
            <tr>
              <td className="py-2 px-2">
                <p className="text-sm underline">Auto cumplimiento de archivo de IP segunda instancia</p>
              </td>
              <td>
                <StateBadge label={'Completado'} state="success" />
              </td>
              <td className="py-2 px-2 text-center">
                {currentUser === roles.profesionalInstruccion && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalDocsViewer(true);
                        setTypeOfDocumentToEdit('Auto cumplimiento de archivo de IP segunda instancia');
                      }}
                      className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                    >
                      Crear
                    </button>
                    {openModalDocsViewer &&
                      typeOfDocumentToEdit === 'Auto cumplimiento de archivo de IP segunda instancia' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Auto cumplimiento de archivo de IP segunda instancia'}
                        />
                      )}
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-2">
                <p className="text-sm underline">Constancia ejecutoria de archivo de IP segunda instancia</p>
              </td>
              <td>
                <StateBadge label={'Completado'} state="success" />
              </td>
              <td className="py-2 px-2 text-center">
                {currentUser === roles.profesionalInstruccion && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalDocsViewer(true);
                        setTypeOfDocumentToEdit('Constancia ejecutoria de archivo de IP segunda instancia');
                      }}
                      className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                    >
                      Crear
                    </button>
                    {openModalDocsViewer &&
                      typeOfDocumentToEdit === 'Constancia ejecutoria de archivo de IP segunda instancia' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Constancia ejecutoria de archivo de IP segunda instancia'}
                        />
                      )}
                  </>
                )}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};
