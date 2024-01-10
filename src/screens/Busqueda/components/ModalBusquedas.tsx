import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

//Helpers API
import Swal from 'sweetalert2';
import { createTemplates, updateTemplates } from '../../../services';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

export const ModalBusquedas = ({
  openModal,
  setOpenModal,
  setPublicDefenderSaved,
  publicDefenderSaved,
  plantillaSelected,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const editorRef: any = useRef(null);


  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [requestStage, setRequestStage] = useState<any>(0);
  const [documentType, setDocumentType] = useState<any>('');
  const [order, setOrder] = useState('0');
  const [consecutive, setConsecutive] = useState(0);
  const [vario, setVario] = useState(false);
  const [onBase, setOnBase] = useState(false);

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

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '80%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
  };

  useEffect(() => {
    setTemplateName(plantillaSelected ? plantillaSelected.templateName : '');
    setRequestStage(plantillaSelected ? plantillaSelected?.requestStage?.id : 0);
    setTemplateContent(plantillaSelected ? plantillaSelected.content : '');
    setOrder(plantillaSelected ? plantillaSelected.order : '0');
    setConsecutive(plantillaSelected ? plantillaSelected.consecutive : 0);
    setVario(plantillaSelected ? plantillaSelected.isVario : false);
    setOnBase(plantillaSelected ? plantillaSelected.onBase : false);
    setDocumentType(plantillaSelected ? plantillaSelected.documentType : '');
  }, [openModal]);

  const checkDataForm = (body: any) => {
    return body.templateName !== '' && body.templateContent !== '' && body.requestStage !== 0;
  };

  const handleSubmit = async () => {
    const body = {
      templateName,
      templateContent,
      requestStage,
      order,
      isVario: vario,
      consecutive,
      documentType,
    };
    if (!checkDataForm(body)) {
      showToast('warning', 'Comprueba todos los campos', '');
    } else {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createTemplates(body));
          if (response.success) {
            setOpenModal(false);
            setPublicDefenderSaved(!publicDefenderSaved);
            showToast('success', '¡Plantilla creada!', '');
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateTemplates({ ...body, id: plantillaSelected.id }));
          if (response.success) {
            showToast('success', 'Plantilla actualizada!', '');
            setOpenModal(false);
            //Reload list with newRole
            setPublicDefenderSaved(!publicDefenderSaved);
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
        } else {
          showToast('warning', 'Por favor revise la información suministrada', '');
        }
      } catch (error) {
        showToast('error', 'Ocurrió un error haciendo la consulta', 'Por favor comuníquese con soporte técnico');
      }
    }
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Drawer className="w-screen" anchor="right" open={openModal} onClose={() => setOpenModal(!openModal)}> */}
          <form onSubmit={(e) => e.preventDefault()} className="divide-y p-5 relative test">
            {/*  Form Inputs   */}
            <div className="mt-5">
              <Editor
                apiKey="n5aqcz37s8tctrbtlmcq3zz7vxa9dd5uko0wr8e4wngkistv"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={templateContent}
                init={{
                  height: 500,
                  menubar: '',
                  quickbars_selection_toolbar: '',
                  plugins: [
                    '',
                  ],
                  toolbar:
                    '',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                disabled
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
