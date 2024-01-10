import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';
import Switch from '@mui/material/Switch';

export const SiApoderado = ({ roles, currentUser, setDocumentAproved, documentAproved }: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
      <div className="w-full ml-4">
        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Documentos tiene apoderado</h4>
        <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
        <table className="w-1/2">
          <thead className=" bg-cidSecundaryGrey">
            <th className="text-sm py-4 px-4">Documento</th>
            <th className="text-sm py-4 px-4">Estado</th>
            <th className="text-sm py-4 px-4">Acciones</th>
          </thead>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">
                Acta de confesión de manifestación autovario de valoración de confesión
              </p>
            </td>
            <td>
              <StateBadge label={'Completado'} state="success" />
            </td>
            <td className="py-2 px-2 text-center">
              {/* Secretaria de juzgamiento */}
              {(currentUser === roles.secretariaComunInstruccion || currentUser === roles.profesionalInstruccion) && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalDocsViewer(true);
                      setTypeOfDocumentToEdit(
                        'Acta de confesión de manifestación autovario de valoración de confesión',
                      );
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit ===
                      'Acta de confesión de manifestación autovario de valoración de confesión' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Acta de confesión de manifestación autovario de valoración de confesión'}
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
                isAllDocumentsSiApoderadoApproved: e.target.checked,
              });
            }}
            color="success"
          />
          ¿Todos los documentos fueron aprobados? {documentAproved.isAllDocumentsSiApoderadoApproved}
        </div>
      </div>
    </div>
  );
};
