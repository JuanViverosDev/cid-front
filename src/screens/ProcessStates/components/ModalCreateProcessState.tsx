import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';

//Helpers API
import Swal from 'sweetalert2';
import { createProcessState, updateProcessState } from '../../../services';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

export const ModalCreateProcessState = ({
  openModal,
  setOpenModal,
  setProcessStateSaved,
  processStateSaved,
  processState,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [processStateName, setProcessStateName] = useState('');
  const [processState_State, setProcessState_State] = useState(false);

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
    setProcessStateName(processState ? processState.processStateName : '');
    setProcessState_State(processState ? processState.processStateState : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const handleStateSelected = (event: any) => {
    setProcessState_State(event.target.value === 'true');
  };

  const checkDataForm = (body: any) => {
    return body.processStateName === '';
  };

  const handleSubmit = async () => {
    const body = {
      processStateName: processStateName,
      processStateState: processState_State,
    };
    if (checkDataForm(body)) {
      showToast('warning', 'Debe diligenciar el nombre del proceso', '');
    } else {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createProcessState(body));
          if (response.success) {
            setOpenModal(false);
            setProcessStateSaved(!processStateSaved);
            showToast('success', '¡Estado creado!', '');
          } else {
            showToast('warning', 'Por favor, revise la información suministrada', response.message);
          }
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateProcessState(processState, body));
          if (response.success) {
            showToast('success', '¡Estado actualizado!', '');
            setOpenModal(false);
            //Reload list with newRole
            setProcessStateSaved(!processStateSaved);
          } else {
            showToast('warning', 'Por favor, revise la información suministrada', response.message);
          }
        }
      } catch (error) {
        showToast('error', 'Ocurrio un error realizando la consulta.', 'Por favor contacte a soporte técnico');
      }
    }
  };

  return (
    <div>
      <Drawer className="w-screen" anchor="right" open={openModal} onClose={() => setOpenModal(!openModal)}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8 divide-y divide-gray-200 p-5 relative test">
          {/*  Form Inputs   */}
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-primary">Nuevo estado de proceso</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Diligencie los siguientes campos para crear o editar el estado de proceso.
                </p>
              </div>
              {/*  Name */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="office-name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Nombre del estado
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="office-name"
                        id="office-name"
                        value={processStateName ? processStateName : ''}
                        autoComplete="office-name"
                        onChange={(e) => setProcessStateName(e.target.value)}
                        maxLength={100}
                        placeholder="Ingrese el nombre aquí..."
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* State */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Estado
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="state"
                      name="state"
                      autoComplete="state"
                      value={`${processState_State}`}
                      onChange={(e): any => {
                        handleStateSelected(e);
                      }}
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  Action Buttons   */}
          <div className="pt-5 sticky bottom-0 bg-white left-0 right-0 p-5 pr-0">
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
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
