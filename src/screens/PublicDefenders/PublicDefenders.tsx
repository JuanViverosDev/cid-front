import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
//DataGrid import
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams,
  /* GridToolbar, */
} from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

//SVG Icon
import iconSearch from '../../assets/images/svg/iconSearch.svg';
import iconEdit from '../../assets/images/svg/iconEdit.svg';
import iconLock from '../../assets/images/svg/iconLock.svg';
import iconLockOpen from '../../assets/images/svg/iconLockOpen.svg';
import iconPlus from '../../assets/images/svg/iconPlus.svg';
//Components
import { MainLoader, StateBadge, Titles } from '../../components';

//Services
import { usePermission } from '../../utilities';

// import { Auth } from "../../core/interfaces/Auth";
import useFetchAndLoad from '../../hooks/useFetchAndLoad';

/* import { getLegalDocs } from "../../services/positions.service"; */
import { getAllPublicDefenders } from '../../services';
import { ModalCreatePublicDefenders, ModalUpdatePublicDefendersState } from './components';

export const PublicDefenders = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>('');
  const [rows, setRows] = useState<any>(null);
  const [publicDefenderSelected, setPublicDefenderSelected] = useState<any>('');
  const [publicDefenderSaved, setPublicDefenderSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState('');
  const [state, setState] = useState('true');
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = usePermission('public-defenders', 'canCreate');
  const canEdit = usePermission('public-defenders', 'canEdit');

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
    const newData =
      dataSource &&
      dataSource.filter(
        (row: any) =>
          (row.id.toString().toLocaleLowerCase().includes(searchText) ||
            row.publicDefenderName.toLocaleLowerCase().includes(searchText)) &&
          row.positionState.toString() === state,
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getPublicDefendersList = async () => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getAllPublicDefenders());
      //const response = await responseMock;
      response.success &&
        setRows(response.data.filter((row: any) => row.publicDefenderState?.toString().includes(state)));
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast('error', 'Ocurrió un error cargando la consulta', 'Contacte a soporte técnico');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPublicDefendersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDefenderSaved]);

  const handleSearchInput = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  const handleOpenModal = (crudAction: any, positionSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setPublicDefenderSelected(positionSelected);
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
              <img src={iconEdit} className="" alt="buscar un cargo" />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('edit', params.row);
          }}
          label="View/Edit"
        />,
        <GridActionsCellItem
          disabled={!canEdit}
          icon={
            <Tooltip
              title={params.row.publicDefenderState ? 'Bloquear Abogado de Oficio' : 'Desbloquear Abogado de Oficio'}
            >
              {params.row.publicDefenderState ? (
                <img src={iconLockOpen} className="" alt="Actualizar estado del abogado de oficio" />
              ) : (
                <img src={iconLock} className="" alt="Actualizar estado del abogado de oficio" />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('changeState', params.row);
          }}
          label="Actualizar estado del abogado de oficio"
        />,
      ],
    },
    {
      field: 'id',
      headerName: 'Id',
      width: 320,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderName',
      headerName: 'Nombre abogado de oficio',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderPhone',
      headerName: 'Celular abogado de oficio',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderAddress',
      headerName: 'Dirección abogado de oficio',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderEmail',
      headerName: 'Correo electrónico abogado de oficio',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderCompany',
      headerName: 'Organización abogado de oficio',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderStartDate',
      headerName: 'Fecha inicio encargo',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderEndDate',
      headerName: 'Fecha finalización encargo',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'publicDefenderEndDate',
      headerName: 'Fecha finalización encargo',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'howManyProceedingsNumber',
      headerName: 'Número de expedientes asignados',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'proceedingsNumbers',
      headerName: 'Números de expedientes',
      width: 200,
      headerClassName: 'super-app-theme--header',
    },

    {
      field: 'createdAt',
      headerName: 'Fecha de creación',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      width: 200,
      renderCell: (params: GridRenderCellParams) => moment(params.value).format('YYYY-MM-DD HH:MM:ss'),
    },
    {
      field: 'updatedAt',
      headerName: 'Ultima Actualización',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => moment(params.value).format('YYYY-MM-DD HH:MM:ss'),
    },
    {
      field: 'publicDefenderState',
      headerName: 'Estado',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <StateBadge label={'Active'} state="success" />
        ) : (
          <StateBadge label={'Inactive'} state="danger" />
        );
      },
    },
  ];

  return (
    <div>
      {/*Title Component*/}{' '}
      <Titles title="Abogados de oficio" moduleDescription="Modulo de administración de abogados de oficio.">
        {canCreate && (
          <button
            onClick={() => handleOpenModal('create')}
            className="flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            <img src={iconPlus} className="mr-4" alt="Crear nuevo abogado de oficio" />
            Nuevo abogado de oficio
          </button>
        )}

        {/* Modal create */}
        {openModal && canEdit && canCreate && (typeOfCRUDAction === 'edit' || typeOfCRUDAction === 'create') && (
          <ModalCreatePublicDefenders
            openModal={openModal}
            setOpenModal={setOpenModal}
            publicDefenderSelected={publicDefenderSelected}
            setPublicDefenderSaved={setPublicDefenderSaved}
            publicDefenderSaved={publicDefenderSaved}
            typeOfCRUDAction={typeOfCRUDAction}
          />
        )}
        {/* Modal change state */}
        {openModal && canEdit && typeOfCRUDAction === 'changeState' && (
          <ModalUpdatePublicDefendersState
            openModal={openModal}
            setOpenModal={setOpenModal}
            publicDefenderSelected={publicDefenderSelected}
            setPublicDefenderSaved={setPublicDefenderSaved}
            publicDefenderSaved={publicDefenderSaved}
            typeOfCRUDAction={typeOfCRUDAction}
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
                startAdornment: <img src={iconSearch} className="mr-4" alt="Buscar abogado de oficio" />,
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
                label="Estado"
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
