import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';

export const RealizarAutoInhibitorio = ({ currentUser, roles }: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
      <div className="w-full ml-4">
        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Autoinhitorio</h4>
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
            <tr>
              <td className="py-2 px-2">
                <p className="text-sm underline">Auto inhibitorio 1952</p>
              </td>
              <td>
                <StateBadge label={'Completado'} state="success" />
              </td>
              <td className="py-2 px-2">
                {currentUser !== roles.directorInstruccion && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalDocsViewer(true);
                        setTypeOfDocumentToEdit('Auto inhibitorio 1952');
                      }}
                      className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                    >
                      Crear
                    </button>
                    {openModalDocsViewer && typeOfDocumentToEdit === 'Auto inhibitorio 1952' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Auto inhibitorio 1952'}
                      />
                    )}
                  </>
                )}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-2">
                <p className="text-sm underline">Memorando oficio comunicación a quejoso de inhibitorio</p>
              </td>
              <td>
                <StateBadge label={'Completado'} state="success" />
              </td>
              <td className="py-2 px-2">
                {currentUser !== roles.directorInstruccion && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalDocsViewer(true);
                        setTypeOfDocumentToEdit('Memorando oficio comunicación a quejoso de inhibitorio');
                      }}
                      className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                    >
                      Crear
                    </button>
                    {openModalDocsViewer &&
                      typeOfDocumentToEdit === 'Memorando oficio comunicación a quejoso de inhibitorio' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Memorando oficio comunicación a quejoso de inhibitorio'}
                        />
                      )}
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
