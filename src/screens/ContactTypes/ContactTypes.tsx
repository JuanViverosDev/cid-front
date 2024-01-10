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
  /* GridToolbar */
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
import {
  ModalUpdateContactTypeState,
  ModalCreateContactType,
} from "./components";
import { getAllContactTypes } from "../../services/comunicationType.service";

export const ContactTypes = () => {
  const { callEndpoint } = useFetchAndLoad();
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>("");
  const [rows, setRows] = useState<any>(null);
  const [contactTypeSelected, setContactTypeSelected] = useState<any>("");
  const [contactTypeSaved, setContactTypeSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState("");
  const [state, setState] = useState("true");
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = usePermission("contact-types", "canCreate");
  const canEdit = usePermission("contact-types", "canEdit");

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
            row.communicationName.toLocaleLowerCase().includes(searchText)) &&
          row.communicationState.toString() === state
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getPositions = async () => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getAllContactTypes());
      response.success &&
        setRows(
          response.data.filter((row: any) =>
            row.communicationState?.toString().includes(state)
          )
        );
      response.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast(
        "error",
        "Ocurrió un error realizando la consulta",
        "Contacte a soporte técnico"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactTypeSaved]);

  const handleSearchInput = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  const handleOpenModal = (crudAction: any, contactTypeSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setContactTypeSelected(contactTypeSelected);
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
                params.row.communicationState
                  ? "Bloquear Tipo de Contacto"
                  : "Desbloquear Tipo de Contacto"
              }
            >
              {params.row.communicationState ? (
                <img
                  src={iconLockOpen}
                  className=''
                  alt='Actualizar tipo de contacto'
                />
              ) : (
                <img
                  src={iconLock}
                  className=''
                  alt='Actualizar tipo de contacto'
                />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal("changeState", params.row);
          }}
          label='Actualizar tipo de contacto'
        />,
      ],
    },
    {
      field: "id",
      headerName: "Id",
      width: 150,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "communicationName",
      headerName: "Nombre Tipo de Contacto",
      width: 300,
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
      field: "communicationState",
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
        title='Tipos de contacto'
        moduleDescription='Modulo de administración de tipos de contacto.'
      >
        {canCreate && (
          <button
            onClick={() => handleOpenModal("create")}
            className='flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400'
          >
            <img
              src={iconPlus}
              className='mr-4'
              alt='Crear nuevo tipo de contacto'
            />
            Nuevo tipo de contacto
          </button>
        )}

        {/* Modal create */}
        {openModal &&
          canEdit &&
          canCreate &&
          (typeOfCRUDAction === "edit" || typeOfCRUDAction === "create") && (
            <ModalCreateContactType
              openModal={openModal}
              setOpenModal={setOpenModal}
              contactTypeSelected={contactTypeSelected}
              setContactTypeSaved={setContactTypeSaved}
              contactTypeSaved={contactTypeSaved}
              typeOfCRUDAction={typeOfCRUDAction}
            />
          )}
        {/* Modal change state */}
        {openModal && canEdit && typeOfCRUDAction === "changeState" && (
          <ModalUpdateContactTypeState
            openModal={openModal}
            setOpenModal={setOpenModal}
            contactTypeSelected={contactTypeSelected}
            setContactTypeSaved={setContactTypeSaved}
            contactTypeSaved={contactTypeSaved}
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
                  <img
                    src={iconSearch}
                    className='mr-4'
                    alt='Buscar tipo de contcato'
                  />
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
