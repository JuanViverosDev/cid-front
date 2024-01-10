/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, XIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { updateProcessState_State } from '../../../services';

export const ModalUpdateProcessStateState = ({
  openModal,
  setOpenModal,
  processState,
  setProcessStateSaved,
  processStateSaved,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

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

  const handleSubmit = async () => {
    const body = {
      processStateState: !processState.processStateState,
    };

    try {
      const response = await callEndpoint(updateProcessState_State(processState, body));

      if (response.success) {
        setOpenModal(false);
        //Reload list with newRole
        setProcessStateSaved(!processStateSaved);
        showToast('success', '¡Estado actualizado!', '');
      } else {
        showToast('error', 'Por favor comuníquese con soporte técnico', response.message);
      }
    } catch (error) {
      showToast('error', 'Ocurrio un error realizando la consulta', 'Por favor comuníquese con soporte técnico');
    }
  };
  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={setOpenModal}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  onClick={() => setOpenModal(false)}
                >
                  <span className="sr-only">Cerrar</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationIcon
                    className={
                      'h-6 w-6 ' +
                      (processState.processStateState ? ' text-cidTertiaryLightPurple' : ' text-cidPrimaryGreen')
                    }
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Cambiar estado del estado
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {processState.processStateState
                        ? '¿Estás seguro(a) que desea bloquear este estado?'
                        : '¿Estás seguro(a) que desea desbloquear este estado?'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:white sm:ml-3 sm:w-auto sm:text-sm' +
                    (processState.processStateState
                      ? ' hover:bg-hovercidTertiaryLightPurple bg-cidTertiaryLightPurple'
                      : ' hover:bg-hovercidPrimaryGreen bg-cidPrimaryGreen')
                  }
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  {processState.processStateState ? 'Bloquear este estado' : 'Desbloquear este estado'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpenModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
