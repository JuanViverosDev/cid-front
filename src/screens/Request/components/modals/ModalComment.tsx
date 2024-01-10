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

export const ModalComment = ({ openModalComment, setOpenModalComment, handleSubmit, setRequestObservations }: any) => {
  const handleClose = () => setOpenModalComment(false);

  // debugger;
  return (
    <div>
      <Modal
        open={openModalComment}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid grid-cols-1  gap-4 pt-0">
            {/* Asunto */}
            <div className="space-y-6 sm:space-y-5 border-0 border-white">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">
                  Observaciones <span className="text-xs text-primary">(Opcional)</span>
                </label>
                <textarea
                  id="subject"
                  name="subject"
                  rows={4}
                  autoComplete="subject"
                  onChange={(e): any => setRequestObservations(e.target.value)}
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
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-primary py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white  "
              >
                Guardar
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
