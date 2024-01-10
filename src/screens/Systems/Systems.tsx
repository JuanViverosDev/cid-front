import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
//DataGrid import
import {
  DataGrid,
  GridActionsCellItem,
  GridRenderCellParams,
  /* GridToolbar, */
} from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

//SVG Icon
import iconSearch from "../../assets/images/svg/iconSearch.svg";
import iconEdit from "../../assets/images/svg/iconEdit.svg";
import iconLock from "../../assets/images/svg/iconLock.svg";
import iconLockOpen from "../../assets/images/svg/iconLockOpen.svg";
import iconPlus from "../../assets/images/svg/iconPlus.svg";
//Components
import { MainLoader, StateBadge, Titles } from "../../components";

//Services
import systemsMock from "../../mocks/systems.mock.json";
import { usePermission } from "../../utilities";

// import { Auth } from "../../core/interfaces/Auth";
/* import useFetchAndLoad from '../../hooks/useFetchAndLoad'; */
import { ModalCreateSystem, ModalUpdateSystemState } from "./components";

export const Systems = () => {
  /* const { callEndpoint } = useFetchAndLoad(); */

  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>("");
  const [rows, setRows] = useState<any>(null);
  const [system, setSystem] = useState<any>("");
  const [systemSaved, setSystemSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState("");
  const [state, setState] = useState("true");
  const [isLoading, setIsLoading] = useState(false);
  const canCreate = usePermission("request-types", "canCreate");
  const canEdit = usePermission("request-types", "canEdit");

  const showToast = (icon: any, title: any, text: any) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
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
            row.name.toLocaleLowerCase().includes(searchText) ||
            row.is_generate_minutes
              .toString()
              .toLocaleLowerCase()
              .includes(searchText)) &&
          row.state.toString() === state
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getSystems = async () => {
    try {
      setIsLoading(true);
      // const response = await callEndpoint(getAllBankOffices());
      const response = await systemsMock;
      response.success &&
        setRows(
          response.data.filter((row: any) =>
            row.state?.toString().includes(state)
          )
        );
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast(
        "error",
        "An error occurred loading the information",
        "Contact technical support"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSystems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemSaved]);

  const handleSearchInput = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  const handleOpenModal = (crudAction: any, docSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setSystem(docSelected);
    setOpenModal(!openModal);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      type: "actions",
      minWidth: 200,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className='bg-transparent'
          disabled={!canEdit}
          icon={
            <Tooltip title='Ver/Editar'>
              <img src={iconEdit} className='' alt='Ver/Editar' />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal("edit", params.row);
          }}
          label='Ver/Editar'
        />,
        <GridActionsCellItem
          disabled={!canEdit}
          icon={
            <Tooltip
              title={
                params.row.state ? "Bloquear sistema" : "Desbloquear sistema"
              }
            >
              {params.row.state ? (
                <img src={iconLockOpen} className='' alt='Cambiar estado' />
              ) : (
                <img src={iconLock} className='' alt='Cambiar estado' />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal("changeState", params.row);
          }}
          label='Sistemas'
        />,
      ],
    },
    {
      field: "id",
      headerName: "Id",
      width: 70,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Nombre",
      width: 250,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "createdAt",
      headerName: "Fecha de Creación",
      width: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "updatedAt",
      headerName: "Última Actualización",
      minWidth: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "state",
      headerName: "Estado",
      width: 200,
      headerClassName: "super-app-theme--header",
      cellClassName: "MuiDataGrid-cell--textCenter",
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <StateBadge label={"Activo"} state='success' />
        ) : (
          <StateBadge label={"Inactivo"} state='danger' />
        );
      },
    },
  ];

  return (
    <div>
      {/*Title Component*/}{" "}
      <Titles
        title='Sistemas'
        moduleDescription='Catálogo de sistemas permitidos.'
      >
        {canCreate && (
          <button
            onClick={() => handleOpenModal("create")}
            className='flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400'
          >
            <img src={iconPlus} className='mr-4' alt='Create new UVT' />
            Nuevo Sitema
          </button>
        )}

        {/* Modal create */}
        {openModal &&
          canEdit &&
          canCreate &&
          (typeOfCRUDAction === "edit" || typeOfCRUDAction === "create") && (
            <ModalCreateSystem
              openModal={openModal}
              setOpenModal={setOpenModal}
              system={system}
              setSystemSaved={setSystemSaved}
              systemSaved={systemSaved}
              typeOfCRUDAction={typeOfCRUDAction}
            />
          )}
        {/* Modal change state */}
        {openModal && canEdit && typeOfCRUDAction === "changeState" && (
          <ModalUpdateSystemState
            openModal={openModal}
            setOpenModal={setOpenModal}
            system={system}
            setSystemSaved={setSystemSaved}
            systemSaved={systemSaved}
          />
        )}
      </Titles>
      {/*Search tab*/}{" "}
      <div className='grid grid-flow-col ml-27 mr-27 mt-29 bg-white w-auto rounded filter-container'>
        <div className='mr-5'>
          <Box>
            <TextField
              id='demo-helper-text-aligned'
              label='Search'
              onChange={handleSearchInput}
              className='w-full'
              size='small'
              InputProps={{
                startAdornment: (
                  <img src={iconSearch} className='mr-4' alt='Buscar tipo' />
                ),
              }}
            />
          </Box>
        </div>
        {/* Select */}
        <div>
          <Box sx={{ flexGrow: 2 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Estado</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={state}
                label='State'
                onChange={handleSelectInput}
                size='small'
              >
                <MenuItem value={"true"}>Activo</MenuItem>
                <MenuItem value={"false"}>Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      {/* table */}
      <div
        className={
          `grid grid-flow-col ml-27 mr-27 mt-4  w-auto rounded  p-0 relative ` +
          (isLoading ? "h-60 bg-transparent" : "bg-white title-box-shadow")
        }
      >
        {isLoading && <MainLoader />}
        {rows && (
          <Box>
            <DataGrid
              columns={columns}
              density='compact'
              onCellDoubleClick={(e: any) => handleOpenModal("edit", e.row)}
              editMode='row'
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
