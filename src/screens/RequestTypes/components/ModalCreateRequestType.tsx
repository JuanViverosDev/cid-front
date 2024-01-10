import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";

//Helpers API
import Swal from "sweetalert2";
/* import { createBankOffice, updateBankOffice } from '../../../services'; */
import useFetchAndLoad from "../../../hooks/useFetchAndLoad";
import { createRequestTypes, updateRequestTypes } from "../../../services";

export const ModalCreateRequestType = ({
  openModal,
  setOpenModal,
  setRequestTypeSaved,
  requestTypeSaved,
  requestType,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [requestTypeName, setRequestTypeName] = useState("");
  /* const [requestTypeCode, setRequestTypeCode] = useState<any>(0); */
  /* const [requestTypeIsGenerateMinutes, setRequestTypeIsGenerateMinutes] =
    useState(false); */
  const [requestTypeState, setRequestTypeState] = useState(false);

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
    setRequestTypeName(requestType ? requestType.typeReqName : "");
    /* setRequestTypeCode(requestType ? requestType.id : 0); */
    /* setRequestTypeIsGenerateMinutes(
      requestType ? requestType.is_generate_minutes : true
    ); */
    setRequestTypeState(requestType ? requestType.typeReqState : true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const handleStateSelected = (event: any) => {
    setRequestTypeState(event.target.value === "true");
  };
  /* const handleIsGenerateMinutesSelected = (event: any) => {
    setRequestTypeIsGenerateMinutes(event.target.value === "true");
  }; */

  const checkDataForm = (body: any) => {
    return body.typeReqName === "";
  };

  const handleSubmit = async () => {
    const body = {
      typeReqName: requestTypeName,
      typeReqState: requestTypeState,
    };
    if (checkDataForm(body)) {
      showToast("warning", "Por favor, revise la información", "");
    } else {
      try {
        if (typeOfCRUDAction === "create") {
          const response = await callEndpoint(createRequestTypes(body));
          if (response.success) {
            setOpenModal(false);
            setRequestTypeSaved(!requestTypeSaved);
            showToast("success", "¡Tipo de solicitud creada!", "");
          } else {
            showToast(
              "warning",
              "Por favor, revise la información",
              response.message
            );
          }
        } else if (typeOfCRUDAction === "edit") {
          const response = await callEndpoint(
            updateRequestTypes(requestType, body)
          );
          if (response.success) {
            showToast("success", "¡Tipo de solictud actualizada!", "");
            setOpenModal(false);
            setRequestTypeSaved(!requestTypeSaved);
          } else {
            showToast(
              "warning",
              "Please, check your information",
              response.message
            );
          }
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
                  Nuevo Tipo de Solicitud
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                  Diligencie los siguientes campos para crear o editar el tipo
                  de solicitud.
                </p>
              </div>
              {/*  Name */}
              <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5'>
                  <label
                    htmlFor='office-name'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    Nombre de la solicitud
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <div className='max-w-lg flex rounded-md shadow-sm'>
                      <input
                        required
                        type='text'
                        name='office-name'
                        id='office-name'
                        value={requestTypeName ? requestTypeName : ""}
                        autoComplete='office-name'
                        onChange={(e) => setRequestTypeName(e.target.value)}
                        maxLength={100}
                        placeholder='Ingrese el nombre aquí...'
                        className='max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5'>
                  <label
                    htmlFor='is_generate_minutes'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    is Generate Minutes
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <select
                      id='is_generate_minutes'
                      name='is_generate_minutes'
                      autoComplete='is_generate_minutes'
                      value={`${requestTypeIsGenerateMinutes}`}
                      onChange={(e): any => {
                        handleIsGenerateMinutesSelected(e);
                      }}
                      className='max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
                    >
                      <option value='true'>Si</option>
                      <option value='false'>No</option>
                    </select>
                  </div>
                </div>
              </div> */}

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
                      value={`${requestTypeState}`}
                      onChange={(e): any => {
                        handleStateSelected(e);
                      }}
                      className='max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
                    >
                      <option value='true'>Activo</option>
                      <option value='false'>Inactivo</option>
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
