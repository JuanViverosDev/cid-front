import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";

//Helpers API
import Swal from "sweetalert2";
/* import { createBankOffice, updateBankOffice } from '../../../services'; */
/* import useFetchAndLoad from '../../../hooks/useFetchAndLoad'; */

export const ModalCreateSystem = ({
  openModal,
  setOpenModal,
  setSystemSaved,
  systemSaved,
  system,
  typeOfCRUDAction,
}: any) => {
  /* const { callEndpoint } = useFetchAndLoad(); */

  const [systemName, setSystemName] = useState("");
  const [systemCode, setSystemCode] = useState<any>(0);
  const [systemState, setSystemState] = useState(false);

  const showToast = (icon: any, title: any, text: any) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
      text: text,
    });
  };

  useEffect(() => {
    setSystemName(system ? system.name : "");
    setSystemCode(system ? system.id : 0);
    setSystemState(system ? system.state : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const handleStateSelected = (event: any) => {
    setSystemState(event.target.value === "true");
  };

  const checkDataForm = (body: any) => {
    return body.requestTypeName === "" || body.requestTypeCode === "";
  };

  const handleSubmit = async () => {
    const body = {
      name: systemName,
      id: systemCode,
      state: systemState,
    };
    if (checkDataForm(body)) {
      showToast("warning", "Please, check your information", "");
    } else {
      try {
        if (typeOfCRUDAction === "create") {
          // const response = await callEndpoint(createBankOffice(body));
          // if (response.success) {
          //   setOpenModal(false);
          //   setRequestTypeSaved(!requestTypeSaved);
          //   showToast('success', 'Office created successfully.', '');
          // } else {
          //   showToast('warning', 'Please, check your information', response.message);
          // }
          setOpenModal(false);
          setSystemSaved(!systemSaved);
          showToast("success", "¡Sistema creada!", "");
        } else if (typeOfCRUDAction === "edit") {
          // const response = await callEndpoint(updateBankOffice(requestType, body));
          // if (response.success) {
          //   showToast('success', 'Office updated successfully.', '');
          //   setOpenModal(false);
          //   //Reload list with newRole
          //   setRequestTypeSaved(!requestTypeSaved);
          // } else {
          //   showToast('warning', 'Please, check your information', response.message);
          // }
          showToast("success", "¡Sistema actualizado!", "");
          setOpenModal(false);
          setSystemSaved(!systemSaved);
        } else {
          showToast(
            "warning",
            "Please, check your information",
            "You must register a valid email address"
          );
        }
      } catch (error) {
        showToast(
          "error",
          "Please, contact with support department",
          "An error occurred doing the request."
        );
      }
    }
  };

  return (
    <div>
      <Drawer
        className='w-screen'
        anchor='right'
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className='space-y-8 divide-y divide-gray-200 p-5 relative test'
        >
          {/*  Form Inputs   */}
          <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
            <div>
              <div>
                <h3 className='text-lg leading-6 font-medium text-primary'>
                  Nuevo sistema
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                  Diligencie los siguientes campos para crear o editar el
                  sistema.
                </p>
              </div>
              {/*  Name */}
              <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5'>
                  <label
                    htmlFor='office-name'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    Nombre del sistema
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <div className='max-w-lg flex rounded-md shadow-sm'>
                      <input
                        required
                        type='text'
                        name='office-name'
                        id='office-name'
                        value={systemName ? systemName : ""}
                        autoComplete='office-name'
                        onChange={(e) => setSystemName(e.target.value)}
                        maxLength={100}
                        placeholder='Nombre del sistema...'
                        className='max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* State */}
              <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5'>
                  <label
                    htmlFor='state'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    State
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <select
                      id='state'
                      name='state'
                      autoComplete='state'
                      value={`${systemState}`}
                      onChange={(e): any => {
                        handleStateSelected(e);
                      }}
                      className='max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
                    >
                      <option value='true'>Active</option>
                      <option value='false'>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  Action Buttons   */}
          <div className='pt-5 sticky bottom-0 bg-white left-0 right-0 p-5 pr-0'>
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={() => setOpenModal(false)}
                className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Cancelar
              </button>
              <button
                type='submit'
                onClick={handleSubmit}
                className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary'
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
