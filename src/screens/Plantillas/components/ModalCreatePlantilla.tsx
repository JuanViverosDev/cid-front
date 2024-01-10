import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

//Helpers API
import Swal from 'sweetalert2';
import { createTemplates, updateTemplates } from '../../../services';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { getAllStages } from '../../../services/stages.service';
import { getAllStates } from '../../../services/fechasVenc.service';

export const ModalCreatePlantilla = ({
  openModal,
  setOpenModal,
  setPublicDefenderSaved,
  publicDefenderSaved,
  plantillaSelected,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const editorRef: any = useRef(null);

  const [seComunicaQuejoso, setSeComunicaQuejoso] = useState(false);
  const [seComunicaDisciplinado, setSeComunicaDisciplinado] = useState(false);
  const [seNotificaQuejoso, setSeNotificaQuejoso] = useState(false);
  const [seNotificaDisciplinado, setSeNotificaDisciplinado] = useState(false);
  const [seNotificaApoderado, setSeNotificaApoderado] = useState(false);
  const [seComunicaApoderado, setSeComunicaApoderado] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [requestStage, setRequestStage] = useState<any>(0);
  const [documentType, setDocumentType] = useState<any>('');
  const [order, setOrder] = useState('0');
  const [consecutive, setConsecutive] = useState(0);
  const [vario, setVario] = useState(false);
  const [onBase, setOnBase] = useState(false);
  const [stages, setStages] = useState<any>([]);
  const [states, setStates] = useState<any>([]);

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
    setRequestStage(plantillaSelected ? plantillaSelected?.requestState?.id : 0);
    setTemplateContent(plantillaSelected ? plantillaSelected.templateContent : '');
    setOrder(plantillaSelected ? plantillaSelected.order : '0');
    setConsecutive(plantillaSelected ? plantillaSelected.consecutive : 0);
    setVario(plantillaSelected ? plantillaSelected.isVario : false);
    setOnBase(plantillaSelected ? plantillaSelected.onBase : false);
    setDocumentType(plantillaSelected ? plantillaSelected.documentType : '');
    setSeComunicaQuejoso(plantillaSelected ? plantillaSelected.seComunicaQuejoso : false);
    setSeComunicaDisciplinado(plantillaSelected ? plantillaSelected.seComunicaDisciplinado : false);
    setSeNotificaQuejoso(plantillaSelected ? plantillaSelected.seNotificaQuejoso : false);
    setSeNotificaDisciplinado(plantillaSelected ? plantillaSelected.seNotificaDisciplinado : false);
    setSeNotificaApoderado(plantillaSelected ? plantillaSelected.seNotificaApoderado : false);
    setSeComunicaApoderado(plantillaSelected ? plantillaSelected.seComunicaApoderado : false);
    callEndpoint(getAllStages()).then((response) => {
      setStages(response?.data);
    });
    const getStates = async () => {
      try {
        const response = await callEndpoint(getAllStates());
        response?.success && setStates(response.data);
      } catch (error) {
        showToast('error', 'Ocurrio un error cargando la información', 'Contacte a soporte técnico');
      }
    };
    getStates();
  }, [openModal]);

  const checkDataForm = (body: any) => {
    return body.templateName !== '' && body.templateContent !== '' && body.requestStage !== 0;
  };

  const handleSubmit = async () => {
    const body = {
      templateName,
      templateContent,
      // requestStage,
      order,
      isVario: vario,
      consecutive,
      documentType,
      seComunicaDisciplinado,
      seComunicaQuejoso,
      seNotificaDisciplinado,
      seNotificaQuejoso,
      seNotificaApoderado,
      seComunicaApoderado, 
      requestStateId: Number(requestStage),
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
            <div className="space-y-8 divide-y sm:space-y-5">
              <div>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-primary">Nueva plantilla</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Diligencie los campos para crear una nueva plantilla.
                    </p>
                  </div>
                  {/*  Action Buttons   */}
                  <div className="pt-5 bottom-0 bg-white left-0 right-0 ">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
                {/* name */}
                <div className="grid grid-cols-3 gap-10">
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 pb-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:pt-5">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px">
                        Nombre
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <input
                            required
                            type="text"
                            name="name"
                            id="name"
                            value={templateName ? templateName : ''}
                            autoComplete="name"
                            onChange={(e) => setTemplateName(e.target.value)}
                            maxLength={200}
                            className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 pb-5">
                      <label
                        htmlFor="requestStage"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Estado
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <select
                            required
                            name="requestStage"
                            id="requestStage"
                            value={requestStage ? requestStage : ''}
                            autoComplete="requestStage"
                            onChange={(e) => setRequestStage(e.target.value)}
                            className="max-w-lg flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          >
                            <option value={null}>Seleccione</option>
                            {states.map((state) => (
                              <option key={state.id} value={state.id}>
                                {state.stateName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 pb-5">
                      <label
                        htmlFor="requestStage"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Orden
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <input
                            required
                            type="number"
                            name="requestStage"
                            id="requestStage"
                            value={order ? order : ''}
                            onChange={(e) => setOrder(e.target.value)}
                            className="max-w-lg flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <div className="grid grid-cols-3 gap-10">
                      <div className="">
                        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start pt-5">
                          <label
                            htmlFor="requestStage"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Consecutivo
                          </label>
                          <div className="mt-1 sm:mt-0 sm:col-span-2">
                            <div className="max-w-lg flex rounded-md shadow-sm">
                              <input
                                type="number"
                                name="requestStage"
                                id="requestStage"
                                value={consecutive ? consecutive : ''}
                                onChange={(e) => setConsecutive(e.target.value)}
                                className="max-w-lg flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6 sm:space-y-5 pt-5">
                        <div className="sm:grid sm:grid-cols-3">
                          <label
                            htmlFor="requestStage"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Tipo de documento
                          </label>
                          <div className="max-w-lg flex rounded-md shadow-sm col-span-2">
                            <select
                              required
                              name="requestStage"
                              id="requestStage"
                              value={documentType ? documentType : ''}
                              autoComplete="requestStage"
                              onChange={(e) => setDocumentType(e.target.value)}
                              className="max-w-lg flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            >
                              <option value={null}>Seleccione</option>
                              <option value={'Memorando'}>Memorando</option>
                              <option value={'Oficio'}>Oficio</option>
                              <option value={'Auto'}>Auto</option>
                              <option value={'Recurso de reposición'}>Recurso de reposición</option>
                              <option value={'Constancia secretarial'}>Constancia secretarial</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Sistema Gestión Documental
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={onBase ? onBase : false}
                                  onChange={(e) => setOnBase(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Es vario
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={vario ? vario : false}
                                  onChange={(e) => setVario(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-10 mt-5 pb-5">
                      <div className="grid grid-cols-3 gap-5">
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Se comunica quejoso
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={seComunicaQuejoso ? seComunicaQuejoso : false}
                                  onChange={(e) => setSeComunicaQuejoso(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Se comunica disciplinado
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={seComunicaDisciplinado ? seComunicaDisciplinado : false}
                                  onChange={(e) => setSeComunicaDisciplinado(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Se comunica apoderado
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={seComunicaApoderado ? seComunicaApoderado : false}
                                  onChange={(e) => setSeComunicaApoderado(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-5">
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Se notifica quejoso
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={seNotificaQuejoso ? seNotificaQuejoso : false}
                                  onChange={(e) => setSeNotificaQuejoso(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Se notifica disciplinado
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={seNotificaDisciplinado ? seNotificaDisciplinado : false}
                                  onChange={(e) => setSeNotificaDisciplinado(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6 sm:space-y-5">
                          <div className="flex items-center sm:gap-4 sm:items-start pt-5">
                            <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                              Se notifica apoderado
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                              <div className="max-w-lg flex rounded-md shadow-sm">
                                <input
                                  type="checkbox"
                                  name="requestStage"
                                  id="requestStage"
                                  checked={seNotificaApoderado ? seNotificaApoderado : false}
                                  onChange={(e) => setSeNotificaApoderado(e.target.checked)}
                                  className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Editor
                apiKey="n5aqcz37s8tctrbtlmcq3zz7vxa9dd5uko0wr8e4wngkistv"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={templateContent}
                init={{
                  height: 300,
                  menubar: 'edit view insert format tools table help',
                  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                  plugins: [
                    'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                  ],
                  toolbar:
                    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onChange={(e) => setTemplateContent(e.target.getContent())}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
