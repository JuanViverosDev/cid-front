import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit, ModalRecepcionRecurso } from '../../components';
import Switch from '@mui/material/Switch';

export const SiUtilizaRecursoApelacion = ({
  roles,
  currentUser,
  setDocumentAproved,
  documentAproved,
  handleModalRecursoApelacion,
  modalRecursoApelacion,
  setModalRecursoApelacion,
}: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
      <div className="w-full ml-4">
        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">Documentos de recurso de apelación</h4>
        <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
        <table className="w-1/2">
          <thead className=" bg-cidSecundaryGrey">
            <th className="text-sm py-4 px-4">Documento</th>
            <th className="text-sm py-4 px-4">Responsable</th>
            <th className="text-sm py-4 px-4">Acciones</th>
          </thead>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Recepción recurso de apelación</p>
            </td>
            <td className="py-2 px-2 text-xs font-bold">Ventanilla única</td>
            <td className="py-2 px-2 text-center">
              <button
                type="button"
                onClick={handleModalRecursoApelacion}
                className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
              >
                Crear
              </button>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Constancia secretarial si presenta recurso apelación</p>
            </td>
            <td className="py-2 px-2 text-xs font-bold">Secretaría común</td>
            <td className="py-2 px-2 text-center">
              <button
                type="button"
                onClick={() => {}}
                className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
              >
                Crear
              </button>
            </td>
          </tr>
        </table>
        {modalRecursoApelacion && (
          <ModalRecepcionRecurso setModalRecursoApelacion={setModalRecursoApelacion} modalRecursoApelacion />
        )}
      </div>
    </div>
  );
};
