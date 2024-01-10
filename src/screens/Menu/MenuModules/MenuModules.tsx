import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import iconEdit from '../../../assets/images/svg/iconEdit.svg';
import iconLock from '../../../assets/images/svg/iconLock.svg';
import iconLockOpen from '../../../assets/images/svg/iconLockOpen.svg';
import iconPlus from '../../../assets/images/svg/iconPlus.svg';
import iconSearch from '../../../assets/images/svg/iconSearch.svg';
import { MainLoader, StateBadge, Titles } from '../../../components';
import { usePermission } from '../../../utilities';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { ModalUpdateModuleState, ModalCreateNewModule } from './components';
// Components - Modals
import { getAllModules } from '../../../services/menu.service';

export const MenuModules = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const [moduleSelected, setModuleSelected] = useState<any>('');
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState('');
  const [moduleSaved, setModuleSaved] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState<any>(null);
  const [state, setState] = useState('true');
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = usePermission('modules', 'canCreate');
  const canEdit = usePermission('modules', 'canEdit');

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      minWidth: 200,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className="bg-transparent"
          disabled={!canEdit}
          icon={
            <Tooltip title="View/Edit">
              <img src={iconEdit} className="" alt="Search role" />
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
            <Tooltip title={params.row.state ? 'Block Module' : 'Unlock Module'}>
              {params.row.state ? (
                <img src={iconLockOpen} className="" alt="Change Module State" />
              ) : (
                <img src={iconLock} className="" alt="Change Module State" />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('changeState', params.row);
          }}
          label="Change State"
        />,
      ],
    },
    {
      field: 'id',
      headerName: 'Id',
      width: 100,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'MuiDataGrid-cell--textCenter',
    },
    {
      field: 'name',
      headerName: 'Module',
      width: 180,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'MuiDataGrid-cell--textCenter',
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 350,
      flex: 1,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'capitalize ',
    },
    {
      field: 'url',
      headerName: 'URL',
      minWidth: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'icon',
      headerName: 'Icon',
      minWidth: 150,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
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
      field: 'state',
      headerName: 'State',
      cellClassName: 'MuiDataGrid-cell--textCenter',
      minWidth: 200,
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

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  useEffect(() => {
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSaved]);

  useEffect(() => {
    const newData =
      dataSource &&
      dataSource.filter(
        (row: any) =>
          (row.name.toLocaleLowerCase().includes(searchText) ||
            row.id.toString().toLocaleLowerCase().includes(searchText) ||
            row.description.toLocaleLowerCase().includes(searchText) ||
            row.url.toLocaleLowerCase().includes(searchText) ||
            row.icon.toLocaleLowerCase().includes(searchText)) &&
          row.state.toString() === state,
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getModules = async () => {
    try {
      setIsLoading(true);

      const response = await callEndpoint(getAllModules());
      response.success && setRows(response.data.filter((row: any) => row.state.toString().includes(state)));
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleOpenModal = (crudAction: any, moduleSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setModuleSelected(moduleSelected);
    setOpenModal(!openModal);
  };
  const handleSearchInput = (e: any) => setSearchText(e.target.value);

  return (
    <div>
      {/*Title Component*/}{' '}
      <Titles title="Modules" moduleDescription="Administration of the Modules assigned to the users.">
        {canCreate && (
          <button
            className="flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
            onClick={() => handleOpenModal('create')}
          >
            <img src={iconPlus} className="mr-4" alt="Create new module" />
            New Module
          </button>
        )}
      </Titles>
      {/* Modal to Create and Edit Module */}
      {openModal && canEdit && canCreate && (typeOfCRUDAction === 'edit' || typeOfCRUDAction === 'create') && (
        <ModalCreateNewModule
          openModal={openModal}
          setOpenModal={setOpenModal}
          moduleSelected={moduleSelected}
          typeOfCRUDAction={typeOfCRUDAction}
          setModuleSaved={setModuleSaved}
          moduleSaved={moduleSaved}
        />
      )}
      {/* Modal change state */}
      {openModal && canEdit && typeOfCRUDAction === 'changeState' && (
        <ModalUpdateModuleState
          openModal={openModal}
          setOpenModal={setOpenModal}
          moduleSelected={moduleSelected}
          setModuleSaved={setModuleSaved}
          moduleSaved={moduleSaved}
        />
      )}
      {/*Search tab*/}{' '}
      <div className="grid grid-cols-3 gap-4  ml-27 mr-27 mt-29 w-auto rounded filter-container">
        <div className="mr-5 col-span-2">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Search"
              className="w-full"
              onChange={handleSearchInput}
              size="small"
              InputProps={{
                startAdornment: <img src={iconSearch} className="mr-4" alt="search rol" />,
              }}
            />
          </Box>
        </div>
        {/* Select */}
        <div>
          <Box sx={{ flexGrow: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">State</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state}
                label="State"
                onChange={handleSelectInput}
                size="small"
              >
                <MenuItem value={'true'}>Active</MenuItem>
                <MenuItem value={'false'}>Inactive</MenuItem>
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
              density="compact"
              editMode="row"
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoHeight={true}
              onCellDoubleClick={(e: any) => handleOpenModal('edit', e.row)}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        )}
      </div>
    </div>
  );
};
