import React from "react";
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
} from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

//SVG Icon
import iconSearch from "../../../assets/images/svg/iconSearch.svg";
import iconEdit from "../../../assets/images/svg/iconEdit.svg";
import iconLock from "../../../assets/images/svg/iconLock.svg";
import iconLockOpen from "../../../assets/images/svg/iconLockOpen.svg";
//Components
import { MainLoader } from "../../../components";

//Services
import requestPendingMock from "../../../mocks/requestPending.mock.json";
import { usePermission } from "../../../utilities";

// import { Auth } from "../../core/interfaces/Auth";
/* import useFetchAndLoad from "../../../hooks/useFetchAndLoad"; */
import { ModalCreateRequest, ModalUpdateRequest } from ".";

export const RequestAssigned = () => {
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
            row.name.toLocaleLowerCase().includes(searchText)) &&
          row.state.toString() === state
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getSystems = async () => {
    try {
      setIsLoading(true);
      // const response = await callEndpoint(getAllBankOffices());
      const response = await requestPendingMock;

      response.success && setRows(response.data);
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
      minWidth: 150,
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
      headerName: "Nº de Radicado",
      width: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "fileNumber",
      headerName: "Nº de Expediente",
      width: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "nameRequester",
      headerName: "Nombre del solicitante",
      width: 250,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "subject",
      headerName: "Asunto",
      width: 250,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "createdAt",
      headerName: "Fecha/Hora de Recibido Dirección",
      width: 280,
      cellClassName: "MuiDataGrid-cell--textCenter",
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "updatedAt",
      headerName: "Fecha de Asignación",
      minWidth: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "expireDate",
      headerName: "Fecha de Vencimiento",
      width: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
      renderCell: (params: GridRenderCellParams) =>
        moment(params.value).format("YYYY-MM-DD HH:MM:ss"),
    },
    {
      field: "userAssigned",
      headerName: "Usuario Asignado",
      width: 250,
      cellClassName: "MuiDataGrid-cell--textCenter",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "attachments",
      headerName: "Anexos",
      width: 200,
      cellClassName: "MuiDataGrid-cell--textCenter",
    },
    {
      field: "state",
      headerName: "Etapa",
      width: 200,
      headerClassName: "super-app-theme--header",
      cellClassName: "MuiDataGrid-cell--textCenter",
    },
  ];

  return (
    <>
      {/* Modal create */}
      {openModal &&
        canEdit &&
        canCreate &&
        (typeOfCRUDAction === "edit" || typeOfCRUDAction === "create") && (
          <ModalCreateRequest
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
        <ModalUpdateRequest
          openModal={openModal}
          setOpenModal={setOpenModal}
          system={system}
          setSystemSaved={setSystemSaved}
          systemSaved={systemSaved}
        />
      )}
      {/*Search tab*/}
      <div className='grid grid-flow-col  mt-1 bg-white w-auto rounded '>
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
              <InputLabel id='demo-simple-select-label'>Etapa</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={state}
                label='State'
                onChange={handleSelectInput}
                size='small'
              >
                <MenuItem value={"true"}>En Reparto</MenuItem>
                <MenuItem value={"false"}>En Archivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      {/* table */}
      <div
        className={
          `grid grid-flow-col  mt-4  w-auto rounded  p-0 relative ` +
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
    </>
  );
};
