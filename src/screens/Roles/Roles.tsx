import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
//SVG ICON
import iconPlus from '../../assets/images/svg/iconPlus.svg';
import iconSearch from '../../assets/images/svg/iconSearch.svg';
//Components
import { Titles, MainLoader } from '../../components';
//Services
import { usePermission } from '../../utilities';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { ModalCreateRol, RoleTable, ModalUpdateRoleState } from './components';
import { getAllRoles } from '../../services/roles.service';

export const Roles = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>(null);
  const [rows, setRows] = useState<any>(null);
  const [roleSelected, setRoleSelected] = useState<any>('');
  const [roleSaved, setRoleSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState('true');

  const canCreate = usePermission('roles', 'canCreate');
  const canEdit = usePermission('roles', 'canEdit');

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

  //Use effect used to search bar
  useEffect(() => {
    const newData =
      dataSource &&
      dataSource.filter(
        (row: any) =>
          (row.roleName.toLocaleLowerCase().includes(searchText) ||
            row.id.toString().toLocaleLowerCase().includes(searchText) ||
            row.createdAt.toString().toLocaleLowerCase().includes(searchText) ||
            row.updatedAt.toString().toLocaleLowerCase().includes(searchText)) &&
          row.roleState.toString() === state,
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleSaved]);

  const getRoles = async () => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getAllRoles());
      if (response.success) {
        setRows(response.data.filter((row: any) => row.roleState.toString().includes(state)));
        setDataSource(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      showToast('error', 'Ocurrió un error realizando la consulta', 'Contacte a soporte técnico');
      setIsLoading(false);
    }
  };

  const handleSearchInput = (e: any) => setSearchText(e.target.value);

  const handleOpenModal = (crudAction: any, rolSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setRoleSelected(rolSelected);
    setOpenModal(!openModal);
  };

  return (
    <div>
      <Titles title="Roles" moduleDescription="Módulo de configuración de los roles para acceder a la plataforma.">
        {canCreate && (
          <button
            onClick={() => handleOpenModal('create')}
            className="flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            <img src={iconPlus} className="mr-4" alt="Crear nuevo rol" />
            Nuevo rol
          </button>
        )}
      </Titles>
      {/* Modal create */}
      {openModal && canEdit && canCreate && (typeOfCRUDAction === 'edit' || typeOfCRUDAction === 'create') && (
        <ModalCreateRol
          openModal={openModal}
          setOpenModal={setOpenModal}
          roleSelected={roleSelected}
          setRoleSaved={setRoleSaved}
          roleSaved={roleSaved}
          typeOfCRUDAction={typeOfCRUDAction}
        />
      )}
      {/* Modal change state */}
      {openModal && canEdit && typeOfCRUDAction === 'changeState' && (
        <ModalUpdateRoleState
          openModal={openModal}
          setOpenModal={setOpenModal}
          roleSelected={roleSelected}
          setRoleSaved={setRoleSaved}
          roleSaved={roleSaved}
        />
      )}
      {/*Search tab*/}
      <div className="grid grid-flow-col ml-27 mr-27 mt-29 bg-white w-auto rounded filter-container">
        <div className="mr-5">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Search"
              className="w-full"
              onChange={handleSearchInput}
              size="small"
              InputProps={{
                startAdornment: <img src={iconSearch} className="mr-4" alt="buscar rol" />,
              }}
            />
          </Box>
        </div>
        {/* Select */}
        <div>
          <Box sx={{ flexGrow: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Estate</InputLabel>
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
          <RoleTable
            handleOpenModal={handleOpenModal}
            isLoading={isLoading}
            canEdit={canEdit}
            rows={rows ? rows : []}
          />
        )}
      </div>
    </div>
  );
};
