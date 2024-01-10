import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Swal from 'sweetalert2';

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

export const ModalRecepcionRecurso = ({ setModalRecursoApelacion, modalRecursoApelacion }: any) => {
  const handleClose = () => setModalRecursoApelacion(false);
  const [tipoDocumentalModal, setTipoDocumentalModal] = useState('memorando');
  const [calidadSolicitante, setCalidadSolicitante] = useState('quejoso');
  const [nombreApelante, setNombreApelante] = useState('');
  const [fechaHoraRecurso, setFechaHoraRecurso] = useState<any>('');
  const [usuarioRecepciona, setUsuarioRecepciona] = useState('');
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [radicadoVentanillaUnica, setRadicadoVentanillaUnica] = useState('');
  const [asunto, setAsunto] = useState('');
  const [anexos, setAnexos] = useState('');

  const isValidForm = () =>
    tipoDocumentalModal === '' ||
    calidadSolicitante === '' ||
    nombreApelante === '' ||
    fechaHoraRecurso === '' ||
    usuarioRecepciona === '' ||
    numeroExpediente === '' ||
    radicadoVentanillaUnica === '' ||
    asunto === '';

  const saveResource = () => {
    if (isValidForm()) {
      showToast('warning', 'Formulario incompleto', 'Recuerda que algunos campos son obligatorios');
    } else {
      setModalRecursoApelacion(false);
    }
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

  return (
    <div>
      <Modal
        open={modalRecursoApelacion}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p className="pb-5">
            <b>Nota: </b> Para continuar, complete los siguientes campos para la generación del recurso.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Nº de Expendiente <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <input
                  type="text"
                  name="first-name"
                  value={numeroExpediente}
                  onChange={(e) => setNumeroExpediente(e.target.value)}
                  id="first-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Nº de Radicado Ventanilla Única <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <input
                  type="text"
                  name="first-name"
                  value={radicadoVentanillaUnica}
                  onChange={(e) => setRadicadoVentanillaUnica(e.target.value)}
                  id="first-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Tipo documental <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <select
                  id="userAgent"
                  name="documentalType"
                  autoComplete="documentalType"
                  value={`${tipoDocumentalModal}`}
                  onChange={(e): any => setTipoDocumentalModal(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                >
                  <option value="memorando">Memorando</option>
                  <option value="oficio">Oficio</option>
                  <option value="queja">Queja</option>
                  <option value="anonimo">Anónimo</option>
                  <option value="informe">Informe</option>
                  <option value="solicitud_administrativa">Solicitud Administrativa</option>
                  <option value="documento_recurso">Documento de Recurso</option>
                </select>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Calidad del Solicitante <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <select
                  id="calidadSolicitante"
                  name="calidadSolicitante"
                  autoComplete="calidadSolicitante"
                  value={`${calidadSolicitante}`}
                  onChange={(e): any => setCalidadSolicitante(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                >
                  <option value="quejoso">Quejoso</option>
                  <option value="apelante">Apelante</option>
                  <option value="anonimo">Anónimo</option>
                  <option value="remitente">Remitente</option>
                  <option value="opoderado">Apoderado</option>
                </select>
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Nombre Apelante <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <input
                  type="text"
                  name="nombreApelante"
                  id="nombreApelante"
                  value={nombreApelante}
                  placeholder={'...'}
                  onChange={(e) => setNombreApelante(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Fecha <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <input
                  type="datetime-local"
                  name="fechaHoraRecurso"
                  id="fechaHoraRecurso"
                  value={fechaHoraRecurso}
                  onChange={(e) => setFechaHoraRecurso(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className=" space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Usuario que Recepciona <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <input
                  type="text"
                  name="usuarioRecepciona"
                  id="usuarioRecepciona"
                  value={usuarioRecepciona}
                  placeholder={'...'}
                  onChange={(e) => setUsuarioRecepciona(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
            <div className="space-y-6 sm:space-y-5 border-0 border-white col-span-2">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Anexos y folios <span className="text-xs text-cidSecundayBlue">(Opcional)</span>
                </label>
                <textarea
                  id="subject"
                  name="subject"
                  autoComplete="subject"
                  value={`${anexos}`}
                  onChange={(e) => setAnexos(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-5 border-0 border-white col-span-2">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Asunto (Falta) <span className="text-xs text-primary">(Obligatorio)</span>
                </label>
                <textarea
                  id="subject"
                  name="subject"
                  autoComplete="subject"
                  value={`${asunto}`}
                  onChange={(e) => setAsunto(e.target.value)}
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
                onClick={saveResource}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary"
              >
                Registrar recurso
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
