import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

//Helpers API
import Swal from 'sweetalert2';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { updateStates } from '../../../services/fechasVenc.service';
import { getAllRoles } from '../../../services';

export const ModalCreateFechasVenc = ({
  openModal,
  setOpenModal,
  setPublicDefenderSaved,
  publicDefenderSaved,
  plantillaSelected,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const editorRef: any = useRef(null);

  const [stateName, setStateName] = useState('');
  const [diasVigencia, setDiasVigencia] = useState('');
  const [diasHabiles, setDiasHabiles] = useState(false);
  const [alertasDias, setAlertasDias] = useState(null);
  const [roles, setRoles] = useState<any>([]);

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
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
  };

  useEffect(() => {
    callEndpoint(getAllRoles()).then((response: any) => {
      response.data.map((role: any) => {
        plantillaSelected?.alertRoles?.find((alertRole: any) => alertRole.id === role.id)
          ? (role.checked = true)
          : (role.checked = false);
      });
      setRoles(response.data);
    });
    setStateName(plantillaSelected ? plantillaSelected.stateName : '');
    setDiasHabiles(plantillaSelected ? plantillaSelected.isBusinessDays : false);
    setDiasVigencia(plantillaSelected ? plantillaSelected.days : '');
    setAlertasDias(plantillaSelected ? plantillaSelected.previousDays : '');
  }, [openModal, plantillaSelected]);

  const checkDataForm = (body: any) => {
    return body.stateName !== '' && body.templateContent !== '' && body.requestStage !== 0;
  };

  const handleSubmit = async () => {
    const body = {
      stateId: plantillaSelected ? plantillaSelected.id : 0,
      stateName: stateName,
      days: diasVigencia,
      isBusinessDays: diasHabiles,
      previousDays: alertasDias,
      alertRoles: roles.filter((role: any) => role.checked === true).map((role: any) => role.id),
    };
    if (!checkDataForm(body)) {
      showToast('warning', 'Comprueba todos los campos', '');
    } else {
      try {
        if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateStates(body));
          if (response.success) {
            setOpenModal(false);
            setPublicDefenderSaved(!publicDefenderSaved);
            showToast('success', '¡Plantilla creada!', '');
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
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
                <div>
                  <h3 className="text-lg leading-6 font-medium text-primary">Editar fecha de vigencia</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Edite la fecha de vigencia de cada estado.</p>
                </div>
                {/* name */}
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 pb-5">
                  <div className="sm:grid sm:gap-4 sm:items-center sm:pt-5">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px">
                      Nombre del estado:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                          required
                          type="text"
                          name="name"
                          id="name"
                          disabled
                          value={stateName ? stateName : ''}
                          autoComplete="name"
                          onChange={(e) => setStateName(e.target.value)}
                          className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 pb-5">
                    <div className="sm:grid sm:gap-4 sm:items-center sm:pt-5">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px">
                        Días de vigencia:
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <input
                            required
                            type="number"
                            name="name"
                            id="name"
                            value={diasVigencia ? diasVigencia : ''}
                            autoComplete="name"
                            onChange={(e) => setDiasVigencia(e.target.value)}
                            maxLength={200}
                            className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 pb-5">
                    <div className="sm:grid sm:gap-4 sm:items-center sm:pt-5">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px">
                        Alertas días anterior:
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <input
                            required
                            type="number"
                            name="name"
                            id="name"
                            value={alertasDias ? alertasDias : ''}
                            onChange={(e) => setAlertasDias(e.target.value)}
                            maxLength={200}
                            className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:gap-4 sm:items-start sm:pt-5 pb-5">
                      <label htmlFor="requestStage" className="block text-sm font-medium text-gray-700 sm:mt-px">
                        Días hábiles:
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex rounded-md shadow-sm">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-indigo-600"
                            checked={diasHabiles}
                            onChange={(e) => setDiasHabiles(e.target.checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 pb-5">
                  <div className="sm:grid sm:gap-4 sm:items-center sm:pt-5">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px">
                      Roles por alertar:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-3xl flex rounded-md shadow-sm overflow-x-auto gap-10 p-5">
                        {roles.map((role: any) => (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-indigo-600"
                              checked={role.checked}
                              onChange={(e) => {
                                role.checked = e.target.checked;
                                setRoles([...roles]);
                              }}
                            />
                            <label className="ml-3 block text-sm font-medium text-gray-700">{role?.roleName}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  Action Buttons   */}
            <div className="pt-5 bottom-0 bg-white left-0 right-0">
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
          </form>
        </Box>
      </Modal>
    </div>
  );
};
