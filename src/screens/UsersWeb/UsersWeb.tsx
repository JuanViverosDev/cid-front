import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Tooltip,
} from '@mui/material';

//DataGrid import
import { DataGrid, GridActionsCellItem, GridRenderCellParams /* GridToolbar */ } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
//SVG Icon
import iconEdit from '../../assets/images/svg/iconEdit.svg';
import iconLock from '../../assets/images/svg/iconLock.svg';
import iconLockOpen from '../../assets/images/svg/iconLockOpen.svg';
import iconPlus from '../../assets/images/svg/iconPlus.svg';
import iconSearch from '../../assets/images/svg/iconSearch.svg';
//Mock
//import userMock from "../../mocks/user.mock.json";
//Components
import { MainLoader, StateBadge, Titles } from '../../components';
//Services
import { usePermission } from '../../utilities';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { getAllWebUsers } from '../../services/webUsers.service';
import { ModalChangeUserState, ModalCreateNewUserForm } from './components';

export const Users = () => {
  const { callEndpoint } = useFetchAndLoad();

  //const responseMock = userMock;
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);

  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>(null);
  const [rows, setRows] = useState<any>(null);
  const [userSelected, setUserSelected] = useState<any>('');
  const [userSaved, setUserSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState('');
  const [state, setState] = useState('true');
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = usePermission('users', 'canCreate');
  const canEdit = usePermission('users', 'canEdit');

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

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  useEffect(() => {
    const newData =
      dataSource &&
      dataSource.filter(
        (row: any) =>
          (row.id.toString().toLocaleLowerCase().includes(searchText) ||
            row.userName.toLocaleLowerCase().includes(searchText) ||
            row.userLastName.toLocaleLowerCase().includes(searchText) ||
            row.userEmail.toLocaleLowerCase().includes(searchText)) &&
          row.userState.toString() === state,
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getWebUsers = async () => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getAllWebUsers());
      response.success && setRows(response.data.filter((row: any) => row.userState.toString().includes(state)));
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast('error', 'Ocurrió un error realizando la consulta', 'Contacte a soporte técnico');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWebUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSaved, page]);

  const handleSearchInput = (e: any) => setSearchText(e.target.value);

  const handleOpenModal = (crudAction: any, userSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setUserSelected(userSelected);
    setOpenModal(!openModal);
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'actions',
      minWidth: 200,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className="bg-transparent"
          disabled={!canEdit}
          icon={
            <Tooltip title="Ver/Editar">
              <img src={iconEdit} className="" alt="Ver detalle" />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('edit', params.row);
          }}
          label="Ver/Editar"
        />,
        <GridActionsCellItem
          disabled={!canEdit}
          icon={
            <Tooltip title={params.row.userState ? 'Bloquear Usuario' : 'Desbloquear Usuario'}>
              {params.row.userState ? (
                <img src={iconLockOpen} className="" alt="Cambiar estado" />
              ) : (
                <img src={iconLock} className="" alt="Cambiar estado" />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('changeState', params.row);
          }}
          label="Cambiar estado"
        />,
      ],
    },
    {
      field: 'id',
      headerName: 'Id',
      width: 400,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'userName',
      headerName: 'Nombre',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'userLastName',
      headerName: 'Apellidos',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'userEmail',
      headerName: 'Email',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      width: 250,
      headerClassName: 'super-app-theme--header',
    },
    /* {
      field: "positionName",
      headerName: "Cargo",
      cellClassName: "MuiDataGrid-cell--textCenter",
      width: 250,
      headerClassName: "super-app-theme--header",
    }, */
     {
      field: "roles",
      headerName: "Rol(es)",
      cellClassName: "MuiDataGrid-cell--textCenter",
      width: 250,
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridRenderCellParams) => {
        return params.value.map((role: any) => role.roleName).join(', ');
      }
    }, 
    {
      field: 'createdAt',
      headerName: 'Create Date',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      width: 200,
      renderCell: (params: GridRenderCellParams) => moment(params.value).format('YYYY-MM-DD HH:MM:ss'),
    },
    {
      field: 'updatedAt',
      headerName: 'Last Update',
      cellClassName: 'MuiDataGrid-cell--textCenter',

      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => moment(params.value).format('YYYY-MM-DD HH:MM:ss'),
    },
    {
      field: 'userState',
      headerName: 'State',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      width: 200,
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <StateBadge label={'Activo'} state="success" />
        ) : (
          <StateBadge label={'Inactivo'} state="danger" />
        );
      },
    },
  ];

  //No rows image
  const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));

  //No rows image function
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay className="mt-2">
        <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box className="text-gray-400" sx={{ mb: 2 }}>
          No Data
        </Box>
      </StyledGridOverlay>
    );
  }

  return (
    <div>
      <Titles title="Usuarios" moduleDescription="Listado de usuarios con acceso a la plataforma.">
        {canCreate && (
          <button
            onClick={() => handleOpenModal('create')}
            className="flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            <img src={iconPlus} className="mr-4" alt="Crear nuevo usuario" />
            Añadir Usuario
          </button>
        )}

        {/* Modal create */}
        {openModal && canEdit && canCreate && (typeOfCRUDAction === 'edit' || typeOfCRUDAction === 'create') && (
          <ModalCreateNewUserForm
            openModal={openModal}
            setOpenModal={setOpenModal}
            userSelected={userSelected}
            setUserSaved={setUserSaved}
            userSaved={userSaved}
            typeOfCRUDAction={typeOfCRUDAction}
          />
        )}
        {/* Modal change state */}
        {openModal && canEdit && typeOfCRUDAction === 'changeState' && (
          <ModalChangeUserState
            openModal={openModal}
            setOpenModal={setOpenModal}
            userSelected={userSelected}
            setUserSaved={setUserSaved}
            userSaved={userSaved}
          />
        )}
      </Titles>
      {/*Search tab*/}{' '}
      <div className="grid grid-flow-col ml-27 mr-27 mt-29 bg-white w-auto rounded filter-container">
        <div className="mr-5">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Search"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
              InputProps={{
                startAdornment: <img src={iconSearch} className="mr-4" alt="Buscar rol" />,
              }}
            />
          </Box>
        </div>
        {/* Select */}
        <div>
          <Box sx={{ flexGrow: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state}
                label="State"
                onChange={handleSelectInput}
                size="small"
              >
                <MenuItem value={'true'}>Activo</MenuItem>
                <MenuItem value={'false'}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      {/* table */}
      <div
        className={
          `grid grid-flow-col ml-27 mr-27 mt-4  w-auto rounded  p-0 relative ` +
          (isLoading ? 'h-60 bg-transparent' : 'bg-white title-box-shadow')
        }
      >
        {isLoading && <MainLoader />}
        {rows && (
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rowsPerPageOptions={[10]}
              density="compact"
              rowCount={100}
              page={page}
              columns={columns}
              editMode="row"
              rows={rows ? rows : []}
              pageSize={pageSize}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(NewPageSize) => setPageSize(NewPageSize)}
              paginationMode="server"
              onCellDoubleClick={(e: any) => handleOpenModal('edit', e.row)}
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
