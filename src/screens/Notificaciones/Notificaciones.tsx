import PropTypes, { object } from 'prop-types';
import { useEffect, useState } from 'react';
import { Titles } from '../../components';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { FormLabel, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import { UploadFileComponent } from './components/UploadFileComponent';
import { useFetchAndLoad } from '../../hooks';
import {
  getAllCompletedComunicationsByTitle,
  getAllComunications,
  getAllComunicationsByTitle,
  getVouchers,
  sendCommunication,
  sendCommunicationWithFile,
} from '../../services/communications.service';
import iconEdit from '../../assets/images/svg/iconEdit.svg';
import iconPlus from '../../assets/images/svg/iconPlus.svg';
import { getAllStages } from '../../services/stages.service';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
  tab: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    color: '#747B87',
    fontWeight: 400,
    fontSize: '1.2rem',
  },
  tabs: {
    // maxWidth: 252,
    height: '100%',
    fontSize: '1.2rem',
    borderRight: 'unset',
    '& .Mui-selected': {
      color: '#E8423F',
      fontWeight: 600,
      borderTop: '1px solid white',
      borderBottom: '1px solid white',
      borderRight: '1px solid white',
    },
    '& .MuiTabs-indicator': {
      // backgroundColor: '#651DFF',
      marginRight: '247px',
      width: 4,
    },
  },

  tabPanel: {
    border: '1px solid #651DFF',
    marginLeft: '-1px',
    width: '100%',
  },
}));

const mock = [
  {
    id: 1,
    title: 'Comunicar auto inhibitorio',
    date: '2021-09-01',
    status: 'Pendiente',
  },
  {
    id: 2,
    title: 'Comunicar inicio indagación previa',
    date: '2021-09-01',
    status: 'Pendiente',
  },
  {
    id: 3,
    title: 'Comunicar archivo de indagación previa',
    date: '2021-09-01',
    status: 'Pendiente',
  },
  {
    id: 4,
    title: 'Comunicar y/o notificar el inicio de investigación disciplinaria',
    date: '2021-09-01',
    status: 'Pendiente',
  },
  {
    id: 5,
    title: 'Comunicar y/o notificar el cierre de la investigación disciplinaria',
    date: '2021-09-01',
    status: 'Pendiente',
  },
  {
    id: 6,
    title: 'Comunicar y/o notificar archivo de investigación disciplinaria',
    date: '2021-09-01',
    status: 'Pendiente',
  },
  {
    id: 7,
    title: 'Comunicar y/o notificar auto de cargos',
    date: '2021-09-01',
    status: 'Pendiente',
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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

export const Notificaciones = () => {
  const classes = useStyles();
  const { callEndpoint } = useFetchAndLoad();
  const [step, setStep] = useState(1);
  const [communications, setCommunications] = useState<any>({
    pending: [],
    inProgressOrCompleted: [],
  });
  const [communicationSelected, setCommunicationSelected] = useState(null);
  const [expedienteSelected, setExpedienteSelected] = useState(null);
  const [rows, setRows] = useState<any>([]);
  const [docFiles, setDocFiles] = useState<any>([]);
  const [etapas, setEtapas] = useState<any>([]);
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);
  const [dates, setDates] = useState<any>();
  const [vouchers, setVouchers] = useState<any>([]);

  useEffect(() => {
    callEndpoint(getAllComunications()).then((response) => {
      setCommunications(response);
    });
  }, []);

  useEffect(() => {
    if (step === 2) {
      callEndpoint(getAllComunicationsByTitle(communicationSelected)).then((response) => {
        setRows(response);
      });
      callEndpoint(getAllStages()).then((response) => {
        setEtapas(response?.data);
      });
    }
    if (step === 0) {
      callEndpoint(getAllCompletedComunicationsByTitle(communicationSelected)).then((response) => {
        setRows(response);
      });
      callEndpoint(getAllStages()).then((response) => {
        setEtapas(response?.data);
      });
    }
    if (step === -2) {
      callEndpoint(getVouchers(expedienteSelected.requestId.id, expedienteSelected.id)).then((response) => {
        setVouchers(response?.data);
      });
    }
  }, [step]);

  useEffect(() => {
    if (step === 3 && docFiles.length === 1) {
      handleSendAttachment();
    }
  }, [docFiles]);

  const columns = [
    {
      field: 'requestId',
      headerName: 'No. Expediente',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => params?.value?.expediente,
    },
    // {
    //   field: 'requestStage',
    //   headerName: 'Etapa',
    //   width: 200,
    //   cellClassName: 'MuiDataGrid-cell--textCenter',
    //   headerClassName: 'super-app-theme--header',
    //   valueGetter: (params: any) => etapas.find((etapa: any) => etapa.id === params?.row?.requestId?.etapa)?.stageName,
    // },
    {
      field: 'state',
      headerName: 'Estado',
      width: 250,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'action',
      headerName: 'Acción',
      width: 250,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      valueGetter: (params: any) => {
        let actions = [];
        (params?.row?.seComunicaApoderado || params?.row?.seComunicaDisciplinado || params?.row?.seComunicaQuejoso) &&
          actions.push('Comunicar');
        (params?.row?.seNotificaApoderado || params?.row?.seNotificaDisciplinado || params?.row?.seNotificaQuejoso) &&
          actions.push('Notificar');
        return actions.join(', ');
      },
    },
    // {
    //   field: 'middle',
    //   headerName: 'Medio',
    //   width: 200,
    //   cellClassName: 'MuiDataGrid-cell--textCenter',
    //   headerClassName: 'super-app-theme--header',
    // },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      minWidth: 100,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className="bg-transparent"
          // disabled={!canEdit}
          icon={
            <Tooltip title="">
              <img src={iconEdit} className="" alt="buscar un cargo" />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            setExpedienteSelected(params?.row);
            setStep(3);
          }}
          label="View/Edit"
        />,
      ],
    },
  ];

  const columnsCompleted = [
    {
      field: 'requestId',
      headerName: 'No. Expediente',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
      renderCell: (params: any) => params?.value?.expediente,
    },
    // {
    //   field: 'requestStage',
    //   headerName: 'Etapa',
    //   width: 200,
    //   cellClassName: 'MuiDataGrid-cell--textCenter',
    //   headerClassName: 'super-app-theme--header',
    //   valueGetter: (params: any) => etapas.find((etapa: any) => etapa.id === params?.row?.requestId?.etapa)?.stageName,
    // },
    {
      field: 'state',
      headerName: 'Estado',
      width: 250,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      headerClassName: 'super-app-theme--header',
    },
    // {
    //   field: 'middle',
    //   headerName: 'Medio',
    //   width: 200,
    //   cellClassName: 'MuiDataGrid-cell--textCenter',
    //   headerClassName: 'super-app-theme--header',
    // },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      minWidth: 100,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className="bg-transparent"
          // disabled={!canEdit}
          icon={
            <Tooltip title="">
              <img src={iconPlus} className="bg-black" alt="buscar un cargo" />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            setExpedienteSelected(params?.row);
            setStep(-2);
          }}
          label="View/Edit"
        />,
      ],
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  const handleSendCommunication = (data: any) => {
    let body = {
      requestId: expedienteSelected?.requestId?.id,
      to: data?.to,
      type: data?.type,
      documentId: expedienteSelected?.id,
      dates: dates,
    };

    if (data.to === 'quejoso') {
      body.dates = { quejoso: new Date().toISOString() };
    }

    if (data.to === 'disciplinados') {
      let disciplinados = expedienteSelected?.requestId?.disciplined;
      let disciplinadosWithDate = disciplinados.map((disciplinado: any) => {
        if (!Object.keys(dates).includes(disciplinado.id.toString())) {
          return { [disciplinado.id]: new Date().toISOString() };
        } else {
          return { [disciplinado.id]: dates[disciplinado.id] };
        }
      });
      let datesDisciplinados = Object.assign({}, ...disciplinadosWithDate);
      body.dates = datesDisciplinados;
    }

    if (data.to === 'disciplinados') {
      let disciplinados = expedienteSelected?.requestId?.disciplined;
      let lawyersWithDate = disciplinados.map((disciplinado: any) => {
        if (!Object.keys(dates).includes(disciplinado.lawyer.id.toString())) {
          return { [disciplinado.lawyer.id]: new Date().toISOString() };
        } else {
          return { [disciplinado.lawyer.id]: dates[disciplinado.lawyer.id] };
        }
      });
      let datesLawyers = Object.assign({}, ...lawyersWithDate);
      body.dates = datesLawyers;
    }

    callEndpoint(sendCommunication(body)).then((response) => {
      if (response?.success) {
        showToast('success', '¡Enviado!', '');
        setDocFiles([]);
        setDates({});
      } else {
        showToast('error', '¡Error!', '');
      }
    });
  };

  const handleSendAttachment = () => {
    let body = {
      ...docFiles[0],
    };

    callEndpoint(sendCommunicationWithFile(expedienteSelected?.requestId?.id, body)).then((response) => {
      if (response?.success) {
        showToast('success', '¡Enviado!', '');
        setDocFiles([]);
      } else {
        showToast('error', '¡Error!', '');
      }
    });
  };

  // Crea una función que asigne los index de los tabs a las variables value y setValue

  return (
    <>
      <Titles title="Notificaciones" moduleDescription="Módulo de administración de notificaciones."></Titles>
      {step === 1 && (
        <>
          <div className="grid grid-cols-4 p-10 gap-5">
            <div className="col-span-3 ">
              <p className="text-xl font-semibold text-primary">Comunicaciones y/o notificaciones</p>
              <div className="grid grid-cols-1 gap-4 mt-10">
                {communications?.pending?.map((item: any) => (
                  <div
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                    onClick={() => {
                      setStep(2);
                      setCommunicationSelected(item.title);
                    }}
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 underline">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-xl font-semibold text-center text-primary">Pendientes</p>
              <div className="grid grid-cols-1 gap-4 mt-10">
                {communications.pending.map((item: any) => (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-primary text-center">{item.count}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 px-10 gap-5 pb-10">
            <div className="col-span-3 ">
              <p className="text-xl font-semibold text-primary">Comunicaciones y/o notificaciones</p>
              <div className="grid grid-cols-1 gap-4 mt-10">
                {communications?.inProgressOrCompleted?.map((item: any) => (
                  <div
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                    onClick={() => {
                      setStep(0);
                      setCommunicationSelected(item.title);
                    }}
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 underline">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1">
              <p className="text-xl font-semibold text-center text-primary">Completadas</p>
              <div className="grid grid-cols-1 gap-4 mt-10">
                {communications?.inProgressOrCompleted?.map((item: any) => (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-primary text-center">{item.count}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <button
            onClick={() => {
              setStep(1);
            }}
            className="bg-primary text-white font-bold py-2 px-4 rounded ml-27 mt-4"
          >
            Volver
          </button>
          <div className={`grid grid-flow-col ml-27 mr-27 mt-4  w-auto rounded  p-0 relative `}>
            {rows && (
              <Box>
                <DataGrid
                  columns={columns}
                  density="compact"
                  onCellDoubleClick={(e: any) => {
                    setStep(3);
                    setExpedienteSelected(e.row);
                  }}
                  editMode="row"
                  rows={rows}
                  autoHeight={true}
                  pageSize={20}
                  rowsPerPageOptions={[20]}
                  getRowId={(row) => row?.id}
                />
              </Box>
            )}
          </div>
        </>
      )}
      {step === 0 && (
        <>
          <button
            onClick={() => {
              setStep(1);
            }}
            className="bg-primary text-white font-bold py-2 px-4 rounded ml-27 mt-4"
          >
            Volver
          </button>
          <div className={`grid grid-flow-col ml-27 mr-27 mt-4  w-auto rounded  p-0 relative `}>
            {rows && (
              <Box>
                <DataGrid
                  columns={columnsCompleted}
                  density="compact"
                  onCellDoubleClick={(e: any) => {
                    setStep(-1);
                    setExpedienteSelected(e.row);
                  }}
                  editMode="row"
                  rows={rows}
                  autoHeight={true}
                  pageSize={20}
                  rowsPerPageOptions={[20]}
                  getRowId={(row) => row?.id}
                />
              </Box>
            )}
          </div>
        </>
      )}
      {step === 3 && (
        <div className="m-10">
          <button
            onClick={() => {
              setStep(2);
            }}
            className="bg-primary text-white font-bold py-2 px-4 rounded my-4"
          >
            Volver
          </button>
          <Tabs
            className={classes.tabs}
            // orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Comunicación apoderado"
              {...a11yProps(0)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seComunicaApoderado &&
                  !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]
                        ?.fechaComunicacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaComunicacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Comunicación disciplinado"
              {...a11yProps(1)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seComunicaDisciplinado &&
                  !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaComunicacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaComunicacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Comunicación quejoso"
              {...a11yProps(2)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seComunicaQuejoso &&
                  !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail &&
                  !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionFisica
                    ? 'block'
                    : 'none',
              }}
            />

            <Tab
              label="Notificación apoderado"
              {...a11yProps(3)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seNotificaApoderado &&
                  !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]
                        ?.fechaNotificacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaNotificacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Notificación disciplinado"
              {...a11yProps(4)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seNotificaDisciplinado &&
                  !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaNotificacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaNotificacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Notificación quejoso"
              {...a11yProps(5)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seNotificaQuejoso &&
                  !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionEmail &&
                  !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionFisica
                    ? 'block'
                    : 'none',
              }}
            />
          </Tabs>
          {expedienteSelected.seComunicaApoderado &&
            !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaComunicacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaComunicacionEmail,
            ) && (
              <TabPanel value={value} index={0}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Comunicación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del disciplinado</p>
                        <p className="font-semibold text-secondary">Fecha de comunicación</p>
                        <p className="font-semibold text-secondary">Medio de comunicación</p>
                        <p className="font-semibold text-secondary">Adjuntar voucher</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item?.lawyer?.publicDefenderName}`}</p>
                          {item?.lawyer?.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de comunicación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={new Date().toISOString().split('T')[0]}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de comunicación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    [item?.lawyer?.id]: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha recibido comunicación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    fechaNotificacionFisica: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                value={
                                  item?.lawyer?.medioAComunicar !== 'fisico'
                                    ? new Date().toISOString().split('T')[0]
                                    : dates?.[item?.lawyer?.id]
                                }
                                disabled={item?.lawyer?.medioAComunicar !== 'fisico'}
                                onChange={(e) => {
                                  item?.lawyer?.medioAComunicar === 'fisico'
                                    ? setDates({
                                        ...dates,
                                        [item?.lawyer?.id]: e.target.value,
                                      })
                                    : setDates({
                                        ...dates,
                                        [item?.lawyer?.id]: new Date().toISOString(),
                                      });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {item.lawyer.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido comunicación personal
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    onChange={(e) => {
                                      setDates({
                                        ...dates,
                                        fechaNotificacionFisica: e.target.value,
                                      });
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item?.lawyer?.medioAComunicar === 'email'
                              ? `Correo: ${item?.lawyer?.publicDefenderEmail}`
                              : item?.lawyer?.medioAComunicar === 'fisico'
                              ? `Personal: ${item?.lawyer?.publicDefenderAddress}`
                              : `Correo: ${item?.lawyer?.publicDefenderEmail} y Personal: ${item?.lawyer?.publicDefenderAddress}`}
                          </p>
                          {item?.lawyer?.medioAComunicar !== 'email' && (
                            <UploadFileComponent
                              setDocFiles={setDocFiles}
                              docFiles={docFiles}
                              dataRequest={{
                                userType: 'apoderado',
                                userId: item?.lawyer?.id,
                                documentId: expedienteSelected?.id,
                                type: 'comunicacion',
                                date: dates?.[item?.lawyer?.id],
                                fechaRecibido: dates?.fechaNotificacionFisica,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <button
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                        onClick={() =>
                          handleSendCommunication({
                            to: 'apoderados',
                            type: 'comunicacion',
                          })
                        }
                      >
                        Comunicar
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seComunicaDisciplinado &&
            !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaComunicacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaComunicacionEmail,
            ) && (
              <TabPanel value={value} index={1}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Comunicación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del disciplinado</p>
                        <p className="font-semibold text-secondary">Fecha de comunicación</p>
                        <p className="font-semibold text-secondary">Medio de comunicación</p>
                        <p className="font-semibold text-secondary">Adjuntar voucher</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item.name} ${item.primerApellido}`}</p>
                          {item.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de comunicación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={new Date().toISOString().split('T')[0]}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de comunicación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    [item.id]: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha recibido notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    fechaNotificacionFisica: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                disabled={item.medioAComunicar !== 'fisico'}
                                value={
                                  item.medioAComunicar !== 'fisico'
                                    ? new Date().toISOString().split('T')[0]
                                    : dates?.[item.id]
                                }
                                onChange={(e) => {
                                  item?.medioAComunicar === 'fisico'
                                    ? setDates({
                                        ...dates,
                                        [item.id]: e.target.value,
                                      })
                                    : setDates({
                                        ...dates,
                                        [item.id]: new Date().toISOString(),
                                      });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {item.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido comunicación personal
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    onChange={(e) => {
                                      setDates({
                                        ...dates,
                                        fechaNotificacionFisica: e.target.value,
                                      });
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item.medioAComunicar === 'email'
                              ? `Correo: ${item.email}`
                              : item.medioAComunicar === 'fisico'
                              ? `Personal: ${item.direccionResidencia}`
                              : `Correo: ${item.email} y Personal: ${item.direccionResidencia}`}
                          </p>
                          {item.medioAComunicar !== 'email' && (
                            <UploadFileComponent
                              setDocFiles={setDocFiles}
                              docFiles={docFiles}
                              dataRequest={{
                                userType: 'disciplinado',
                                userId: item?.id,
                                documentId: expedienteSelected?.id,
                                type: 'comunicacion',
                                date: dates?.[item?.id],
                                fechaRecibido: dates?.fechaNotificacionFisica,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <button
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                        onClick={() =>
                          handleSendCommunication({
                            to: 'disciplinados',
                            type: 'comunicacion',
                          })
                        }
                      >
                        Comunicar
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seComunicaQuejoso &&
            !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail &&
            !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionFisica && (
              <TabPanel value={value} index={2}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Comunicación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del quejoso</p>
                        <p className="font-semibold text-secondary">Fecha de comunicación</p>
                        <p className="font-semibold text-secondary">Medio de comunicación</p>
                        <p className="font-semibold text-secondary">Adjuntar voucher</p>
                        <p>{expedienteSelected?.requestId?.nombreSolicitante}</p>
                        {expedienteSelected?.requestId?.comunicationChannelSelected === 'anonimo' ? (
                          <div>
                            <label className="block text-xs py-1 text-left text-gray-700">
                              Fecha de comunicación por correo
                            </label>
                            <input
                              type="date"
                              required
                              disabled
                              value={new Date().toISOString().split('T')[0]}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                              Fecha de comunicación personal
                            </label>
                            <input
                              type="date"
                              required
                              onChange={(e) => {
                                setDates({
                                  ...dates,
                                  quejoso: e.target.value,
                                });
                              }}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                              Fecha recibido comunicación personal
                            </label>
                            <input
                              type="date"
                              required
                              onChange={(e) => {
                                setDates({
                                  ...dates,
                                  fechaRecibidoQuejoso: e.target.value,
                                });
                              }}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="date"
                              required
                              disabled={expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'}
                              value={
                                expedienteSelected?.fechaComunicacionQuejoso
                                  ? moment(expedienteSelected?.fechaComunicacionQuejoso).format('YYYY-MM-DD')
                                  : expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                                  ? new Date().toISOString().split('T')[0]
                                  : dates?.quejoso
                              }
                              onChange={(e) => {
                                expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                                  ? setDates({
                                      ...dates,
                                      quejoso: new Date().toISOString(),
                                    })
                                  : setDates({
                                      ...dates,
                                      quejoso: e.target.value,
                                    });
                              }}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            {expedienteSelected?.requestId?.comunicationChannelSelected === 'personal' && (
                              <>
                                <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                  Fecha recibido comunicación personal
                                </label>
                                <input
                                  type="date"
                                  required
                                  onChange={(e) => {
                                    setDates({
                                      ...dates,
                                      fechaRecibidoQuejoso: e.target.value,
                                    });
                                  }}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                />
                              </>
                            )}
                          </div>
                        )}
                        <p>
                          {expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                            ? `Correo: ${expedienteSelected?.requestId?.correo}`
                            : expedienteSelected?.requestId?.comunicationChannelSelected === 'personal'
                            ? `Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`
                            : `Correo: ${expedienteSelected?.requestId?.correo} y Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`}
                        </p>
                        {expedienteSelected?.requestId?.comunicationChannelSelected !== 'informante' && (
                          <UploadFileComponent
                            setDocFiles={setDocFiles}
                            docFiles={docFiles}
                            dataRequest={{
                              userType: 'quejoso',
                              documentId: expedienteSelected?.id,
                              type: 'comunicacion',
                              date: dates?.quejoso,
                              fechaRecibido: dates?.fechaRecibidoQuejoso,
                            }}
                          />
                        )}
                      </div>
                      <div className="mt-4">
                        <button
                          className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                          onClick={() =>
                            handleSendCommunication({
                              to: 'quejoso',
                              type: 'comunicacion',
                            })
                          }
                        >
                          Comunicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seNotificaApoderado &&
            !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaNotificacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaNotificacionEmail,
            ) && (
              <TabPanel value={value} index={3}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Notificación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del apoderado</p>
                        <p className="font-semibold text-secondary">Fecha de notificación</p>
                        <p className="font-semibold text-secondary">Medio de notificación</p>
                        <p className="font-semibold text-secondary">Adjuntar voucher</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item?.lawyer?.publicDefenderName}`}</p>
                          {item?.lawyer?.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de notificación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={new Date().toISOString().split('T')[0]}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    [item?.lawyer?.id]: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha recibido notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    fechaNotificacionFisica: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                value={
                                  item?.lawyer?.medioAComunicar !== 'fisico'
                                    ? new Date().toISOString().split('T')[0]
                                    : dates?.[item?.lawyer?.id]
                                }
                                disabled={item?.lawyer?.medioAComunicar !== 'fisico'}
                                onChange={(e) => {
                                  item?.lawyer?.medioAComunicar === 'fisico'
                                    ? setDates({
                                        ...dates,
                                        [item?.lawyer?.id]: e.target.value,
                                      })
                                    : setDates({
                                        ...dates,
                                        [item?.lawyer?.id]: new Date().toISOString(),
                                      });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {item.lawyer.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido notificación personal
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    onChange={(e) => {
                                      setDates({
                                        ...dates,
                                        fechaNotificacionFisica: e.target.value,
                                      });
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item?.lawyer?.medioAComunicar === 'email'
                              ? `Correo: ${item?.lawyer?.publicDefenderEmail}`
                              : item?.lawyer?.medioAComunicar === 'fisico'
                              ? `Personal: ${item?.lawyer?.publicDefenderAddress}`
                              : `Correo: ${item?.lawyer?.publicDefenderEmail} y Personal: ${item?.lawyer?.publicDefenderAddress}`}
                          </p>
                          {item?.lawyer?.medioAComunicar !== 'email' && (
                            <UploadFileComponent
                              setDocFiles={setDocFiles}
                              docFiles={docFiles}
                              dataRequest={{
                                userType: 'apoderado',
                                userId: item?.lawyer?.id,
                                documentId: expedienteSelected?.id,
                                type: 'notificacion',
                                date: dates?.[item?.lawyer?.id],
                                fechaRecibido: dates?.fechaNotificacionFisica,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <button
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                        onClick={() =>
                          handleSendCommunication({
                            to: 'apoderados',
                            type: 'notificacion',
                          })
                        }
                      >
                        Notificar
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seNotificaDisciplinado &&
            !Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaNotificacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaNotificacionEmail,
            ) && (
              <TabPanel value={value} index={4}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Notificación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del disciplinado</p>
                        <p className="font-semibold text-secondary">Fecha de notificación</p>
                        <p className="font-semibold text-secondary">Medio de notificación</p>
                        <p className="font-semibold text-secondary">Adjuntar voucher</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item.name} ${item.primerApellido}`}</p>
                          {item.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de notificación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={new Date().toISOString().split('T')[0]}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    [item.id]: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha recibido notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                onChange={(e) => {
                                  setDates({
                                    ...dates,
                                    fechaNotificacionFisica: e.target.value,
                                  });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                disabled={item.medioAComunicar !== 'fisico'}
                                value={
                                  item.medioAComunicar !== 'fisico'
                                    ? new Date().toISOString().split('T')[0]
                                    : dates?.[item.id]
                                }
                                onChange={(e) => {
                                  item.medioAComunicar === 'fisico'
                                    ? setDates({
                                        ...dates,
                                        [item.id]: e.target.value,
                                      })
                                    : setDates({
                                        ...dates,
                                        [item.id]: new Date().toISOString(),
                                      });
                                }}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {item.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido notificación personal
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    onChange={(e) => {
                                      setDates({
                                        ...dates,
                                        fechaNotificacionFisica: e.target.value,
                                      });
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item.medioAComunicar === 'email'
                              ? `Correo: ${item.email}`
                              : item.medioAComunicar === 'fisico'
                              ? `Personal: ${item.direccionResidencia}`
                              : `Correo: ${item.email} y Personal: ${item.direccionResidencia}`}
                          </p>
                          {item.medioAComunicar !== 'email' && (
                            <UploadFileComponent
                              setDocFiles={setDocFiles}
                              docFiles={docFiles}
                              dataRequest={{
                                userType: 'disciplinado',
                                userId: item?.id,
                                documentId: expedienteSelected?.id,
                                type: 'notificacion',
                                date: dates?.[item?.id],
                                fechaRecibido: dates?.fechaNotificacionFisica,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <button
                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                        onClick={() =>
                          handleSendCommunication({
                            to: 'disciplinados',
                            type: 'notificacion',
                          })
                        }
                      >
                        Notificar
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seNotificaQuejoso &&
            !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionEmail &&
            !expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionFisica && (
              <TabPanel value={value} index={5}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Notifiación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del quejoso</p>
                        <p className="font-semibold text-secondary">Fecha de notificación</p>
                        <p className="font-semibold text-secondary">Medio de notificación</p>
                        <p className="font-semibold text-secondary">Adjuntar voucher</p>
                        <p>{expedienteSelected?.requestId?.nombreSolicitante}</p>
                        {expedienteSelected?.requestId?.comunicationChannelSelected === 'anonimo' ? (
                          <div>
                            <label className="block text-xs py-1 text-left text-gray-700">
                              Fecha de notificación por correo
                            </label>
                            <input
                              type="date"
                              required
                              disabled
                              value={new Date().toISOString().split('T')[0]}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                              Fecha de notificación personal
                            </label>
                            <input
                              type="date"
                              required
                              onChange={(e) => {
                                setDates({
                                  ...dates,
                                  quejoso: e.target.value,
                                });
                              }}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                              Fecha recibido comunicación personal
                            </label>
                            <input
                              type="date"
                              required
                              onChange={(e) => {
                                setDates({
                                  ...dates,
                                  fechaRecibidoQuejoso: e.target.value,
                                });
                              }}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="date"
                              required
                              disabled={expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'}
                              value={
                                expedienteSelected?.fechaNotificacionQuejoso
                                  ? moment(expedienteSelected?.fechaNotificacionQuejoso).format('YYYY-MM-DD')
                                  : expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                                  ? new Date().toISOString().split('T')[0]
                                  : dates?.quejoso
                              }
                              onChange={(e) => {
                                expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                                  ? setDates({
                                      ...dates,
                                      quejoso: new Date().toISOString(),
                                    })
                                  : setDates({
                                      ...dates,
                                      quejoso: e.target.value,
                                    });
                              }}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            {expedienteSelected?.requestId?.comunicationChannelSelected === 'personal' && (
                              <>
                                <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                  Fecha recibido comunicación personal
                                </label>
                                <input
                                  type="date"
                                  required
                                  onChange={(e) => {
                                    setDates({
                                      ...dates,
                                      fechaRecibidoQuejoso: e.target.value,
                                    });
                                  }}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                />
                              </>
                            )}
                          </div>
                        )}
                        <p>
                          {expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                            ? `Correo: ${expedienteSelected?.requestId?.correo}`
                            : expedienteSelected?.requestId?.comunicationChannelSelected === 'personal'
                            ? `Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`
                            : `Correo: ${expedienteSelected?.requestId?.correo} y Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`}
                        </p>
                        {expedienteSelected?.requestId?.comunicationChannelSelected !== 'informante' && (
                          <UploadFileComponent
                            setDocFiles={setDocFiles}
                            docFiles={docFiles}
                            dataRequest={{
                              userType: 'quejoso',
                              documentId: expedienteSelected?.id,
                              type: 'notificacion',
                              date: dates?.quejoso,
                              fechaRecibido: dates?.fechaRecibidoQuejoso,
                            }}
                          />
                        )}
                      </div>
                      <div className="mt-4">
                        <button
                          className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                          onClick={() =>
                            handleSendCommunication({
                              to: 'quejoso',
                              type: 'notificacion',
                            })
                          }
                        >
                          Notificar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
        </div>
      )}
      {step === -2 && (
        <div className="m-10">
          <button
            onClick={() => {
              setStep(0);
            }}
            className="bg-primary text-white font-bold py-2 px-4 rounded my-4"
          >
            Volver
          </button>
          <Tabs
            className={classes.tabs}
            // orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab
              label="Comunicación apoderado"
              {...a11yProps(0)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seComunicaApoderado &&
                  Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]
                        ?.fechaComunicacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaComunicacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Comunicación disciplinado"
              {...a11yProps(1)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seComunicaDisciplinado &&
                  Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaComunicacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaComunicacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Comunicación quejoso"
              {...a11yProps(2)}
              className={classes.tab}
              style={{
                display:
                  (expedienteSelected.seComunicaQuejoso &&
                    expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail) ||
                  expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionFisica
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Notificación apoderado"
              {...a11yProps(3)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seNotificaApoderado &&
                  Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]
                        ?.fechaNotificacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaNotificacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Notificación disciplinado"
              {...a11yProps(4)}
              className={classes.tab}
              style={{
                display:
                  expedienteSelected.seNotificaDisciplinado &&
                  Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
                    (key) =>
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaNotificacionFisica ||
                      expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]
                        ?.fechaNotificacionEmail,
                  )
                    ? 'block'
                    : 'none',
              }}
            />
            <Tab
              label="Notificación quejoso"
              {...a11yProps(5)}
              className={classes.tab}
              style={{
                display:
                  (expedienteSelected.seNotificaQuejoso &&
                    expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionEmail) ||
                  expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionFisica
                    ? 'block'
                    : 'none',
              }}
            />
          </Tabs>
          {expedienteSelected.seComunicaApoderado &&
            Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaComunicacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaComunicacionEmail,
            ) && (
              <TabPanel value={value} index={0}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Comunicación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del apoderado</p>
                        <p className="font-semibold text-secondary">Fecha de Comunicación</p>
                        <p className="font-semibold text-secondary">Medio de Comunicación</p>
                        <p className="font-semibold text-secondary">Vouchers</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item.lawyer.publicDefenderName}`}</p>
                          {item.lawyer.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de comunicación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                      item.lawyer.id
                                    ]?.fechaComunicacionEmail,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de comunicación personal
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                      item.lawyer.id
                                    ]?.fechaComunicacionFisica,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {expedienteSelected?.communicationsAndNotificationsData?.apoderados[item.lawyer.id]
                                ?.fechaRecibidoComunicacionFisica && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido comunicación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaRecibidoComunicacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  item.lawyer.medioAComunicar === 'email'
                                    ? new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaComunicacionEmail,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    : new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaComunicacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                }
                              />
                              {item.lawyer.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido comunicación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaRecibidoComunicacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item.lawyer.medioAComunicar === 'email'
                              ? `Correo: ${item.email}`
                              : item.lawyer.medioAComunicar === 'fisico'
                              ? `Personal: ${item.lawyer.direccionResidencia}`
                              : `Correo: ${item.lawyer.email} y Personal: ${item.lawyer.direccionResidencia}`}
                          </p>
                          {vouchers?.comunicacion?.apoderado?.length > 0 && (
                            <div className="flex flex-col gap-4">
                              {vouchers?.comunicacion?.apoderado?.map((itemB, index) => (
                                <>
                                  {item?.lawyer?.id === itemB?.voucherData?.userId && (
                                    <div
                                      className="justify-center p-4 rounded text-white mx-4 cursor-pointer bg-primary"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = itemB?.base64;
                                        link.download = itemB?.fileName;
                                        link.click();
                                      }}
                                    >
                                      Descargar archivo: <span className="font-bold underline">{itemB?.fileName}</span>
                                    </div>
                                  )}
                                </>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4"></div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seComunicaDisciplinado &&
            Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaComunicacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaComunicacionEmail,
            ) && (
              <TabPanel value={value} index={1}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Comunicación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del disciplinado</p>
                        <p className="font-semibold text-secondary">Fecha de comunicación</p>
                        <p className="font-semibold text-secondary">Medio de comunicación</p>
                        <p className="font-semibold text-secondary">Vouchers</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item.name} ${item.primerApellido}`}</p>
                          {item.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de comunicación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                      item.id
                                    ]?.fechaComunicacionEmail,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de comunicación personal
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                      item.id
                                    ]?.fechaComunicacionFisica,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {expedienteSelected?.communicationsAndNotificationsData?.disciplinados[item.id]
                                ?.fechaRecibidoComunicacionFisica && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido comunicación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaRecibidoComunicacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  item.medioAComunicar === 'email'
                                    ? new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaComunicacionEmail,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    : new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaComunicacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                }
                              />
                              {item.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido comunicación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaRecibidoComunicacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item.medioAComunicar === 'email'
                              ? `Correo: ${item.email}`
                              : item.medioAComunicar === 'fisico'
                              ? `Personal: ${item.direccionResidencia}`
                              : `Correo: ${item.email} y Personal: ${item.direccionResidencia}`}
                          </p>
                          {vouchers?.comunicacion?.disciplinados?.length > 0 && (
                            <div className="flex flex-col gap-4">
                              {vouchers?.comunicacion?.disciplinados?.map((itemB, index) => (
                                <>
                                  {item?.id === itemB?.voucherData?.userId && (
                                    <div
                                      className="justify-center p-4 rounded text-white mx-4 cursor-pointer bg-primary"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = itemB?.base64;
                                        link.download = itemB?.fileName;
                                        link.click();
                                      }}
                                    >
                                      Descargar archivo: <span className="font-bold underline">{itemB?.fileName}</span>
                                    </div>
                                  )}
                                </>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4"></div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seComunicaQuejoso &&
            (expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail ||
              expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionFisica) && (
              <TabPanel value={value} index={2}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Comunicación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del quejoso</p>
                        <p className="font-semibold text-secondary">Fecha de comunicación</p>
                        <p className="font-semibold text-secondary">Medio de comunicación</p>
                        <p className="font-semibold text-secondary">Vouchers</p>
                        <p>{expedienteSelected?.requestId?.nombreSolicitante}</p>
                        {expedienteSelected?.requestId?.comunicationChannelSelected === 'anonimo' ? (
                          <div>
                            <label className="block text-xs py-1 text-left text-gray-700">
                              Fecha de comunicación por correo
                            </label>
                            <input
                              type="date"
                              required
                              disabled
                              value={
                                new Date(
                                  expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail,
                                )
                                  .toISOString()
                                  .split('T')[0]
                              }
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                              Fecha de comunicación personal
                            </label>
                            <input
                              type="date"
                              required
                              disabled
                              value={
                                new Date(
                                  expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionFisica,
                                )
                                  .toISOString()
                                  .split('T')[0]
                              }
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            {expedienteSelected?.communicationsAndNotificationsData?.quejoso
                              ?.fechaRecibidoComunicacionFisica && (
                              <>
                                <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                  Fecha recibido comunicación personal
                                </label>
                                <input
                                  type="date"
                                  disabled
                                  value={
                                    new Date(
                                      expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaRecibidoComunicacionFisica,
                                    )
                                      .toISOString()
                                      .split('T')[0]
                                  }
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                />
                              </>
                            )}
                          </div>
                        ) : (
                          <div>
                            <input
                              type="date"
                              required
                              disabled
                              value={
                                expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail
                                  ? new Date(
                                      expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionEmail,
                                    )
                                      .toISOString()
                                      .split('T')[0]
                                  : new Date(
                                      expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaComunicacionFisica,
                                    )
                                      .toISOString()
                                      .split('T')[0]
                              }
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                            {expedienteSelected?.requestId?.comunicationChannelSelected === 'personal' && (
                              <>
                                <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                  Fecha recibido comunicación personal
                                </label>
                                <input
                                  type="date"
                                  disabled
                                  value={
                                    new Date(
                                      expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaRecibidoComunicacionFisica,
                                    )
                                      .toISOString()
                                      .split('T')[0]
                                  }
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                />
                              </>
                            )}
                          </div>
                        )}
                        <p>
                          {expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                            ? `Correo: ${expedienteSelected?.requestId?.correo}`
                            : expedienteSelected?.requestId?.comunicationChannelSelected === 'personal'
                            ? `Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`
                            : `Correo: ${expedienteSelected?.requestId?.correo} y Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`}
                        </p>
                        {vouchers?.comunicacion?.quejoso?.length > 0 && (
                          <div className="flex flex-col gap-4">
                            {vouchers?.comunicacion?.quejoso?.map((item, index) => (
                              <div
                                className="justify-center p-4 rounded text-white mx-4 cursor-pointer bg-primary"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = item?.base64;
                                  link.download = item?.fileName;
                                  link.click();
                                }}
                              >
                                Descargar archivo: <span className="font-bold underline">{item?.fileName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seNotificaApoderado &&
            Object.keys(expedienteSelected?.communicationsAndNotificationsData?.apoderados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaNotificacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.apoderados?.[key]?.fechaNotificacionEmail,
            ) && (
              <TabPanel value={value} index={3}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Notificación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del apoderado</p>
                        <p className="font-semibold text-secondary">Fecha de notificación</p>
                        <p className="font-semibold text-secondary">Medio de notificación</p>
                        <p className="font-semibold text-secondary">Vouchers</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item.lawyer.publicDefenderName}`}</p>
                          {item.lawyer.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de notificación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                      item.lawyer.id
                                    ]?.fechaNotificacionEmail,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                      item.lawyer.id
                                    ]?.fechaNotificacionFisica,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {expedienteSelected?.communicationsAndNotificationsData?.apoderados[item.lawyer.id]
                                ?.fechaRecibidoNotificacionFisica && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido notificación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaRecibidoNotificacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  item.lawyer.medioAComunicar === 'email'
                                    ? new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaNotificacionEmail,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    : new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaNotificacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                }
                              />
                              {item.lawyer.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido notificación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.apoderados[
                                          item.lawyer.id
                                        ]?.fechaRecibidoNotificacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item.lawyer.medioAComunicar === 'email'
                              ? `Correo: ${item.email}`
                              : item.lawyer.medioAComunicar === 'fisico'
                              ? `Personal: ${item.lawyer.direccionResidencia}`
                              : `Correo: ${item.lawyer.email} y Personal: ${item.lawyer.direccionResidencia}`}
                          </p>
                          {vouchers?.notificacion?.apoderado?.length > 0 && (
                            <div className="flex flex-col gap-4">
                              {vouchers?.notificacion?.apoderado?.map((itemB, index) => (
                                <>
                                  {item?.lawyer?.id === itemB?.voucherData?.userId && (
                                    <div
                                      className="justify-center p-4 rounded text-white mx-4 cursor-pointer bg-primary"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = itemB?.base64;
                                        link.download = itemB?.fileName;
                                        link.click();
                                      }}
                                    >
                                      Descargar archivo: <span className="font-bold underline">{itemB?.fileName}</span>
                                    </div>
                                  )}
                                </>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4"></div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seNotificaDisciplinado &&
            Object.keys(expedienteSelected?.communicationsAndNotificationsData?.disciplinados || {}).some(
              (key) =>
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaNotificacionFisica ||
                expedienteSelected?.communicationsAndNotificationsData?.disciplinados?.[key]?.fechaNotificacionEmail,
            ) && (
              <TabPanel value={value} index={4}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Notificación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del disciplinado</p>
                        <p className="font-semibold text-secondary">Fecha de notificación</p>
                        <p className="font-semibold text-secondary">Medio de notificación</p>
                        <p className="font-semibold text-secondary">Vouchers</p>
                      </div>
                    </div>
                    {expedienteSelected.requestId.disciplined.map((item: any) => (
                      <div className="mt-10">
                        <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                          <p>{`${item.name} ${item.primerApellido}`}</p>
                          {item.medioAComunicar === 'ambos' ? (
                            <div>
                              <label className="block text-xs py-1 text-left text-gray-700">
                                Fecha de notificación por correo
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                      item.id
                                    ]?.fechaNotificacionEmail,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                Fecha de notificación personal
                              </label>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  new Date(
                                    expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                      item.id
                                    ]?.fechaNotificacionFisica,
                                  )
                                    .toISOString()
                                    .split('T')[0]
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                              {expedienteSelected?.communicationsAndNotificationsData?.disciplinados[item.id]
                                ?.fechaRecibidoNotificacionFisica && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido notificación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaRecibidoNotificacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          ) : (
                            <div>
                              <input
                                type="date"
                                required
                                disabled
                                value={
                                  item.medioAComunicar === 'email'
                                    ? new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaNotificacionEmail,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    : new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaNotificacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                }
                              />
                              {item.medioAComunicar === 'fisico' && (
                                <>
                                  <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                                    Fecha recibido notificación personal
                                  </label>
                                  <input
                                    type="date"
                                    disabled
                                    value={
                                      new Date(
                                        expedienteSelected?.communicationsAndNotificationsData?.disciplinados[
                                          item.id
                                        ]?.fechaRecibidoNotificacionFisica,
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                  />
                                </>
                              )}
                            </div>
                          )}
                          <p>
                            {item.medioAComunicar === 'email'
                              ? `Correo: ${item.email}`
                              : item.medioAComunicar === 'fisico'
                              ? `Personal: ${item.direccionResidencia}`
                              : `Correo: ${item.email} y Personal: ${item.direccionResidencia}`}
                          </p>
                          {vouchers?.notificacion?.disciplinados?.length > 0 && (
                            <div className="flex flex-col gap-4">
                              {vouchers?.notificacion?.disciplinados?.map((itemB, index) => (
                                <>
                                  {item?.id === itemB?.voucherData?.userId && (
                                    <div
                                      className="justify-center p-4 rounded text-white mx-4 cursor-pointer bg-primary"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = itemB?.base64;
                                        link.download = itemB?.fileName;
                                        link.click();
                                      }}
                                    >
                                      Descargar archivo: <span className="font-bold underline">{itemB?.fileName}</span>
                                    </div>
                                  )}
                                </>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4"></div>
                  </div>
                </div>
              </TabPanel>
            )}
          {expedienteSelected.seNotificaQuejoso &&
            (expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionEmail ||
              expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionFisica) && (
              <TabPanel value={value} index={5}>
                <div className="p-10">
                  <div className="col-span-1">
                    {/* <p className="text-xl font-semibold text-primary">{`Notifiación`}</p> */}
                    <div>
                      <div className="grid grid-cols-4 gap-5 items-center text-center mb-10">
                        <p className="font-semibold text-secondary">Nombre del quejoso</p>
                        <p className="font-semibold text-secondary">Fecha de notificación</p>
                        <p className="font-semibold text-secondary">Medio de notificación</p>
                        <p className="font-semibold text-secondary">Vouchers</p>
                        <p>{expedienteSelected?.requestId?.nombreSolicitante}</p>
                        {expedienteSelected?.requestId?.comunicationChannelSelected === 'anonimo' ? (
                          <div>
                            {expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificaionEmail && (
                              <>
                                <label className="block text-xs py-1 text-left text-gray-700">
                                  Fecha de notificación por correo
                                </label>
                                <input
                                  type="date"
                                  required
                                  disabled
                                  value={
                                    new Date(
                                      expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificaionEmail,
                                    )
                                      .toISOString()
                                      .split('T')[0]
                                  }
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                />
                              </>
                            )}
                            <label className="block text-xs py-1 text-left mt-2 text-gray-700">
                              Fecha de notificación personal
                            </label>
                            <input
                              type="date"
                              disabled
                              value={
                                new Date(
                                  expedienteSelected?.communicationsAndNotificationsData?.quejoso?.fechaNotificacionFisica,
                                )
                                  .toISOString()
                                  .split('T')[0]
                              }
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="date"
                              required
                              disabled
                              value={
                                expedienteSelected?.requestId?.comunicationChannelSelected === 'email'
                                  ? expedienteSelected?.communicationsAndNotificationsData?.quejoso
                                      ?.fechaNotificacionEmail
                                  : expedienteSelected?.communicationsAndNotificationsData?.quejoso
                                      ?.fechaNotificacionFisica
                              }
                            />
                          </div>
                        )}
                        <p>
                          {expedienteSelected?.requestId?.comunicationChannelSelected === 'informante'
                            ? `Correo: ${expedienteSelected?.requestId?.correo}`
                            : expedienteSelected?.requestId?.comunicationChannelSelected === 'personal'
                            ? `Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`
                            : `Correo: ${expedienteSelected?.requestId?.correo} y Personal: ${expedienteSelected?.requestId?.direccionCorrespondencia}`}
                        </p>
                      </div>
                      {vouchers?.notificacion?.quejoso?.length > 0 && (
                        <>
                          {vouchers?.notificacion?.quejoso?.map((item, index) => (
                            <div
                              className="justify-center p-4 rounded text-white mx-4 cursor-pointer bg-primary"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = item?.base64;
                                link.download = item?.fileName;
                                link.click();
                              }}
                            >
                              Descargar archivo: <span className="font-bold underline">{item?.fileName}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}
        </div>
      )}
    </>
  );
};
