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
import { getAllPublicDefenders, getTemplates } from '../../services';
import { ModalUpdatePlantillaState } from './components';
import { getDocumentsSearch } from '../../services/search.service';
import { getAllStates } from '../../services/fechasVenc.service';
import { getAllStages } from '../../services/stages.service';
import { ModalBusquedas } from './components/ModalBusquedas';

export const Busqueda = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [dataSearch, setDataSearch] = useState<any>({
    requestPhaseName: null,
    requestStageName: null,
    requestStateName: null,
    requestFileNumber: null,
    requestProceedingsNumber: null,
    requestFiledStatus: null,
    documentType: null,
    consecutive: null,
  });
  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState<any>('');
  const [rows, setRows] = useState<any>(null);
  const [plantillaSelected, setPlantillaSelected] = useState<any>('');
  const [publicDefenderSaved, setPublicDefenderSaved] = useState(false);
  const [typeOfCRUDAction, setTypeOfCRUDAction] = useState('');
  const [state, setState] = useState('true');
  const [isLoading, setIsLoading] = useState(false);

  const [stages, setStages] = useState<any>([]);
  const [states, setStates] = useState<any>([]);
  const [documentTypes, setDocumentTypes] = useState<any>([]);

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
    // const newData =
    //   dataSource &&
    //   dataSource.filter(
    //     (row: any) =>
    //       // row.requestProceedingsNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
    //       // row.requestStateName?.toLowerCase().includes(searchText.toLowerCase()) ||
    //       // row.requestStageName?.toLowerCase().includes(searchText.toLowerCase()) ||
    //       // row.requestPhaseName?.toLowerCase().includes(searchText.toLowerCase()) ||
    //       // row.requestFiledStatus?.toLowerCase().includes(searchText.toLowerCase()) ||
    //       // row.documentType?.toLowerCase().includes(searchText.toLowerCase()) ||
    //       // row.consecutive?.toLowerCase().includes(searchText.toLowerCase()),
    //   );
    // setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getDocuments = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await callEndpoint(getDocumentsSearch(data));
      response?.success && setRows(response.data);
      response?.success && setDataSource(response.data);
      setIsLoading(false);
    } catch (error) {
      showToast('error', 'Ocurrió un error cargando la consulta', 'Contacte a soporte técnico');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocuments(dataSearch);
    callEndpoint(getAllStates()).then((response) => {
      response.success && setStates(response.data);
    });
    callEndpoint(getTemplates()).then((response) => {
      response.success && setDocumentTypes(response.data);
    });
    callEndpoint(getAllStages()).then((response) => {
      response?.success && setStages(response.data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDefenderSaved]);

  const handleSearchInput = (e: any) => {
    setDataSearch({
      ...dataSearch,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectInput = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  const handleOpenModal = (crudAction: any, positionSelected?: any) => {
    setTypeOfCRUDAction(crudAction);
    setPlantillaSelected(positionSelected);
    setOpenModal(!openModal);
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Documento',
      width: 520,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'consecutive',
      headerName: 'Consecutivo',
      width: 520,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => params?.value?.consecutive ?? 'No aplica',
    },
    {
      field: 'radicado',
      headerName: 'Radicado',
      width: 520,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => params?.value?.radicado ?? 'No aplica',
    },
    {
      field: 'expediente',
      headerName: 'Numero de expediente',
      width: 520,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'templateName',
      headerName: 'Fase',
      width: 520,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: GridRenderCellParams) => 'Instruccion',
    },
    {
      field: 'stageName',
      headerName: 'Etapa',
      width: 320,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'documentType',
      headerName: 'Tipo de documento',
      width: 320,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'state',
      headerName: 'Estado',
      width: 520,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
  ];

  return (
    <div>
      {/*Title Component*/}{' '}
      <Titles title="Busqueda de documentos" moduleDescription="Modulo de busqueda de documentos.">
        {/* {canCreate && (
          <button
            onClick={() => handleOpenModal('create')}
            className="flex justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            <img src={iconPlus} className="mr-4" alt="Crear nuevo abogado de oficio" />
            Nueva plantilla
          </button>
        )} */}

        {/* Modal create */}
        {openModal && canEdit && canCreate && (typeOfCRUDAction === 'edit' || typeOfCRUDAction === 'create') && (
          <ModalBusquedas
            openModal={openModal}
            setOpenModal={setOpenModal}
            plantillaSelected={plantillaSelected}
            setPublicDefenderSaved={setPublicDefenderSaved}
            publicDefenderSaved={publicDefenderSaved}
            typeOfCRUDAction={typeOfCRUDAction}
          />
        )}
        {/* Modal change state */}
        {openModal && canEdit && typeOfCRUDAction === 'changeState' && (
          <ModalUpdatePlantillaState
            openModal={openModal}
            setOpenModal={setOpenModal}
            plantillaSelected={plantillaSelected}
            setPublicDefenderSaved={setPublicDefenderSaved}
            publicDefenderSaved={publicDefenderSaved}
            typeOfCRUDAction={typeOfCRUDAction}
          />
        )}
      </Titles>
      {/*Search tab*/}{' '}
      <div className="grid grid-cols-3 gap-4 ml-27 mr-27 mt-29 bg-white w-auto rounded p-10">
        <div className="">
          {/* <TextField
              id="demo-helper-text-aligned"
              name='requestPhaseName'
              label="Fase"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            /> */}
          <Box>
            <select className="w-full" name="requestPhaseName" onChange={handleSearchInput}>
              <option value={null}>Fase</option>
              <option value="Indagación">Indagación</option>
              <option value="Juzgamiento">Juzgamiento</option>
            </select>
          </Box>
        </div>
        {/* Select */}
        <div className="">
          <Box>
            {/* <TextField
              id="demo-helper-text-aligned"
              label="Etapa"
              name="requestStageName"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            /> */}
            <select
              className="w-full"
              name="requestStageName"
              onChange={handleSearchInput}
              // value={searchInput.requestStageName}
            >
              <option value={null}>Etapa</option>
              {stages.map((stage) => (
                <option value={stage.stageName}>{stage.stageName}</option>
              ))}
            </select>
          </Box>
        </div>
        <div>
          <Box>
            {/* <TextField
              id="demo-helper-text-aligned"
              label="Estado"
              name="requestStateName"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            /> */}
            <select
              className="w-full"
              name="requestStateName"
              onChange={handleSearchInput}
              // value={searchInput.requestStateName}
            >
              <option value={null}>Estado</option>
              {states.map((state) => (
                <option value={state.stateName}>{state.stateName}</option>
              ))}
            </select>
          </Box>
        </div>
        <div className="">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Numero Radicado"
              name="requestFileNumber"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            />
          </Box>
        </div>
        <div className="">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Numero Expediente"
              name="requestProceedingsNumber"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            />
          </Box>
        </div>
        <div className="">
          <Box>
            {/* <TextField
              id="demo-helper-text-aligned"
              label="Estado Expedientes"
              name="requestFiledStatus"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            /> */}
            <select
              className="w-full"
              name="requestFiledStatus"
              onChange={handleSearchInput}
              // value={searchInput.requestFiledStatus}
            >
              <option value={null}>Estado Expedientes</option>
              <option value="Activo">Activo</option>
              <option value="Archivado">Archivado</option>
            </select>
          </Box>
        </div>
        <div className="">
          <Box>
            {/* <TextField
              id="demo-helper-text-aligned"
              label="Tipo Documento"
              name="documentType"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            /> */}
            <select
              className="w-full"
              name="documentType"
              onChange={handleSearchInput}
              // value={searchInput.documentType}
            >
              <option value={null}>Tipo Documento</option>
              {documentTypes.map((documentType: any) => (
                <option value={documentType.templateName}>{documentType.templateName}</option>
              ))}
            </select>
          </Box>
        </div>
        <div className="">
          <Box>
            <TextField
              id="demo-helper-text-aligned"
              label="Consecutivo"
              name="consecutive"
              onChange={handleSearchInput}
              className="w-full"
              size="small"
            />
          </Box>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => getDocuments(dataSearch)}
            className="justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            Buscar
          </button>
          <button
            onClick={() => {
              getDocuments({
                requestPhaseName: null,
                requestStageName: null,
                requestStateName: null,
                requestFileNumber: null,
                requestProceedingsNumber: null,
                requestFiledStatus: null,
                documentType: null,
                consecutive: null,
              });
              setDataSearch({
                requestPhaseName: null,
                requestStageName: null,
                requestStateName: null,
                requestFileNumber: null,
                requestProceedingsNumber: null,
                requestFiledStatus: null,
                documentType: null,
                consecutive: null,
              });
            }}
            className="justify-center items-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
          >
            Limpiar
          </button>
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
