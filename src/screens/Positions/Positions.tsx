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
import { usePermission } from "../../utilities";

// import { Auth } from "../../core/interfaces/Auth";
import useFetchAndLoad from "../../hooks/useFetchAndLoad";

/* import { getLegalDocs } from "../../services/positions.service"; */
import { ModalUpdatePositionState, ModalCreateNewPosition } from "./components";
import { getAllPositions } from "../../services";

export const Positions = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>("");
  const [rows, setRows] = useState<any>(null);
  const [positionSelected, setPositionSelected] = useState<any>("");
  const [positionSaved, setPositionSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState("");
  const [state, setState] = useState("true");
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = usePermission("positions", "canCreate");
  const canEdit = usePermission("positions", "canEdit");

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
            row.positionName.toLocaleLowerCase().includes(searchText)) &&
          row.positionState.toString() === state
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getPositions = async () => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getAllPositions());
      //const response = await responseMock;
      response.success &&
        setRows(
          response.data.filter((row: any) =>
            row.positionState?.toString().includes(state)
          )
        );
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast(
        "error",
        "Ocurrió un error cargando la consulta",
        "Contacte a soporte técnico"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionSaved]);

  const handleSearchInput = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  const handleOpenModal = (crudAction: any, positionSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setPositionSelected(positionSelected);
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
              <img src={iconEdit} className='' alt='buscar un cargo' />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal("edit", params.row);
          }}
          label='View/Edit'
        />,
        <GridActionsCellItem
          disabled={!canEdit}
          icon={
            <Tooltip
              title={
                params.row.positionState
                  ? "Bloquear Cargo"
                  : "Desbloquear Cargo"
              }
            >
              {params.row.positionState ? (
                <img
                  src={iconLockOpen}
                  className=''
                  alt='update position state'
                />
              ) : (
                <img
                  src={iconLock}
                  className=''
                  alt='Actualizar estado del cargo'
                />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal("changeState", params.row);
          }}
          label='Actualizar estado del cargo'
        />,
      ],
    },
    {
      field: "id",
      headerName: "Id",
      width: 320,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "positionName",
      headerName: "Nombre del cargo",
      width: 250,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "createdAt",
      headerName: "Fecha de creación",
      cellClassName: "MuiDataGrid-cell--textCenter",
      width: 200,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "updatedAt",
      headerName: "Ultima Actualización",
      cellClassName: "MuiDataGrid-cell--textCenter",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "positionState",
      headerName: "Estado",
      width: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <StateBadge label={"Active"} state='success' />
        ) : (
          <StateBadge label={"Inactive"} state='danger' />
        );
      },
    },
  ];

  return (
    <div>
      {/*Title Component*/}{" "}
      <Titles
        title='Cargos'
        moduleDescription='Modulo de administración de cargos.'
      >
        {canCreate && (
          <button
            onClick={() => handleOpenModal("create")}
            className='flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400'
          >
            <img src={iconPlus} className='mr-4' alt='Crear nuevo cargo' />
            Nuevo cargo
          </button>
        )}

        {/* Modal create */}
        {openModal &&
          canEdit &&
          canCreate &&
          (typeOfCRUDAction === "edit" || typeOfCRUDAction === "create") && (
            <ModalCreateNewPosition
              openModal={openModal}
              setOpenModal={setOpenModal}
              positionSelected={positionSelected}
              setPositionSaved={setPositionSaved}
              positionSaved={positionSaved}
              typeOfCRUDAction={typeOfCRUDAction}
            />
          )}
        {/* Modal change state */}
        {openModal && canEdit && typeOfCRUDAction === "changeState" && (
          <ModalUpdatePositionState
            openModal={openModal}
            setOpenModal={setOpenModal}
            positionSelected={positionSelected}
            setPositionSaved={setPositionSaved}
            positionSaved={positionSaved}
            typeOfCRUDAction={typeOfCRUDAction}
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
                  <img src={iconSearch} className='mr-4' alt='Buscar cargo' />
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
                label='Estado'
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
