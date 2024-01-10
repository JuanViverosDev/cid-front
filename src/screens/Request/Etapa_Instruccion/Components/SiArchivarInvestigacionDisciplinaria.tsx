import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';
import Switch from '@mui/material/Switch';

export const SiArchivarInvestigacionDisciplinaria = ({
  roles,
  currentUser,
  setDocumentAproved,
  documentAproved,
}: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
      <div className="w-full ml-4">
        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">
          Documentos de archivo de investigación disciplinaria
        </h4>
        <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
        <table className="w-1/2">
          <thead className=" bg-cidSecundaryGrey">
            <th className="text-sm py-4 px-4">Documento</th>
            <th className="text-sm py-4 px-4">Estado</th>
            <th className="text-sm py-4 px-4">Acciones</th>
          </thead>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Auto archivo investigación disciplinaria</p>
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
                      setTypeOfDocumentToEdit('Auto archivo investigación disciplinaria');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer && typeOfDocumentToEdit === 'Auto archivo investigación disciplinaria' && (
                    <DocumentToEdit
                      userLogged={currentUser}
                      openModalDocsViewer={openModalDocsViewer}
                      setOpenModalDocsViewer={setOpenModalDocsViewer}
                      documentName={'Auto archivo investigación disciplinaria'}
                    />
                  )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Memorando archivo investigación disciplinaria quejoso</p>
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
                      setTypeOfDocumentToEdit('Memorando archivo investigación disciplinaria quejoso');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Memorando archivo investigación disciplinaria quejoso' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Memorando archivo investigación disciplinaria quejoso'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Memorando archivo investigación disciplinaria funcionario</p>
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
                      setTypeOfDocumentToEdit('Memorando archivo investigación disciplinaria funcionario');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Memorando archivo investigación disciplinaria funcionario' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Memorando archivo investigación disciplinaria funcionario'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Oficio archivo de investigación disciplinaria procuraduría</p>
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
                      setTypeOfDocumentToEdit('Oficio archivo de investigación disciplinaria procuraduría');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Oficio archivo de investigación disciplinaria procuraduría' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Oficio archivo de investigación disciplinaria procuraduría'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Oficio archivo de investigación disciplinaria personería</p>
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
                      setTypeOfDocumentToEdit('Oficio archivo de investigación disciplinaria personería');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Oficio archivo de investigación disciplinaria personería' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Oficio archivo de investigación disciplinaria personería'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Notificación archivo investigación disciplinaria disciplinado</p>
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
                      setTypeOfDocumentToEdit('Notificación archivo investigación disciplinaria disciplinado');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Notificación archivo investigación disciplinaria disciplinado' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Notificación archivo investigación disciplinaria disciplinado'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-2">
              <p className="text-sm underline">Notificación archivo investigación disciplinaria apoderado</p>
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
                      setTypeOfDocumentToEdit('Notificación archivo investigación disciplinaria apoderado');
                    }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    Crear
                  </button>
                  {openModalDocsViewer &&
                    typeOfDocumentToEdit === 'Notificación archivo investigación disciplinaria apoderado' && (
                      <DocumentToEdit
                        userLogged={currentUser}
                        openModalDocsViewer={openModalDocsViewer}
                        setOpenModalDocsViewer={setOpenModalDocsViewer}
                        documentName={'Notificación archivo investigación disciplinaria apoderado'}
                      />
                    )}
                </>
              )}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};
