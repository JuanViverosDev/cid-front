import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
//DataGrid import
import { DataGrid, GridActionsCellItem, gridColumnGroupsLookupSelector, GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

//Export Excel
import { ExportToExcel } from './ExportToExcel';

//SVG Icon
import iconSearch from '../../../assets/images/svg/iconSearch.svg';
import iconEdit from '../../../assets/images/svg/iconEdit.svg';
import iconLock from '../../../assets/images/svg/iconLock.svg';
import iconLockOpen from '../../../assets/images/svg/iconLockOpen.svg';
import iconPlus from '../../../assets/images/svg/iconPlus.svg';
//Components
import { MainLoader } from '../../../components';

//Services
//import requestMock from '../../../mocks/request.mock.json';
import { usePermission } from '../../../utilities';

// import { Auth } from "../../core/interfaces/Auth";
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { ModalCreateRequest, ModalUpdateRequest } from '../components';
import { getAllRequestByUser } from '../../../services/request.service';
import { useSelector } from 'react-redux';
import { AUTH } from '../../../models';

export const AllRequest = () => {
  const { callEndpoint } = useFetchAndLoad();
  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [rows, setRows] = useState<any>(null);
  const [requestSelected, setRequestSelected] = useState<any>('');
  const [requestSaved, setRequestSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState('');
  const [state, setState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigned, setIsAssigned] = useState(true);
  const [isPending, setIsPending] = useState(true);
  const canCreate = usePermission('request', 'canCreate');
  const canEdit = usePermission('request', 'canEdit');
  const userId = useSelector(({ auth }: { auth: AUTH }) => auth?.data?.user?.id);
  const userRole = useSelector(({ auth }: { auth: AUTH }) => auth?.data?.user?.userRole);

  const rolesByCode = {
    ventanillaUnica: 'b66409a7-08d4-49a5-8caf-5405fa2f289c',
    directorInstruccion: 'f7d3edd7-8450-471a-84a9-8d171786eb7d',
    profesionalInstruccion: 'bad7d867-8c7a-4490-821f-ce1518d5e0d0',
    copiaProfesionalInstruccion: 'bad7d867-8c7a-4490-821f-ce1518d5e0d0',
    secretariaComunJuzgamiento: '6e10b54c-168f-4d4e-bf0a-3a9d73ebf23d',
    secretariaComunInstruccion: 'dd1cdabc-d122-4a83-8b8a-2dd35d588c97',
    directorJuzgamiento: '398278a8-2e8e-4278-bf3c-55c7f7e1d299',
    profesionalJuzgamiento: 'edf9f711-ce54-4774-9f7f-b690c412aa3e',
    admin: 'e3439bfb-ebf2-448e-a629-c83724a75aed',
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

  useEffect(() => {
    setState(0);
    const newData =
      dataSource &&
      dataSource.filter(
        (row: any) =>
          row.id.toLocaleLowerCase().includes(searchText) ||
          row.radicado?.toLocaleLowerCase().includes(searchText) ||
          row.nombreSolicitante?.toLocaleLowerCase().includes(searchText) ||
          row.subject?.toLocaleLowerCase().includes(searchText) ||
          row.requestStages[row.requestStages.length - 1]?.stageName?.toLocaleLowerCase().includes(searchText) ||
          row.agentSelected?.userName?.toLocaleLowerCase().includes(searchText) ||
          row.agentSelected?.lastName?.toLocaleLowerCase().includes(searchText) ||
          row.requestState?.stateName?.toLocaleLowerCase().includes(searchText),
      );

    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const getRequest = async () => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getAllRequestByUser(userId));
      response.success && setRows(response.data);
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast('error', 'An error occurred loading the information', 'Contact technical support');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAssigned && isPending) {
      setRows(dataSource);
    } else {
      if (isAssigned) {
        const data = dataSource && dataSource.filter((row: any) => !row.agentSelected?.id?.includes(userId));
        setRows(data);
      } else {
        const data = dataSource && dataSource.filter((row: any) => row.agentSelected?.id?.includes(userId));
        setRows(data);
      }
    }
  }, [isAssigned, isPending]);

  useEffect(() => {
    getRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSaved]);

  const handleSearchInput = (e: any) => {
    setSearchText(e.target.value.toLocaleLowerCase());
    setSearchText(e.target.value.toLocaleLowerCase());
  };

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as any);
  };

  const handleOpenModal = (crudAction: any, docSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setRequestSelected(docSelected);
    setOpenModal(!openModal);
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'actions',
      minWidth: 150,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className="bg-transparent"
          disabled={!canEdit}
          icon={
            <Tooltip title="Ver/Editar">
              <img src={iconEdit} className="" alt="Ver/Editar" />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('edit', params.row);
          }}
          label="Ver/Editar"
        />,
      ],
    },
    {
      field: 'radicado',
      headerName: 'Nº de Radicado',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => params?.value || 'Sin radicado',
    },
    {
      field: 'expediente',
      headerName: 'Nº de Expediente',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => params?.value || 'Sin expediente',
    },
    {
      field: 'nombreSolicitante',
      headerName: 'Nombre del solicitante',
      width: 250,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'requestState',
      headerName: 'Estado',
      width: 400,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      renderCell: (params: GridRenderCellParams) => params?.value?.stateName,
    },
    {
      field: 'requestStage',
      headerName: 'Etapa',
      width: 200,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      valueGetter: (params: GridRenderCellParams) => params?.row?.requestState?.stageName
    },
    {
      field: 'agentSelected',
      headerName: 'Asignado a',
      width: 250,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      sortComparator: (x: any, y: any) => x.userName?.localeCompare(y.userName), //!Revisar
      renderCell: (params: GridRenderCellParams) => `${params?.value?.userName} ${params?.value?.userLastName}`,
    },
    {
      field: 'subject',
      headerName: 'Asunto',
      width: 400,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'createdAt',
      headerName: 'Fecha/Hora de Recibido',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      renderCell: (params: GridRenderCellParams) => moment(params.value).format('DD-MM-YYYY HH:MM:ss'),
    },
    {
      field: 'expireDate',
      headerName: 'Fecha de Vencimiento',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter text-cidTertiaryLightPurple',
      renderCell: (params: GridRenderCellParams) => params.value === null ? 'Sin vencimiento' : moment(params.value).format('DD-MM-YYYY HH:MM:ss'),
    },
    {
      field: 'attachments',
      headerName: 'Anexos',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      renderCell: (params: GridRenderCellParams) => params?.value?.map((item: any) => item.fileName).join(', '),
    },
    {
      field: 'updatedAt',
      headerName: 'Última Actualización',
      minWidth: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      renderCell: (params: GridRenderCellParams) => moment(params.value).format('DD-MM-YYYY HH:MM:ss'),
    },
    {
      field: 'enabled',
      headerName: 'Estado',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => (params.value ? 'Activo' : 'Inactivo'),
    }
  ];

  return (
    <div>
      {/*Title Component*/}{' '}
      <div className="w-full flex justify-end mb-4">
        {userRole?.roleName === 'Ventanilla Unica' && (
          <div>
            {canCreate && (
              <button
                className="flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500"
                onClick={() => handleOpenModal('create')}
              >
                <img src={iconPlus} className="mr-4" alt="Nueva petición" />
                Nueva Petición
              </button>
            )}
          </div>
        )}
      </div>
      {/*Title Component*/}{' '}
      <div className="w-full flex justify-end mb-4">
        {userRole?.roleName !== 'Ventanilla Unica' && (
          <div>
            <ExportToExcel fileName="tabla_solicitudes" content={dataSource}></ExportToExcel>
          </div>
        )}
      </div>
      {/* Modal create */}
      {openModal && canEdit && canCreate && (typeOfCRUDAction === 'edit' || typeOfCRUDAction === 'create') && (
        <ModalCreateRequest
          openModal={openModal}
          setOpenModal={setOpenModal}
          requestSelected={requestSelected}
          setRequestSelected={setRequestSelected}
          setRequestSaved={setRequestSaved}
          requestSaved={requestSaved}
          typeOfCRUDAction={typeOfCRUDAction}
          rolesByCode={rolesByCode}
        />
      )}
      {/* Modal change state */}
      {openModal && canEdit && typeOfCRUDAction === 'changeState' && (
        <ModalUpdateRequest
          openModal={openModal}
          setOpenModal={setOpenModal}
          requestSelected={requestSelected}
          setRequestSaved={setRequestSaved}
          requestSaved={requestSaved}
        />
      )}
      {/*Search tab*/}{' '}
      <div className="grid grid-flow-col  mt-1 bg-white w-auto rounded ">
        <div className="mr-5">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Search"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
              InputProps={{
                startAdornment: <img src={iconSearch} className="mr-4" alt="Buscar tipo" />,
              }}
            />
          </Box>
        </div>
        {/* Select */}
        {rolesByCode.profesionalInstruccion !== userRole?.id && (
          <div>
            <Box sx={{ flexGrow: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Solicitudes</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={`${state}`}
                  label="State"
                  onChange={handleSelectInput}
                  size="small"
                >
                  <MenuItem
                    value={'0'}
                    onClick={() => {
                      setIsAssigned(true);
                      setIsPending(true);
                    }}
                  >
                    Todas
                  </MenuItem>
                  <MenuItem
                    value={'1'}
                    onClick={() => {
                      setIsAssigned(false);
                      setIsPending(true);
                    }}
                  >
                    Pendientes
                  </MenuItem>
                  <MenuItem
                    value={'2'}
                    onClick={() => {
                      setIsAssigned(true);
                      setIsPending(false);
                    }}
                  >
                    Asignadas
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        )}
      </div>
      {/* table */}
      <div
        className={
          `grid grid-flow-col  mt-4  w-auto rounded  p-0 relative ` +
          (isLoading ? 'h-60 bg-transparent' : 'bg-white title-box-shadow')
        }
      >
        {isLoading && <MainLoader />}
        {rows && (
          <Box>
            <DataGrid
              columns={columns}
              density="compact"
              onCellDoubleClick={(e: any) => handleOpenModal('edit', e.row)}
              editMode="row"
              rows={rows}
              autoHeight={true}
              pageSize={20}
              rowsPerPageOptions={[20]}
            />
          </Box>
        )}
      </div>
    </div>
  );
};
