import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  bottom: '0%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 2,
};

export const ModalViewer = ({ openModalViewer, setOpenModalViewer, sourceAssets }: any) => {
  const handleClose = () => setOpenModalViewer(false);

  return (
    <div>
      <Modal
        open={openModalViewer}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {sourceAssets.fileType !== 'video/mp4' ? (
            <>
              <iframe src={sourceAssets.source} width="100%" height="90%" title="iFrame" />
            </>
          ) : (
            <>
              <video width="100%" height="500px" controls>
                <source src={sourceAssets.source} type="video/mp4" />
              </video>
            </>
          )}

          <div className="pt-5 bottom-0 bg-white left-0 right-0 pr-0">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
