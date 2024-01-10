import Modal from '@mui/material/Modal';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
//Helpers API
import Swal from 'sweetalert2';

import GlobalStyles from '@mui/material/GlobalStyles';
import docMock from '../../../../mocks/docMock.json';
import { Editor } from '@tinymce/tinymce-react';
import { createDocuments } from '../../../../services/documents.service';
import { useFetchAndLoad } from '../../../../hooks';
import { documentRequest } from '../../../../models/documentRequest.model';
// import Font from '@ckeditor/ckeditor5-font/src/font';

// import { createLegalDocs, updateLegalDocs } from '../../../../services';
//import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';

const inputGlobalStyles = (
  <GlobalStyles
    styles={{
      '.ck.ck-balloon-panel': {
        zIndex: '1400 !important', // Put a higher value that your MUI Dialog (generaly 1300)
      },
    }}
  />
);

export const DocumentToEdit = ({
  openModalDocsViewer,
  setOpenModalDocsViewer,
  setDocSaved,
  docSaved,
  docSelected,
  typeOfCRUDAction,
  documentName,
  userLogged,
  contentDocument,
  requestSelected,
  stage,
  rechargeDocuments,
  setRechargeDocuments,
  roles,
  rolesAdmitidos,
}: any) => {
  //const { callEndpoint } = useFetchAndLoad();

  const { callEndpoint } = useFetchAndLoad();

  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docState, setDocState] = useState('');
  // Get id to edit
  const [, setDocId] = useState('');

  const rolesByCode = {
    ventanillaUnica: 'b66409a7-08d4-49a5-8caf-5405fa2f289c',
    directorInstruccion: 'f7d3edd7-8450-471a-84a9-8d171786eb7d',
    profesionalInstruccion: 'bad7d867-8c7a-4490-821f-ce1518d5e0d0',
    secretariaComunJuzgamiento: '6e10b54c-168f-4d4e-bf0a-3a9d73ebf23d',
    secretariaComunInstruccion: 'dd1cdabc-d122-4a83-8b8a-2dd35d588c97',
    directorJuzgamiento: '398278a8-2e8e-4278-bf3c-55c7f7e1d299',
    profesionalJuzgamiento: 'edf9f711-ce54-4774-9f7f-b690c412aa3e',
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
  };

  const showToast = (icon: any, title: any, text: any) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
      text: text,
    });
  };

  useEffect(() => {
    setDocId(docSelected ? docSelected.id : '');
    setDocTitle(docSelected ? docSelected.title : '');
    setDocContent(docSelected ? docSelected.content : '');
    setDocState(docSelected ? docSelected.state : true);
  }, [openModalDocsViewer]);

  const checkDataForm = (body: any) => {
    return body.title === '' && body.content === '';
  };

  const handleSubmit = async (state: string) => {
    const body: documentRequest = {
      title: docTitle,
      content: docContent,
      state: state,
      stage: 1,
      requestId: requestSelected.id,
    };
    if (docSelected?.id) {
      body.id = docSelected.id;
    }
    if (checkDataForm(body)) {
      showToast('warning', 'Please, check your information', '');
    } else {
      try {
        const response = await callEndpoint(createDocuments(body));
        if (response.success) {
          showToast('success', '¡Documento modificado!', 'Recuerde verificar el documento antes de enviarlo');
        } else {
          showToast('warning', 'Por favor revise la información suministrada', response.message);
        }
        showToast('success', '¡Documento modificado!', '');
      } catch (error) {
        showToast('error', '¡Error!', 'Ha ocurrido un error');
      } finally {
        setRechargeDocuments(rechargeDocuments ? false : true);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setOpenModalDocsViewer(false);
  };

  const editorRef: any = useRef(null);

  return (
    <div>
      <Modal
        open={openModalDocsViewer}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {inputGlobalStyles}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8 divide-y divide-gray-200 p-5 relative test">
            {/*  Form Inputs   */}
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{documentName}</h3>
                </div>

                {/* Document Content */}
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                    <div className="mt-1 sm:mt-0 sm:col-span-3">
                      <Editor
                        apiKey="n5aqcz37s8tctrbtlmcq3zz7vxa9dd5uko0wr8e4wngkistv"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={contentDocument}
                        disabled={rolesAdmitidos.includes(userLogged) ? false : true}
                        init={{
                          height: 500,
                          menubar: 'edit view insert format tools table help',
                          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                          plugins: [
                            'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                          ],
                          toolbar:
                            'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                        onChange={(e) => setDocContent(e.target.getContent())}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  Action Buttons   */}
            <div className="pt-5 bottom-0 bg-white left-0 right-0 mt-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpenModalDocsViewer(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>

                {rolesAdmitidos.includes(userLogged) && (
                  <>
                    {(userLogged !== roles.directorInstruccion && userLogged !== roles.directorJuzgamiento) && (
                      <div>
                        <button
                          type="submit"
                          onClick={() => handleSubmit('Borrador')}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary"
                        >
                          Guardar como borrador
                        </button>

                        <button
                          type="submit"
                          onClick={() => handleSubmit('Completado')}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cidPrimaryGreen"
                        >
                          Guardar y marcar completado
                        </button>
                        <button
                          type="submit"
                          onClick={() => handleSubmit('Aceptado')}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cidPrimaryGreen"
                        >
                          Inhabilitar
                        </button>
                      </div>
                    )}
                    {(userLogged === roles.directorInstruccion || userLogged === roles.directorJuzgamiento) && (
                      <div>
                        <button
                          type="submit"
                          onClick={() => handleSubmit('Modificar')}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary"
                        >
                          Rechazar
                        </button>

                        <button
                          type="submit"
                          onClick={() => handleSubmit('Aceptado')}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cidPrimaryGreen"
                        >
                          Aceptar
                        </button>
                        <button
                          type="submit"
                          onClick={() => handleSubmit('Aceptado')}
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cidPrimaryGreen"
                        >
                          Inhabilitar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
