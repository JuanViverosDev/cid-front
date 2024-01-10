import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

//Helpers API
import Swal from 'sweetalert2';
import { createTemplates, updateTemplates } from '../../../services';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { DataGrid } from '@mui/x-data-grid';

export const ModalTable = ({ openModal, setOpenModal, itemSelected, typeItem }: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const editorRef: any = useRef(null);

  const [rows, setRows] = useState<any>(null);

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
    height: '70%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
  };

  useEffect(() => {
    setRows(itemSelected);
  }, [openModal]);

  const columns = [
    [
      {
        field: 'radicado',
        headerName: 'Nº de radicado',
        width: 520,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
        renderCell: (params: any) => params?.value || 'Sin radicado',
      },
      {
        field: 'expediente',
        headerName: 'Nº de expediente',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'nombreSolicitante',
        headerName: 'Nombre del solicitante',
        width: 520,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'days',
        headerName: 'Estado',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'etapa',
        headerName: 'Etapa',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'isBusinessDays',
        headerName: 'Asignado a',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
    ],
    [
      {
        field: 'radicado',
        headerName: 'Nº de radicado',
        width: 520,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
        renderCell: (params: any) => params?.value || 'Sin radicado',
      },
      {
        field: 'expediente',
        headerName: 'Nº de expediente',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'nombreSolicitante',
        headerName: 'Nombre del solicitante',
        width: 520,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'days',
        headerName: 'Estado',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'etapa',
        headerName: 'Etapa',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'isBusinessDays',
        headerName: 'Asignado a',
        width: 320,
        cellClassName: 'MuiDataGrid-cell--textCenter',
        headerClassName: 'super-app-theme--header',
      },
    ],
  ];

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-10">
            {/* <Drawer className="w-screen" anchor="right" open={openModal} onClose={() => setOpenModal(!openModal)}> */}
            {rows && (
              <Box>
                <DataGrid
                  columns={typeItem === 'quejasReparto' ? columns[0] : columns[1]}
                  density="compact"
                  editMode="row"
                  rows={rows}
                  autoHeight={true}
                  pageSize={20}
                  rowsPerPageOptions={[20]}
                />
              </Box>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};
