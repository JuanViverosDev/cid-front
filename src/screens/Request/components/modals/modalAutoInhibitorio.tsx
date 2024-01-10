import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ModalAutoInhibitorio = ({ modalInhibitorio, setModalInhibitorio, dataInhibitorio }: any) => {
  const handleClose = () => setModalInhibitorio(false);
  return (
    <div>
      <Modal
        open={modalInhibitorio}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p className="pb-5">
            <b>Nota: </b> Para continuar, complete (si aplica) los siguientes campos para la generación del documento
            inhibitorio del caso.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Nº de Expendiente</label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  disabled
                  value={dataInhibitorio.expediente}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Nº de Radicado</label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  disabled
                  value={dataInhibitorio.radicado}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5 hidden">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Consecutivo inhibitorio</label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Nombre del solicitante</label>
                <input
                  type="text"
                  name="first-name"
                  value={dataInhibitorio.nombreSolicitante}
                  id="first-name"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Fecha de la queja (Día - Mes - Año)</label>
                <input
                  type="date"
                  name="first-name"
                  id="first-name"
                  disabled
                  value={'2022-11-07'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Número de anexos</label>
                <input
                  type="number"
                  name="first-name"
                  id="first-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Calidad del solicitante</label>
                <input
                  type="text"
                  value={dataInhibitorio.calidadSolicitante}
                  name="first-name"
                  id="first-name"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Nombre completo del funcionario</label>
                <input
                  type="text"
                  name="first-name"
                  value={dataInhibitorio.nombreFuncionario}
                  id="first-name"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Nombre del director</label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Nombre del funcionario asignado</label>
                <input
                  type="text"
                  name="first-name"
                  value={dataInhibitorio.nombreFuncionarioAsignado}
                  id="first-name"
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 bottom-0 bg-white left-0 right-0 pr-0">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary"
              >
                Crear inhibitorio
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
