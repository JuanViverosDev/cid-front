import { useState } from 'react';
import { StateBadge } from '../../../../components';
import { DocumentToEdit } from '../../components';
import Switch from '@mui/material/Switch';

export const InicioInvestigacionDisciplinaria = ({ roles, currentUser, setDocumentAproved, documentAproved }: any) => {
  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');
  return (
    <>
      <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
        <div className="w-full ml-4">
          <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">
            Documentos de investigación disciplinaria
          </h4>
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
                  <p className="text-sm underline">Auto Inicio Investigación Disciplinaria 1952.1</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Auto Inicio Investigación Disciplinaria 1952.1');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Auto Inicio Investigación Disciplinaria 1952.1' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Auto Inicio Investigación Disciplinaria 1952.1'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Memorando inicio investigación disciplinaria quejoso</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Memorando inicio investigación disciplinaria quejoso');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Memorando inicio investigación disciplinaria quejoso' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Memorando inicio investigación disciplinaria quejoso'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Memorando inicio investigación disciplinaria funcionario 1952.2</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('MMemorando inicio investigación disciplinaria funcionario 1952.2');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'MMemorando inicio investigación disciplinaria funcionario 1952.2' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'MMemorando inicio investigación disciplinaria funcionario 1952.2'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Oficio inicio investigación disciplinaria apoderado 1952.2</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Oficio inicio investigación disciplinaria apoderado 1952.2');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Oficio inicio investigación disciplinaria apoderado 1952.2' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Oficio inicio investigación disciplinaria apoderado 1952.2'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Oficio inicio investigación disciplinaria procuraduría 1952.2</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Oficio inicio investigación disciplinaria procuraduría 1952.2');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Oficio inicio investigación disciplinaria procuraduría 1952.2' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Oficio inicio investigación disciplinaria procuraduría 1952.2'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Oficio inicio investigación disciplinaria personería 1952.2</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Oficio inicio investigación disciplinaria personería 1952.2');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Oficio inicio investigación disciplinaria personería 1952.2' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Oficio inicio investigación disciplinaria personería 1952.2'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Notificación por edicto 1952.1</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Notificación por edicto 1952.1');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer && typeOfDocumentToEdit === 'Notificación por edicto 1952.1' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Notificación por edicto 1952.1'}
                        />
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Auto vario allegando pruebas ID 1952.1</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Auto vario allegando pruebas ID 1952.1');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer && typeOfDocumentToEdit === 'Auto vario allegando pruebas ID 1952.1' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Auto vario allegando pruebas ID 1952.1'}
                        />
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Auto vario ordenar pruebas ID 1952.1</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Auto vario ordenar pruebas ID 1952.1');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer && typeOfDocumentToEdit === 'Auto vario ordenar pruebas ID 1952.1' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Auto vario ordenar pruebas ID 1952.1'}
                        />
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Memorando para solicitar pruebas</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Memorando para solicitar pruebas');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer && typeOfDocumentToEdit === 'Memorando para solicitar pruebas' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Memorando para solicitar pruebas'}
                        />
                      )}
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
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
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
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">
                    Auto cierre investigación disciplinaria y alegatos precalificatorios 1952
                  </p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit(
                            'Auto cierre investigación disciplinaria y alegatos precalificatorios 1952',
                          );
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit ===
                          'Auto cierre investigación disciplinaria y alegatos precalificatorios 1952' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Auto cierre investigación disciplinaria y alegatos precalificatorios 1952'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Notificación cierre ID y aleg. prev apoderado</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Notificación cierre ID y aleg. prev apoderado');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Notificación cierre ID y aleg. prev apoderado' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Notificación cierre ID y aleg. prev apoderado'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Notificación cierre ID y aleg. prev disciplinado</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Notificación cierre ID y aleg. prev disciplinado');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Notificación cierre ID y aleg. prev disciplinado' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Notificación cierre ID y aleg. prev disciplinado'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Notificación por estados 1951.1</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Notificación por estados 1951.1');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer && typeOfDocumentToEdit === 'Notificación por estados 1951.1' && (
                        <DocumentToEdit
                          userLogged={currentUser}
                          openModalDocsViewer={openModalDocsViewer}
                          setOpenModalDocsViewer={setOpenModalDocsViewer}
                          documentName={'Notificación por estados 1951.1'}
                        />
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Constancia presentación alegatos precalificatorios 1951.3</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Constancia presentación alegatos precalificatorios 1951.3');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Constancia presentación alegatos precalificatorios 1951.3' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Constancia presentación alegatos precalificatorios 1951.3'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2">
                  <p className="text-sm underline">Constancia NO presentación alegatos precalificatorios 1951.3</p>
                </td>
                <td>
                  <StateBadge label={'Completado'} state="success" />
                </td>
                <td className="py-2 px-2">
                  {(currentUser === roles.profesionalInstruccion || currentUser === roles.directorInstruccion) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModalDocsViewer(true);
                          setTypeOfDocumentToEdit('Constancia NO presentación alegatos precalificatorios 1951.3');
                        }}
                        className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      >
                        Crear
                      </button>
                      {openModalDocsViewer &&
                        typeOfDocumentToEdit === 'Constancia NO presentación alegatos precalificatorios 1951.3' && (
                          <DocumentToEdit
                            userLogged={currentUser}
                            openModalDocsViewer={openModalDocsViewer}
                            setOpenModalDocsViewer={setOpenModalDocsViewer}
                            documentName={'Constancia NO presentación alegatos precalificatorios 1951.3'}
                          />
                        )}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ background: '#e8f5e9' }} className=" p-4 w-1/2">
            <Switch
              onChange={(e: any) => {
                setDocumentAproved({
                  ...documentAproved,
                  isAllDocumentosInicioInvestigacionDisciplinariaAproved: e.target.checked,
                });
              }}
              color="success"
            />
            ¿Todos los documentos fueron aprobados?
            {documentAproved.isAllDocumentosInicioInvestigacionDisciplinariaAproved}
          </div>
        </div>
      </div>
    </>
  );
};
