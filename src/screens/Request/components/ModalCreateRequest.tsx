import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';

//Helpers API
import Swal from 'sweetalert2';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import adjuntoMock from '../../../mocks/adjuntoMock.json';
import { FormLabel, Paper, Step, StepLabel, Stepper } from '@mui/material';
import obsmock from '../../../mocks/observations.mock.json';
import { UploadFileComponent } from './UploadFileComponent';
import moment from 'moment';
import 'moment/locale/es';
import { getAllProcessState, createRequest, updateRequest, getAllPublicDefenders } from '../../../services';
import { DocumentToEdit, ModalRecepcionRecurso, ModalComment, ModalViewer } from '../components';

import { StateBadge } from '../../../components';

import { useSelector } from 'react-redux';
import { AUTH } from '../../../models';

import { DocumentsTable } from './../Etapa_Instruccion/Components/DocumentsTable';

import {
  AutoArchivoInvestigacionDisciplinaria,
  AutoInicioIndagacionPrevia,
  InicioInvestigacionDisciplinaria,
  RealizarAutoInhibitorio,
  RecepcionarSolicitud,
  NoRecursoApelacion,
  SiProcedeRecursoApelacion,
  NoContinuaInvestigacion,
  SiConfesar,
  NoApoderado,
  SiApoderado,
  NoProcedeConfesion,
  SiArchivarInvestigacionDisciplinaria,
  SiUtilizaRecursoApelacion,
} from '../Etapa_Instruccion/Components/';
import { SiRecursoApelacion } from '../Etapa_Instruccion/Components/SiRecursoApelacion';
import { SiContinuaInvestigacion } from '../Etapa_Instruccion/Components/SiContinuaInvestigacion';
import index from '../../../mocks/mocksDocuments';
import { CrearComunicacion } from './CrearComunicacion';
import { createFolio, getFolio } from '../../../services/folios.service';
import { getAllStates } from '../../../services/fechasVenc.service';
import { getStagesWithStates } from '../../../services/stages.service';
import { ModalPruebas } from './modals/ModalPruebas';

const _ = require('lodash');

export const ModalCreateRequest = ({
  openModal,
  setOpenModal,
  setRequestSaved,
  requestSaved,
  requestSelected,
  setRequestSelected,
  typeOfCRUDAction,
  rolesByCode,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  moment.locale('es');
  const [applicantType, setApplicantType] = useState<any>(null);
  const [subject, setSubject] = useState('');
  // Radios Buttons

  const [loadingFolio, setLoadingFolio] = useState(false);
  const [decisionSegundaInstanciaOtros, setDecisionSegundaInstanciaOtros] = useState('');
  const [openModalViewer, setOpenModalViewer] = useState(false);
  const [sourceAssets, setSourceAssets] = useState<any>(null);
  const [dataFolio, setDataFolio] = useState<any>(null);

  const [authorIdentified, setAuthorIdentified] = useState('default');
  const [indagacionPrevia, setIndagacionPrevia] = useState('default');
  const [recursoApelacion, setRecursoApelacion] = useState('default');
  const [procedeRecursoApelacion, setProcedeRecursoApelacion] = useState('default');
  const [recursoApelacionJuzgamiento, setRecursoApelacionJuzgamiento] = useState('default');
  const [procedeRecursoApelacionJuzgamiento, setProcedeRecursoApelacionJuzgamiento] = useState('default');
  const [etapa, setEtapa] = useState('0b666497-d1d0-42e7-bba1-eeaf6a2aa352'); //Default Reparto
  const [statee, setStatee] = useState('0b666497-d1d0-42e7-bba1-eeaf6a2aa352'); //Default Reparto
  const [decisionSegundaInstancia, setDecisionSegundaInstancia] = useState('');
  const [confesar, setConfesar] = useState('default');
  const [tieneApoderado, setTieneApoderado] = useState('default');
  const [apoderadoSelected, setApoderadoSelected] = useState<any>(null);
  const [procedeConfesion, setProcedeConfesion] = useState('default');
  const [aprobacionConfesion, setAprobacionConfesion] = useState('default');
  const [decisionEvaluacion, setDecisionEvaluacion] = useState('default');
  const [notificoEnFormaPersonal, setNotificoEnFormaPersonal] = useState('default');
  const [aceptaCargos, setAceptaCargos] = useState('default');
  const [suspendida] = useState('default');

  const [causaSuspension, setCausaSuspension] = useState('');
  const [entregaCopia, setEntregaCopia] = useState('default');
  const [medioJuzgamiento, setMedioJuzgamiento] = useState('default');
  const [apelaFallo, setApelaFallo] = useState('default');
  const [hayNulidad, setHayNulidad] = useState('default');
  const [apruebaPruebasCompletas, setApruebaPruebasCompletas] = useState('default');
  const [presentaRecursoApelacionAutoDecisionPruebas, setPresentaRecursoApelacionAutoDecisionPruebas] =
    useState('default');
  const [concedeRecurso, setConcedeRecurso] = useState('default');

  const [disciplanaryInvestigation, setDisciplanaryInvestigation] = useState('default');
  const [continueInvestigation, setContinueInvestigation] = useState('default');
  const [continueInvestigationJuzgamiento, setContinueInvestigationJuzgamiento] = useState('default');

  const [archiveDisciplanaryInvestigation, setArchiveDisciplanaryInvestigation] = useState('default');

  const [modalInhibitorio, setModalInhibitorio] = useState(false);
  const [modalRecursoApelacion, setModalRecursoApelacion] = useState(false);
  const [decisionEvaluacionArchivar, setDecisionEvaluacionArchivar] = useState('default');

  //Process state
  const [processState, setProcessState] = useState<any>(null);
  const [publicDefenders, setPublicDefenders] = useState<any>(null);

  const [state /* setState */] = useState('true');

  const [docFiles, setDocFiles] = useState<any>([]);
  const [disciplined, setDisciplined] = useState<any>([]);

  const [openModalDocsViewer, setOpenModalDocsViewer] = useState(false);
  const [openModalPruebas, setOpenModalPruebas] = useState(false);

  const userLogged = useSelector(({ auth }: { auth: AUTH }) => auth.data?.user?.userRole?.id);
  const userId = useSelector(({ auth }: { auth: AUTH }) => auth.data?.user?.id);
  const [documentAproved2, setDocumentAproved2] = useState(false);
  const [documentAproved3, setDocumentAproved3] = useState(false);
  const [documentAproved4, setDocumentAproved4] = useState(false);

  const [documentAproved6, setDocumentAproved6] = useState(false);

  const [typeOfDocumentToEdit, setTypeOfDocumentToEdit] = useState('');

  const [openModalComment, setOpenModalComment] = useState(false);
  const [requestObservations, setRequestObservations] = useState([]);
  const [requestObservationsUser, setRequestObservationsUser] = useState([]);
  const [requestObservationsSystem, setRequestObservationsSystem] = useState([]);
  const [steps, setSteps] = useState<any>([]);

  //
  const [documentAproved, setDocumentAproved] = useState({
    isAllDocumentsAutoInicioIndagacionPreviaAproved: false,
    isAllDocumentosInicioInvestigacionDisciplinariaAproved: false,
    isAllDocumentsAutoArchivoInicioIndagacionPreviaAproved: false,
    isAllDocumentsConfesarSiApproved: false,
    isAllDocumentsNoApoderadoApproved: false,
    isAllDocumentsSiApoderadoApproved: false,
    isAllDocumentsNoProcedeConfesionApproved: false,
  });

  const [documentsAutoInicioIndagacionPreviaAproved, setDocumentsAutoInicioIndagacionPreviaAproved] = useState(false);
  const [documentsInicioInvestigacionDisciplinariaAproved, setDocumentsInicioInvestigacionDisciplinariaAproved] =
    useState(false);
  const [documentsAutoArchivoInicioIndagacionPreviaAproved, setDocumentsAutoArchivoInicioIndagacionPreviaAproved] =
    useState(false);
  const [documentsConfesarSiApproved, setDocumentsConfesarSiApproved] = useState(false);
  const [documentsNoApoderadoApproved, setDocumentsNoApoderadoApproved] = useState(false);
  const [documentsSiApoderadoApproved, setDocumentsSiApoderadoApproved] = useState(true);
  const [documentsNoProcedeConfesionApproved, setDocumentsNoProcedeConfesionApproved] = useState(false);
  const [
    documentsAutoArchivoInvestigacionDisciplinariaApproved,
    setDocumentsAutoArchivoInvestigacionDisciplinariaApproved,
  ] = useState(false);
  const [states, setStates] = useState<any>([]);
  const [stagesWithStates, setStagesWithStates] = useState<any>([]);

  const [statesFiltered, setStatesFiltered] = useState<any>([]);
  const [stagesFiltered, setStagesFiltered] = useState<any>([]);
  const [stateSelected, setStateSelected] = useState<any>(null);
  const [stageSelected, setStageSelected] = useState<any>(null);
  const [fases, setFases] = useState<any>([]);
  const [faseSelected, setFaseSelected] = useState<any>(null);
  const [regresaSegundaInstancia, setRegresaSegundaInstancia] = useState(false);
  const [citacionAudiencia, setCitacionAudiencia] = useState(false);
  const [pruebasRequest, setPruebasRequest] = useState<any>([]);

  const [recepcionarSolicitudData, setRecepcionarSolicitudData] = useState({
    radicado: '',
    expediente: '',
    nombreSolicitante: '',
    medioComunicar: '',
    direccionCorrespondencia: '',
    telefono: '',
    tipoDocumental: '',
    calidadSolicitante: 'default',
    nombreFuncionario: '',
    dependecia: '',
    cargo: '',
    describieronHechos: '',
    correo: '',
    profesionalAsignado: '',
    asunto: '',
    disciplined: '',
    cedulaSolicitante: '',
  });

  const etapas = {
    archivo: '0765f69d-3d00-4524-ba2c-5c1ff4cb2b43',
    juzgamiento: '49a930e9-a860-42ae-a396-3b6a42e883e6',
    enReparto: '0b666497-d1d0-42e7-bba1-eeaf6a2aa352',
    indagacionPrevia: 'a6a43712-6179-48c7-88d2-60ca0a9eecb4',
    inhibitorio: '162df408-d7d7-4e2f-8f0d-926dae5fa071',
    segundaInstancia: '48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7',
    investigacionFormalDisciplinaria: '55f8582f-2240-470a-83e2-c6739f0aca20',
    cierreDeInvestigacionYAlegatos: '8d657c44-33a5-4f78-bda0-3eeda12e10ee',
    archivoYTerminacion: '4151015f-97da-43d7-96cd-2f4b7ae0fdef',
    fallo: '7bd41b74-8228-4472-9f19-9413f0792cfa',
    ejecucionDeLaSancion: '17cb42e6-0b5d-45fe-bdf0-761939ddd63f',
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
    callEndpoint(getFolio(requestSelected?.id)).then((res: any) => {
      setDataFolio(res?.data);
      setSourceAssets({ source: res?.data?.base64, fileType: res?.data?.fileType });
    });
    setEtapa(requestSelected ? requestSelected.etapa : '0b666497-d1d0-42e7-bba1-eeaf6a2aa352');
    setStatee(requestSelected ? requestSelected.requestState.id : 1);

    setRecepcionarSolicitudData({
      ...recepcionarSolicitudData,
      radicado: requestSelected ? requestSelected.radicado : '',
      expediente: requestSelected ? requestSelected.expediente : '',
      nombreSolicitante: requestSelected ? requestSelected.nombreSolicitante : '',
      medioComunicar: requestSelected ? requestSelected.comunicationChannelSelected : '',
      direccionCorrespondencia: requestSelected ? requestSelected.direccionCorrespondencia : '',
      telefono: requestSelected ? requestSelected.telefono : '',
      tipoDocumental: requestSelected ? requestSelected.documentalTypeSelected : '',
      calidadSolicitante: requestSelected ? requestSelected.calidadSolicitante : 'default',
      nombreFuncionario: requestSelected ? requestSelected.nombreFuncionario : '',
      dependecia: requestSelected ? requestSelected.dependecia : '',
      cargo: requestSelected ? requestSelected.positionSelected : '',
      describieronHechos: requestSelected ? requestSelected.systemState : '',
      correo: requestSelected ? requestSelected.correo : '',
      profesionalAsignado: requestSelected ? requestSelected?.agentSelected?.id : '',
      asunto: requestSelected ? requestSelected.subject : '',
      disciplined: requestSelected ? requestSelected.disciplined : '',
      complianceFacts: requestSelected ? requestSelected.complianceFacts : null,
      proceedingsNumbers: requestSelected ? requestSelected.proceedingsNumbers : null,
      enabled: requestSelected ? (requestSelected?.enabled ? true : false) : true,
      ...requestSelected,
    });

    setApplicantType(requestSelected ? requestSelected.name : '');
    setSubject(requestSelected ? requestSelected.subject : '');
    setAuthorIdentified(requestSelected ? requestSelected.authorIdentified : '');
    setIndagacionPrevia(requestSelected ? requestSelected.indagacionPrevia : '');
    setDisciplanaryInvestigation(requestSelected ? requestSelected.disciplanaryInvestigation : '');
    setRecursoApelacion(requestSelected ? requestSelected.recursoApelacion : '');
    setProcedeRecursoApelacion(requestSelected ? requestSelected.procedeRecursoApelacion : '');
    setDecisionEvaluacion(requestSelected ? requestSelected.decisionEvaluacion : '');
    setContinueInvestigation(requestSelected ? requestSelected.continueInvestigation : '');
    setDecisionSegundaInstancia(
      requestSelected ? (requestSelected.decisionSegundaInstancia === 'true' ? true : false) : '',
    );
    setDecisionSegundaInstanciaOtros(
      requestSelected ? (requestSelected.decisionSegundaInstanciaOtros === 'true' ? true : false) : '',
    );
    setConfesar(requestSelected ? requestSelected.confesar : '');
    setTieneApoderado(requestSelected ? requestSelected.tieneApoderado : '');
    setProcedeConfesion(requestSelected ? requestSelected.procedeConfesion : '');
    setMedioJuzgamiento(requestSelected ? requestSelected.medioJuzgamiento : '');
    setAceptaCargos(requestSelected ? requestSelected.aceptaCargos : '');
    setApruebaPruebasCompletas(requestSelected ? requestSelected.apruebaPruebasCompletas : '');
    setApelaFallo(requestSelected ? requestSelected.apelaFallo : '');
    setPresentaRecursoApelacionAutoDecisionPruebas(
      requestSelected ? requestSelected.presentaRecursoApelacionAutoDecisionPruebas : '',
    );
    setConcedeRecurso(requestSelected ? requestSelected.concedeRecurso : '');
    setHayNulidad(requestSelected ? requestSelected.hayNulidad : '');
    setArchiveDisciplanaryInvestigation(requestSelected ? requestSelected.archiveDisciplanaryInvestigation : '');
    setRecursoApelacionJuzgamiento(requestSelected ? requestSelected.recursoApelacionJuzgamiento : '');
    setProcedeRecursoApelacionJuzgamiento(requestSelected ? requestSelected.procedeRecursoApelacionJuzgamiento : '');
    setContinueInvestigationJuzgamiento(requestSelected ? requestSelected.continueInvestigationJuzgamiento : '');
    setStateSelected(requestSelected ? requestSelected.requestState.id : '');
    setCitacionAudiencia(
      requestSelected
        ? new Date(requestSelected.fechaAudiencia).toISOString().split('T')[0] +
            'T' +
            new Date(requestSelected.fechaAudiencia).toISOString().split('T')[1].split('.')[0]
        : null,
    );

    let observationUser: any[] = [];
    let observationSystem: any[] = [];
    requestSelected?.requestObservations?.forEach((observation: any) => {
      if (observation?.observationType === 'user') {
        observationUser.push(observation);
      } else {
        observationSystem.push(observation);
      }
    });
    observationUser = observationUser.sort(
      (a, b) =>
        new Date(moment(b.createdAt).format('YYYY-MM-DD HH:mm:ss')) -
        new Date(moment(a.createdAt).format('YYYY-MM-DD HH:mm:ss')),
    );
    observationSystem = observationSystem.sort(
      (a, b) =>
        new Date(moment(b.createdAt).format('YYYY-MM-DD HH:mm:ss')) -
        new Date(moment(a.createdAt).format('YYYY-MM-DD HH:mm:ss')),
    );
    setRequestObservationsUser(observationUser as never[]);
    setRequestObservationsSystem(observationSystem as never[]);

    if (requestSelected?.requestStages.length > 0) {
      setSteps(requestSelected?.requestStages);
    } else {
      setSteps([
        {
          id: '1',
          stageName: 'En reparto',
        },
      ]);
    }

    if (typeOfCRUDAction === 'edit') {
      setDocFiles(requestSelected?.attachments);
    }

    getProcessStates();
    getPublicDefendersList();
    getStates();
    getStagesWithStatess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const handleModalRecursoApelacion = () => {
    setModalRecursoApelacion(true);
  };

  const handleIndagacionPrevia = (value: any) => {
    setIndagacionPrevia(value);
    if (value === 'default') {
      //En Reparto
      setEtapa('0b666497-d1d0-42e7-bba1-eeaf6a2aa352');
    } else {
      if (authorIdentified === 'no' && value === 'no') {
        setEtapa('162df408-d7d7-4e2f-8f0d-926dae5fa071');
      } else {
        setEtapa('a6a43712-6179-48c7-88d2-60ca0a9eecb4');
      }
    }
  };

  const generateAutoInhibitorio = () => {
    setModalInhibitorio(true);
  };
  const handledOpenModalComment = () => {
    setOpenModalComment(true);
  };

  console.log('pruebasRequest', pruebasRequest);

  const handleSubmit = async () => {
    if (!recepcionarSolicitudData.medioComunicar || recepcionarSolicitudData.medioComunicar === 'default') {
      showToast('warning', 'Por favor, revise la información suministrada', 'Complete todos los campos');
      return;
    }
    if (recepcionarSolicitudData.medioComunicar === 'informante' && !recepcionarSolicitudData.correo) {
      showToast('warning', 'Por favor, revise la información suministrada', 'Complete todos los campos');
      return;
    }
    if (
      recepcionarSolicitudData.medioComunicar === 'anonimo' &&
      !recepcionarSolicitudData.correo &&
      !recepcionarSolicitudData.direccionCorrespondencia
    ) {
      showToast('warning', 'Por favor, revise la información suministrada', 'Complete todos los campos');
      return;
    }
    if (recepcionarSolicitudData.medioComunicar === 'personal' && !recepcionarSolicitudData.direccionCorrespondencia) {
      showToast('warning', 'Por favor, revise la información suministrada', 'Complete todos los campos');
      return;
    }
    if (!recepcionarSolicitudData.cedulaSolicitante || recepcionarSolicitudData.cedulaSolicitante === '') {
      showToast('warning', 'Por favor, revise la información suministrada', 'Complete todos los campos');
      return;
    }
    const body: any = {
      userAgentSelected: recepcionarSolicitudData?.profesionalAsignado?.toString(),
      radicado: recepcionarSolicitudData.radicado,
      expediente: recepcionarSolicitudData.expediente,
      nombreSolicitante: recepcionarSolicitudData.nombreSolicitante,
      calidadSolicitante: recepcionarSolicitudData.calidadSolicitante,
      etapa,
      documentalTypeSelected: recepcionarSolicitudData.tipoDocumental,
      comunicationChannelSelected: recepcionarSolicitudData.medioComunicar,
      direccionCorrespondencia: recepcionarSolicitudData.direccionCorrespondencia,
      correo: recepcionarSolicitudData.correo,
      telefono: recepcionarSolicitudData.telefono,
      nombreFuncionario: recepcionarSolicitudData.nombreFuncionario,
      dependecia: recepcionarSolicitudData.dependecia,
      positionSelected: recepcionarSolicitudData.cargo,
      systemState: recepcionarSolicitudData.describieronHechos,
      applicantType,
      authorIdentified,
      indagacionPrevia,
      disciplanaryInvestigation,
      recursoApelacion,
      procedeRecursoApelacion,
      decisionEvaluacion,
      continueInvestigation,
      decisionSegundaInstancia,
      decisionSegundaInstanciaOtros,
      confesar,
      tieneApoderado,
      procedeConfesion,
      medioJuzgamiento,
      aceptaCargos,
      apruebaPruebasCompletas,
      apelaFallo,
      presentaRecursoApelacionAutoDecisionPruebas,
      concedeRecurso,
      hayNulidad,
      archiveDisciplanaryInvestigation,
      recursoApelacionJuzgamiento,
      procedeRecursoApelacionJuzgamiento,
      continueInvestigationJuzgamiento,
      aprobacionConfesion,
      publicDefenders,
      requestObservations: [
        {
          content: requestObservations,
        },
      ],
      requestStateId: Number(statee),
      userId,
      attachments: docFiles,
      subject: recepcionarSolicitudData.asunto,
      disciplined,
      complianceFacts: recepcionarSolicitudData.complianceFacts,
      enabled: recepcionarSolicitudData.enabled,
      cedulaSolicitante: recepcionarSolicitudData.cedulaSolicitante,
      lawyerId: apoderadoSelected,
      fechaAudiencia: citacionAudiencia,
      pruebas: pruebasRequest,
    };

    try {
      if (typeOfCRUDAction === 'create') {
        const response = await callEndpoint(createRequest(body));
        if (response.success) {
          setOpenModal(false);
          setRequestSaved(!requestSaved);
          showToast('success', '¡Solicitud registrada con éxito!', '');
        } else {
          showToast('warning', 'Por favor, revise la información suministrada', response.message);
        }
      } else if (typeOfCRUDAction === 'edit') {
        const response = await callEndpoint(updateRequest(requestSelected, body));
        if (response.success) {
          showToast('success', '¡Solicitud actualizada con éxito!', '');
          setOpenModal(false);
          //Reload list with new dataSource
          setRequestSaved(!requestSaved);
        } else {
          showToast('warning', 'Please, check your information', response.message);
        }
        setOpenModal(false);
        setRequestSaved(!requestSaved);
      } else {
        showToast('warning', 'Please, check your information', 'You must register a valid email address');
      }
    } catch (error) {
      showToast('error', 'Please, contact with support department', 'An error occurred doing the request.');
    }
  };

  const getProcessStates = async () => {
    try {
      const response = await callEndpoint(getAllProcessState());
      response?.success &&
        setProcessState(response.data.filter((row: any) => row.processStateState?.toString().includes(state)));
    } catch (error) {
      showToast('error', 'Ocurrio un error cargando la información', 'Contacte a soporte técnico');
    }
  };

  const getPublicDefendersList = async () => {
    try {
      // setIsLoading(true);
      const response = await callEndpoint(getAllPublicDefenders());
      response?.success &&
        setPublicDefenders(response.data.filter((row: any) => row.publicDefenderState?.toString().includes(state)));
      // setIsLoading(false);
    } catch (error) {
      showToast('error', 'Ocurrió un error cargando la consulta', 'Contacte a soporte técnico');
      // setIsLoading(false);
    }
  };

  const getStates = async () => {
    try {
      const response = await callEndpoint(getAllStates());
      response?.success && setStates(response.data);
    } catch (error) {
      showToast('error', 'Ocurrio un error cargando la información', 'Contacte a soporte técnico');
    }
  };

  const getStagesWithStatess = async () => {
    try {
      const response = await callEndpoint(getStagesWithStates());
      if (response?.success) {
        Object.values(response.data).forEach((fase: any) => {
          let states: any[] = [];
          fase.forEach((stage: any) => {
            if (stage.stageName === requestSelected?.requestState?.stageName) {
              states = stage;
              setStageSelected(stage.id);
              setStatesFiltered(states);
            }
            return null;
          });
        });
        if (requestSelected?.requestState) {
          setStagesFiltered(
            response.data[requestSelected?.requestState?.faseName === 'Instrucción' ? 'instruccion' : 'juzgamiento'],
          );
          setFaseSelected(requestSelected?.requestState?.faseName === 'Instrucción' ? 'instruccion' : 'juzgamiento');
          setStagesWithStates(response.data);
        } else {
          setStagesFiltered(response.data.instruccion);
          setStageSelected(response.data.instruccion.find((row: any) => row.stageName === 'Reparto').id);
          setStatesFiltered(response.data.instruccion.find((row: any) => row.stageName === 'Reparto').states);
          console.log(
            'response.data.instruccion.find((row: any) => row.stageName === Reparto).states',
            response.data.instruccion.find((row: any) => row.stageName === 'Reparto').states,
          );
          setFaseSelected('instruccion');
          setStagesWithStates(response.data);
          setStatee(response.data.instruccion.find((row: any) => row.stageName === 'Reparto').states[0].id);

          console.log(
            'response.data.instruccion.find((row: any) => row.stageName === Reparto).states[0].id',
            response.data.instruccion.find((row: any) => row.stageName === 'Reparto').states[0].id,
          );
        }
      }
    } catch (error) {
      showToast('error', 'Ocurrio un error cargando la información', 'Contacte a soporte técnico');
    }
  };

  // ModalProps={{ onBackdropClick: openModal }}

  const filterStages = (e: any) => {
    const stagesFiltered = stagesWithStates[e.target.value];
    console.log('stagesFiltered', stagesWithStates)
    setStagesFiltered(stagesFiltered);
    setStageSelected(null);
    setStateSelected(null);
  };

  const filterStates = (e: any) => {
    const statesFiltered = stagesFiltered[e.target.value - 1];
    setStatesFiltered(statesFiltered);
    setStateSelected(null);
  };

  console.log('requestSelected', archiveDisciplanaryInvestigation);
  return (
    <div>
      <Drawer
        className="w-screen request-window"
        anchor="top"
        open={openModal}
        variant="temporary"
        onClose={() => setOpenModal(true)}
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8  p-5 relative test">
          {/*  Form Inputs   */}
          <div className="overflow-x-scroll flex justify-center">
            <Stepper style={{ minWidth: '100%' }} activeStep={steps.length}>
              {steps.map((label: any, index: number) => (
                <Step key={label.id}>
                  <StepLabel>{label.stageName}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <div className="flex w-full sticky top-0 z-index-99 bg-white justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-primary">Peticiones</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Formato de petición y/o solicitud.</p>
            </div>

            {/* Etapa */}
            <div className="space-y-6 sm:space-y-5">
              <div className=" flex xs:col-span-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Fase</label>
                  <select
                    id="processState"
                    name="processState"
                    autoComplete="processState"
                    value={faseSelected}
                    disabled={
                      userLogged !== rolesByCode.secretariaComunInstruccion &&
                      userLogged !== rolesByCode.directorInstruccion &&
                      userLogged !== rolesByCode.secretariaComunJuzgamiento &&
                      userLogged !== rolesByCode.directorJuzgamiento &&
                      userLogged !== rolesByCode.profesionalJuzgamiento
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    onChange={(e) => {
                      filterStages(e);
                      setFaseSelected(e.target.value);
                    }}
                  >
                    <option value={null}>Seleccione una fase</option>
                    {Object.keys(stagesWithStates).map((key: any) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Etapa</label>
                  <select
                    id="processState"
                    name="processState"
                    autoComplete="processState"
                    value={stageSelected}
                    disabled={
                      userLogged !== rolesByCode.secretariaComunInstruccion &&
                      userLogged !== rolesByCode.directorInstruccion &&
                      userLogged !== rolesByCode.secretariaComunJuzgamiento &&
                      userLogged !== rolesByCode.directorJuzgamiento &&
                      userLogged !== rolesByCode.profesionalJuzgamiento
                    }
                    onChange={(e) => {
                      filterStates(e);
                      setStageSelected(e.target.value);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value={null}>Seleccione una etapa</option>
                    {stagesFiltered?.map((stage: any) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.stageName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Estado</label>
                  <select
                    disabled={
                      userLogged !== rolesByCode.secretariaComunInstruccion &&
                      userLogged !== rolesByCode.directorInstruccion &&
                      userLogged !== rolesByCode.secretariaComunJuzgamiento &&
                      userLogged !== rolesByCode.directorJuzgamiento &&
                      userLogged !== rolesByCode.profesionalJuzgamiento
                    }
                    id="processState"
                    name="processState"
                    autoComplete="processState"
                    value={statee}
                    onChange={(e): any => setStatee(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value={null}>Seleccione un estado</option>
                    {statesFiltered?.states?.map((state: any) => (
                      <option key={state?.id} value={state?.id}>
                        {state?.stateName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Estado</label>
                  <select
                    id="enabled"
                    name="enabled"
                    autoComplete="enabled"
                    value={recepcionarSolicitudData?.enabled}
                    onChange={(e): any =>
                      setRecepcionarSolicitudData({ ...recepcionarSolicitudData, enabled: Boolean(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8 sm:space-y-5 relative">
            <h4 className="text-sm leading-6 font-medium text-primary">Detalle Solicitud</h4>
            <hr />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <RecepcionarSolicitud
                setRequestSelected={setRequestSelected}
                setDocFiles={setDocFiles}
                docFiles={docFiles}
                requestHeader={requestSelected?.id}
                setDisciplined={setDisciplined}
                recepcionarSolicitudData={recepcionarSolicitudData}
                setRecepcionarSolicitudData={setRecepcionarSolicitudData}
                roles={rolesByCode}
                currentUser={userLogged?.toString()}
                showToast={showToast}
                typeOfCRUDAction={typeOfCRUDAction}
              />
            </div>

            {userLogged?.toString() !== rolesByCode.ventanillaUnica && (
              <>
                <h4 className="text-sm leading-6 font-medium text-primary pb-0">Gestión de solicitud</h4>
                <hr className="pt-0 mt-0 m-0" style={{ marginTop: 0 }} />
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-0">
                  {/* ¿Se tiene identificado el presunto autor de la falta disciplinaria? */}
                  <div
                    className="space-y-6 sm:space-y-5"
                    hidden={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                    style={{
                      display: userLogged?.toString() === rolesByCode.secretariaComunInstruccion ? 'none' : 'block',
                    }}
                  >
                    <div className="xs:col-span-3">
                      <label className="block text-xs font-medium text-gray-700">
                        ¿Se tiene identificado el presunto autor de la falta disciplinaria?
                      </label>
                      <select
                        id="userAgent"
                        name="documentalType"
                        autoComplete="documentalType"
                        disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                        // disabled={!(userLogged?.toString() === rolesByCode.profesionalInstruccion)}
                        value={`${authorIdentified}`}
                        onChange={(e): any => setAuthorIdentified(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      >
                        <option value="default">- Seleccione -</option>
                        <option value="yes">Si</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  {/* ¿Se inicia la indagación previa? */}
                  {authorIdentified === 'no' && (
                    <div
                      className="space-y-6 sm:space-y-5"
                      hidden={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                      style={{
                        display: userLogged?.toString() === rolesByCode.secretariaComunInstruccion ? 'none' : 'block',
                      }}
                    >
                      <div className="xs:col-span-3">
                        <label className="block text-xs font-medium text-gray-700">
                          ¿Se inicia la indagación previa?
                        </label>
                        <select
                          id="userAgent"
                          name="documentalType"
                          autoComplete="documentalType"
                          disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                          value={`${indagacionPrevia}`}
                          onChange={(e): any => handleIndagacionPrevia(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        >
                          <option value="default">- Seleccione -</option>
                          <option value="yes">Si</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {authorIdentified === 'no' && indagacionPrevia === 'no' && (
                    <DocumentsTable
                      documentAproved={null}
                      setDocumentAproved={null}
                      roles={rolesByCode}
                      currentUser={userLogged?.toString()}
                      requestSelected={requestSelected}
                      recepcionarSolicitudData={recepcionarSolicitudData}
                      stage={4}
                      initialDocuments={index.autoInhibitorio}
                      comparationState={'Aceptado'}
                      rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                    />
                  )}

                  {authorIdentified === 'no' && indagacionPrevia === 'yes' && (
                    <DocumentsTable
                      //!xd
                      documentAproved={documentsAutoInicioIndagacionPreviaAproved}
                      setDocumentAproved={setDocumentsAutoInicioIndagacionPreviaAproved}
                      roles={rolesByCode}
                      currentUser={userLogged?.toString()}
                      requestSelected={requestSelected}
                      recepcionarSolicitudData={recepcionarSolicitudData}
                      stage={[8, 11]}
                      initialDocuments={index.autoInicioIndagacionPrevia}
                      comparationState={'Aceptado'}
                      rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                    />
                  )}

                  {(documentsAutoInicioIndagacionPreviaAproved || authorIdentified === 'yes') && (
                    <>
                      {/* ¿Se ordena investigación disciplinaria? */}
                      <div
                        className="space-y-6 sm:space-y-5"
                        hidden={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                        style={{
                          display: userLogged?.toString() === rolesByCode.secretariaComunInstruccion ? 'none' : 'block',
                        }}
                      >
                        <div className="xs:col-span-3">
                          <label className="block text-xs font-medium text-gray-700">
                            ¿Se ordena investigación disciplinaria?
                          </label>
                          <select
                            id="disciplanaryInvestigation"
                            name="disciplanaryInvestigation"
                            autoComplete="disciplanaryInvestigation"
                            value={`${disciplanaryInvestigation}`}
                            disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                            onChange={(e): any => {
                              setDisciplanaryInvestigation(e.target.value);

                              if (e.target.value === 'no') {
                                //Archivo
                                setEtapa(etapas.archivo);
                              }
                              if (e.target.value === 'yes') {
                                //Cierre de investigaci ón y alegatos precalificatorios
                                setEtapa(etapas.cierreDeInvestigacionYAlegatos);
                              }
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          >
                            <option value="default">- Seleccione -</option>
                            <option value="yes">Si</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>

                      {disciplanaryInvestigation === 'yes' && (
                        <>
                          <DocumentsTable
                            documentAproved={documentsInicioInvestigacionDisciplinariaAproved}
                            setDocumentAproved={setDocumentsInicioInvestigacionDisciplinariaAproved}
                            roles={rolesByCode}
                            currentUser={userLogged?.toString()}
                            requestSelected={requestSelected}
                            recepcionarSolicitudData={recepcionarSolicitudData}
                            stage={19}
                            initialDocuments={index.inicioInvestigacionDisciplinaria}
                            comparationState={'Aceptado'}
                            rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                          />
                          <DocumentsTable
                            documentAproved={documentsInicioInvestigacionDisciplinariaAproved}
                            setDocumentAproved={setDocumentsInicioInvestigacionDisciplinariaAproved}
                            roles={rolesByCode}
                            currentUser={userLogged?.toString()}
                            requestSelected={requestSelected}
                            recepcionarSolicitudData={recepcionarSolicitudData}
                            stage={21}
                            initialDocuments={index.inicioInvestigacionDisciplinaria}
                            comparationState={'Completado'}
                            rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                          />
                        </>
                      )}
                      {disciplanaryInvestigation === 'no' && (
                        <DocumentsTable //! revisar
                          documentAproved={documentsAutoArchivoInicioIndagacionPreviaAproved}
                          setDocumentAproved={setDocumentsAutoArchivoInicioIndagacionPreviaAproved}
                          roles={rolesByCode}
                          currentUser={userLogged?.toString()}
                          requestSelected={requestSelected}
                          recepcionarSolicitudData={recepcionarSolicitudData}
                          stage={14}
                          initialDocuments={index.autoArchivoInvestigacionDisciplinaria}
                          comparationState={'Aceptado'}
                          rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                        />
                      )}
                      {disciplanaryInvestigation === 'no' && documentsAutoArchivoInicioIndagacionPreviaAproved ? (
                        <>
                          {/* Bloque de ¿Se tiene identificado el presunto autor de la falta disciplinaria? */}
                          {/* {authorIdentified === 'yes' && ( */}
                          <>
                            {/* ¿Utiliza el recurso de apelación? */}
                            {userLogged?.toString() === rolesByCode.secretariaComunInstruccion && (
                              <div className="space-y-6 sm:space-y-5 col-start-1">
                                <div className="xs:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">
                                    ¿Utiliza el recurso de apelación?
                                  </label>
                                  <select
                                    id="userAgent"
                                    name="documentalType"
                                    autoComplete="documentalType"
                                    value={`${recursoApelacion}`}
                                    disabled={userLogged?.toString() !== rolesByCode.secretariaComunInstruccion}
                                    onChange={(e): any => setRecursoApelacion(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  >
                                    <option value="default">- Seleccione -</option>
                                    <option value="yes">Si</option>
                                    <option value="no">No</option>
                                  </select>
                                </div>
                              </div>
                            )}
                            {recursoApelacion === 'no' && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={18}
                                  initialDocuments={index.noRecursoApelacion}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                />
                              </>
                            )}

                            {recursoApelacion === 'yes' && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={34}
                                  initialDocuments={index.noRecursoApelacion}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                />
                                {/* Procede recurso de apelación */}
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Procede recurso de apelación?
                                    </label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      // disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      value={`${procedeRecursoApelacion}`}
                                      onChange={(e): any => {
                                        setProcedeRecursoApelacion(e.target.value);
                                        if (e.target.value === 'yes') {
                                          setEtapa(etapas.segundaInstancia);
                                        }
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {procedeRecursoApelacion === 'yes' && (
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[36, 37]}
                                    initialDocuments={index.siProcendeRecursoApelacion}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.secretariaComunInstruccion,
                                      rolesByCode.directorInstruccion,
                                    ]}
                                  />
                                )}
                              </>
                            )}
                          </>
                          {/* )} */}
                        </>
                      ) : (
                        <>
                          {/* <div className="space-y-6 sm:space-y-5 hidden">
                            <div className="xs:col-span-3">
                              <label className="block text-xs font-medium text-gray-700">
                                Desición de la evaluación
                              </label>
                              <select
                                id="userAgent"
                                name="documentalType"
                                disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                autoComplete="documentalType"
                                value={`${decisionEvaluacion}`}
                                onChange={(e): any => {
                                  setDecisionEvaluacion(e.target.value);
                                  e.target.value === 'archivo'
                                    ? setEtapa(etapas.archivo)
                                    : setEtapa(etapas.juzgamiento);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                              >
                                <option value="default">Seleccionar</option>
                                <option value="archivo">Archivo</option>
                                <option value="juzgamiento">Juzgamiento</option>
                              </select>
                            </div>
                          </div>
                          {decisionEvaluacion === 'archivo' && (
                            <>
                              <div className=" space-y-6 sm:space-y-5 hidden">
                                <div className="xs:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Fecha de notificación archivo de la investigación
                                    <span className="text-xs text-primary">(Obligatorio)</span>
                                  </label>
                                  <input
                                    type="date"
                                    name="first-name"
                                    id="first-name"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          Se notificó en forma personal de citación a primera audiencia
                          <div className="space-y-6 sm:space-y-5 hidden">
                            <div className="xs:col-span-3">
                              <label className="block text-xs font-medium text-gray-700">
                                ¿Se notificó en forma personal de citación a primera audiencia?
                              </label>
                              <select
                                id="userAgent"
                                name="documentalType"
                                autoComplete="documentalType"
                                disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                value={`${notificoEnFormaPersonal}`}
                                onChange={(e): any => setNotificoEnFormaPersonal(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                              >
                                <option value="default">- Seleccione -</option>
                                <option value="yes">Si</option>
                                <option value="no">No</option>
                              </select>
                            </div>
                          </div>

                          {notificoEnFormaPersonal === 'no' ? (
                            <>
                              Agendar Citación a Audiencia
                              <div className=" space-y-6 sm:space-y-5 hidden">
                                <div className="xs:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Agendar Citación a Audiencia{' '}
                                    <span className="text-xs text-primary">(Obligatorio)</span>
                                  </label>
                                  <input
                                    type="date"
                                    name="first-name"
                                    id="first-name"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm hidden">Recording System Unavailable...</p>
                              <div className=" space-y-6 sm:space-y-5 hidden">
                                <div className="xs:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Agendar Citación a Siguiente Audiencia
                                    <span className="text-xs text-primary"> (Obligatorio)</span>
                                  </label>
                                  <input
                                    type="date"
                                    name="first-name"
                                    id="first-name"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  />
                                </div>
                              </div>
                            </>
                          )} */}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {indagacionPrevia === 'yes' && recursoApelacion === 'yes' && (
              <>
                {userLogged?.toString() === rolesByCode.secretariaComunInstruccion && (
                  <div style={{ background: '#e8f5e9' }} className=" p-4 w-1/2">
                    <Switch
                      onChange={(e: any) => {
                        setDecisionSegundaInstancia(e.target.checked);
                      }}
                      color="success"
                      value={decisionSegundaInstancia}
                    />{' '}
                    ¿Regresa de segunda instancia?
                  </div>
                )}
                {procedeRecursoApelacion === 'yes' && decisionSegundaInstancia === true && (
                  <>
                    <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">
                      Regreso de segunda instancia
                    </h4>
                    <hr className="pt-0 mt-0 m-0" style={{ marginTop: 0 }} />
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 pt-0">
                      {/* Continua investigación */}
                      <div className="space-y-6 sm:space-y-5">
                        <div className="xs:col-span-3">
                          <label className="block text-xs font-medium text-gray-700">¿Continua investigación?</label>
                          <select
                            id="userAgent"
                            name="documentalType"
                            autoComplete="documentalType"
                            value={`${continueInvestigation}`}
                            // disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                            onChange={(e): any => setContinueInvestigation(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          >
                            <option value="default">- Seleccione -</option>
                            <option value="yes">Si</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>

                      {continueInvestigation === 'no' && (
                        <DocumentsTable
                          documentAproved={null}
                          setDocumentAproved={null}
                          roles={rolesByCode}
                          currentUser={userLogged?.toString()}
                          requestSelected={requestSelected}
                          recepcionarSolicitudData={recepcionarSolicitudData}
                          stage={60}
                          initialDocuments={index.noContinueInvestigacion}
                          comparationState={'Aceptado'}
                          rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                        />
                      )}

                      {continueInvestigation === 'yes' && (
                        <DocumentsTable
                          documentAproved={null}
                          setDocumentAproved={null}
                          roles={rolesByCode}
                          currentUser={userLogged?.toString()}
                          requestSelected={requestSelected}
                          recepcionarSolicitudData={recepcionarSolicitudData}
                          stage={[58, 19]}
                          initialDocuments={index.siContinueInvestigacion}
                          comparationState={'Aceptado'}
                          rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                        />
                      )}

                      {/* <div className="space-y-6 sm:space-y-5">
                        <div className="xs:col-span-3">
                          <label className="block text-xs font-medium text-gray-700">
                            Desición de segunda instancia
                          </label>
                          <select
                            id="userAgent"
                            name="documentalType"
                            autoComplete="documentalType"
                            disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                            value={`${decisionSegundaInstancia}`}
                            onChange={(e): any => {
                              setDecisionSegundaInstancia(e.target.value);
                              continueInvestigation === 'no' && e.target.value === 'confirmacion_de_archivo'
                                ? setEtapa(etapas.archivo)
                                : setEtapa(etapas.segundaInstancia);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          >
                            <option value="nulidad">Nulidad</option>
                            <option value="confirmacion_de_archivo">
                              Confirmación de archivo de investigación disciplinaria
                            </option>
                            <option value="confirmacion_de_fallo">Confirmación de fallo</option>
                            {continueInvestigation === 'yes' && (
                              <option value="iniciar_investigacion_disciplinaria">
                                Iniciar investigación disciplinaria
                              </option>
                            )}
                            <option value="otros">Otros</option>
                          </select>
                        </div>
                      </div>
                      {decisionSegundaInstancia === 'otros' && (
                        <div className=" space-y-6 sm:space-y-5">
                          <div className="xs:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">Describa cual:</label>
                            <input
                              value={decisionSegundaInstanciaOtros}
                              onChange={(e) => setDecisionSegundaInstanciaOtros(e.target.value)}
                              type="text"
                              name="first-name"
                              id="first-name"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            />
                          </div>
                        </div>
                      )} */}
                    </div>
                  </>
                )}
              </>
            )}
            {(documentsInicioInvestigacionDisciplinariaAproved || documentsAutoArchivoInicioIndagacionPreviaAproved) &&
              (continueInvestigation === 'yes' || disciplanaryInvestigation === 'yes') && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-0">
                    {/* Confesar */}
                    <div className="space-y-6 sm:space-y-5">
                      <div className="xs:col-span-3">
                        <label className="block text-xs font-medium text-gray-700">¿Desea confesar?</label>
                        <select
                          id="userAgent"
                          name="documentalType"
                          // disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                          autoComplete="documentalType"
                          value={`${confesar}`}
                          onChange={(e): any => setConfesar(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        >
                          <option value="default">- Seleccione -</option>
                          <option value="yes">Si</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    {confesar === 'yes' && (
                      <>
                        {/* <DocumentsTable //! ª
                          documentAproved={documentsConfesarSiApproved}
                          setDocumentAproved={setDocumentsConfesarSiApproved}
                          roles={rolesByCode}
                          currentUser={userLogged?.toString()}
                          requestSelected={requestSelected}
                          recepcionarSolicitudData={recepcionarSolicitudData}
                          stage={6}
                          // initialDocuments={}
                        />


                        {documentsConfesarSiApproved && ( */}
                        <div className="space-y-6 sm:space-y-5">
                          <div className="xs:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">¿Tiene Apoderado?</label>
                            <select
                              id="userAgent"
                              name="documentalType"
                              disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                              autoComplete="documentalType"
                              value={`${tieneApoderado}`}
                              onChange={(e): any => setTieneApoderado(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            >
                              <option value="default">- Seleccione -</option>
                              <option value="yes">Si</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                        {/* )} */}

                        {/* {tieneApoderado === 'yes' && (
                          <>
                            Aprobación confesión
                            <div className="space-y-6 sm:space-y-5">
                              <div className="xs:col-span-3">
                                <label className="block text-xs font-medium text-gray-700">
                                  ¿Aprobación de confesión?
                                </label>
                                <select
                                  id="aprobacionConfesion"
                                  name="aprobacionConfesion"
                                  disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                  autoComplete="aprobacionConfesion"
                                  value={`${aprobacionConfesion}`}
                                  onChange={(e): any => setAprobacionConfesion(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                >
                                  <option value="default">- Seleccione -</option>
                                  <option value="yes">Si</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )} */}
                        {tieneApoderado === 'no' && (
                          <>
                            {/* Tiene apoderado */}
                            <div className="space-y-6 sm:space-y-5">
                              <div className="xs:col-span-3">
                                <label className="block text-xs font-medium text-gray-700">Abogados de oficio</label>
                                <select
                                  id="userAgent"
                                  disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                  name="documentalType"
                                  autoComplete="documentalType"
                                  value={`${apoderadoSelected}`} //! revisarrrrr
                                  onChange={(e): any => setApoderadoSelected(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                >
                                  {publicDefenders?.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                      {item.publicDefenderName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <DocumentsTable
                              documentAproved={documentsNoApoderadoApproved}
                              setDocumentAproved={setDocumentsNoApoderadoApproved}
                              roles={rolesByCode}
                              currentUser={userLogged?.toString()}
                              requestSelected={requestSelected}
                              recepcionarSolicitudData={recepcionarSolicitudData}
                              stage={[40, 42]}
                              initialDocuments={index.noApoderado}
                              comparationState={'Aceptado'}
                              rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                            />
                            <DocumentsTable
                              documentAproved={null}
                              setDocumentAproved={null}
                              roles={rolesByCode}
                              currentUser={userLogged?.toString()}
                              requestSelected={requestSelected}
                              recepcionarSolicitudData={recepcionarSolicitudData}
                              stage={44}
                              initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                              comparationState={'Completado'}
                              rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                            />
                          </>
                        )}
                        {/* {tieneApoderado === 'yes' && (
                          <DocumentsTable
                            documentAproved={documentsSiApoderadoApproved}
                            setDocumentAproved={setDocumentsSiApoderadoApproved}
                            roles={rolesByCode}
                            currentUser={userLogged?.toString()}
                            requestSelected={requestSelected}
                            recepcionarSolicitudData={recepcionarSolicitudData}
                            stage={6}
                            initialDocuments={index.siApoderado}
                          />
                        )} */}
                        {/* Procede confesión */}
                        {(documentsNoApoderadoApproved || documentsSiApoderadoApproved) && (
                          <>
                            <div className="space-y-6 sm:space-y-5">
                              <div className="xs:col-span-3">
                                <label className="block text-xs font-medium text-gray-700">¿Procede confesión?</label>
                                <select
                                  id="procedeConfesion"
                                  name="procedeConfesion"
                                  autoComplete="procedeConfesion"
                                  disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                  value={`${procedeConfesion}`}
                                  onChange={(e): any => {
                                    setProcedeConfesion(e.target.value);
                                    e.target.value === 'yes' && setEtapa('49a930e9-a860-42ae-a396-3b6a42e883e6');
                                  }}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                >
                                  <option value="default">- Seleccione -</option>
                                  <option value="yes">Si</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )}

                        {procedeConfesion === 'no' && (
                          //! Revisar
                          <>
                            <DocumentsTable
                              documentAproved={documentsNoProcedeConfesionApproved}
                              setDocumentAproved={setDocumentsNoProcedeConfesionApproved}
                              roles={rolesByCode}
                              currentUser={userLogged?.toString()}
                              requestSelected={requestSelected}
                              recepcionarSolicitudData={recepcionarSolicitudData}
                              initialDocuments={index.noProcedeConfesion}
                              stage={[22, 24]}
                              comparationState={'Aceptado'}
                              rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                            />
                            <DocumentsTable
                              documentAproved={documentsNoProcedeConfesionApproved}
                              setDocumentAproved={setDocumentsNoProcedeConfesionApproved}
                              roles={rolesByCode}
                              currentUser={userLogged?.toString()}
                              requestSelected={requestSelected}
                              recepcionarSolicitudData={recepcionarSolicitudData}
                              initialDocuments={index.noProcedeConfesion}
                              stage={[26, 27]}
                              comparationState={'Completado'}
                              rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                            />

                            {/* Se archiva la investigacion */}
                            {documentsNoProcedeConfesionApproved && (
                              <>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Se archiva la investigación disciplinaria?
                                    </label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() !== rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${archiveDisciplanaryInvestigation}`}
                                      onChange={(e): any => setArchiveDisciplanaryInvestigation(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}

                            {archiveDisciplanaryInvestigation === 'yes' && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={46}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={48}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Completado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Utiliza el recurso de apelación?
                                    </label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() !== rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${recursoApelacionJuzgamiento}`}
                                      onChange={(e): any => setRecursoApelacionJuzgamiento(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {recursoApelacionJuzgamiento === 'no' && (
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={18}
                                    initialDocuments={index.noRecursoApelacion}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.profesionalInstruccion,
                                      rolesByCode.directorInstruccion,
                                    ]}
                                  />
                                )}

                                {recursoApelacionJuzgamiento === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      //! Tabla estado 53
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={53}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Completado'}
                                      rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                    />
                                    {/* Procede recurso de apelación */}
                                    <div className="space-y-6 sm:space-y-5">
                                      <div className="xs:col-span-3">
                                        <label className="block text-xs font-medium text-gray-700">
                                          ¿Procede recurso de apelación?
                                        </label>
                                        <select
                                          id="userAgent"
                                          name="documentalType"
                                          // disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                          autoComplete="documentalType"
                                          value={`${procedeRecursoApelacionJuzgamiento}`}
                                          onChange={(e): any => setProcedeRecursoApelacionJuzgamiento(e.target.value)}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        >
                                          <option value="default">- Seleccione -</option>
                                          <option value="yes">Si</option>
                                          <option value="no">No</option>
                                        </select>
                                      </div>
                                    </div>
                                    {procedeRecursoApelacionJuzgamiento === 'yes' && (
                                      <>
                                        <DocumentsTable
                                          documentAproved={null}
                                          setDocumentAproved={null}
                                          roles={rolesByCode}
                                          currentUser={userLogged?.toString()}
                                          requestSelected={requestSelected}
                                          recepcionarSolicitudData={recepcionarSolicitudData}
                                          stage={[55, 56]}
                                          initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                          comparationState={'Aceptado'}
                                          rolesAdmitidos={[
                                            rolesByCode.directorInstruccion,
                                            rolesByCode.secretariaComunInstruccion,
                                          ]}
                                        />
                                        {userLogged?.toString() === rolesByCode.secretariaComunInstruccion && (
                                          <div style={{ background: '#e8f5e9' }} className="p-4">
                                            <Switch
                                              onChange={(e: any) => {
                                                setDecisionSegundaInstanciaOtros(e.target.checked);
                                              }}
                                              color="success"
                                              value={decisionSegundaInstanciaOtros}
                                            />{' '}
                                            ¿Regresa de segunda instancia?
                                          </div>
                                        )}
                                        {decisionSegundaInstanciaOtros === true && (
                                          <div className="space-y-6 sm:space-y-5">
                                            <div className="xs:col-span-3">
                                              <label className="block text-xs font-medium text-gray-700">
                                                ¿Continua investigación?
                                              </label>
                                              <select
                                                id="userAgent"
                                                disabled={
                                                  userLogged?.toString() === rolesByCode.secretariaComunInstruccion
                                                }
                                                name="documentalType"
                                                autoComplete="documentalType"
                                                value={`${continueInvestigationJuzgamiento}`}
                                                onChange={(e): any => {
                                                  setContinueInvestigationJuzgamiento(e.target.value);
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                              >
                                                <option value="default">- Seleccione -</option>
                                                <option value="yes">Si</option>
                                                <option value="no">No</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                                {continueInvestigationJuzgamiento === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={28}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.profesionalInstruccion,
                                        rolesByCode.directorInstruccion,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={30}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Completado'}
                                      rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                    />

                                    <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
                                      <div className="w-full ml-4">
                                        <DocumentsTable
                                          documentAproved={null}
                                          setDocumentAproved={null}
                                          roles={rolesByCode}
                                          currentUser={userLogged?.toString()}
                                          requestSelected={requestSelected}
                                          recepcionarSolicitudData={recepcionarSolicitudData}
                                          stage={[32, 45]}
                                          initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                          comparationState={'Completado'}
                                          rolesAdmitidos={[
                                            rolesByCode.profesionalInstruccion,
                                            rolesByCode.directorInstruccion,
                                          ]}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {continueInvestigationJuzgamiento === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[58]}
                                      initialDocuments={index.noContinueInvestigacion}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.profesionalInstruccion,
                                        rolesByCode.directorInstruccion,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[60]}
                                      initialDocuments={index.noContinueInvestigacion}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                    />
                                  </>
                                )}

                                {procedeRecursoApelacionJuzgamiento === 'no' && (
                                  <>
                                    {/* <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[53]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                    /> */}
                                    {/* <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
                                      <div className="w-full ml-4">
                                        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">
                                          Documentos de archivo de investigación disciplinaria
                                        </h4>
                                        <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
                                        <table className="w-1/2">
                                          <thead className=" bg-cidSecundaryGrey">
                                            <th className="text-sm py-4 px-4">Documento</th>
                                            <th className="text-sm py-4 px-4">Acciones</th>
                                          </thead>
                                          <tr>
                                            <td className="py-2 px-2">
                                              <p className="text-sm underline">
                                                Constancia secretarial no presenta recurso apelación
                                              </p>
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                              secretaria de instruccion
                                              {userLogged?.toString() === 'dd1cdabc-d122-4a83-8b8a-2dd35d588c97' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {}}
                                                  className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                                                >
                                                  Crear
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div> */}
                                  </>
                                )}
                              </>
                            )}
                            {
                              //! Empieza Juzgamiento
                            }
                            {archiveDisciplanaryInvestigation === 'no' && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={28}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={30}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Completado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                />
                              </>
                            )}
                          </>
                        )}

                        {(procedeConfesion === 'yes' || archiveDisciplanaryInvestigation === 'no') && (
                          <>
                            <DocumentsTable
                              documentAproved={null}
                              setDocumentAproved={null}
                              roles={rolesByCode}
                              currentUser={userLogged?.toString()}
                              requestSelected={requestSelected}
                              recepcionarSolicitudData={recepcionarSolicitudData}
                              stage={[45]}
                              initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                              comparationState={'Aceptado'}
                              rolesAdmitidos={[rolesByCode.profesionalInstruccion]}
                            />

                            <div className="space-y-6 sm:space-y-5">
                              <div className="xs:col-span-3">
                                <label className="block text-xs font-medium text-gray-700">
                                  ¿Medio de juzgamiento Ordinario?
                                </label>
                                <select
                                  id="userAgent"
                                  name="documentalType"
                                  autoComplete="documentalType"
                                  value={`${medioJuzgamiento}`}
                                  onChange={(e): any => setMedioJuzgamiento(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                >
                                  <option value="default">- Seleccione -</option>
                                  <option value="yes">Si</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                            </div>

                            {medioJuzgamiento === 'no' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">
                                    Fecha de citación a segunda audiencia
                                  </label>
                                  <input
                                    id="fechaCitacion"
                                    name="fechaCitacion"
                                    type="datetime-local"
                                    onChange={(e): any => setCitacionAudiencia(e.target.value)}
                                    value={citacionAudiencia}
                                  />
                                </div>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[98, 99]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[
                                    rolesByCode.secretariaComunJuzgamiento,
                                    rolesByCode.profesionalJuzgamiento,
                                    rolesByCode.directorJuzgamiento,
                                  ]}
                                />
                                <div className="space-y-6 sm:space-y-5 flex items-end col-span-6"></div>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Acepta los Cargos?
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${aceptaCargos}`}
                                      onChange={(e): any => setAceptaCargos(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {/* {aceptaCargos === 'yes' && (
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[100, 101]}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.secretariaComunJuzgamiento,
                                      rolesByCode.profesionalJuzgamiento,
                                      rolesByCode.directorJuzgamiento,
                                    ]}
                                  />
                                )} */}
                                {/* {aceptaCargos === 'no' && (
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[102, 103, 104, 105]}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.secretariaComunJuzgamiento,
                                      rolesByCode.profesionalJuzgamiento,
                                      rolesByCode.directorJuzgamiento,
                                    ]}
                                  />
                                )} */}
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    {/* <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[106]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    /> */}
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[107, 108]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[109, 110]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[111, 112, 113]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[114, 115, 116]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}
                            {medioJuzgamiento === 'yes' && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[67, 68, 69]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[
                                    rolesByCode.secretariaComunJuzgamiento,
                                    rolesByCode.profesionalJuzgamiento,
                                    rolesByCode.directorJuzgamiento,
                                  ]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Se Aprueban las Pruebas Completas?
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${apruebaPruebasCompletas}`}
                                      onChange={(e): any => setApruebaPruebasCompletas(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}
                            {apruebaPruebasCompletas === 'yes' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenModalPruebas(true);
                                  }}
                                  className="items-center pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                                >
                                  Registrar pruebas
                                </button>
                                {openModalPruebas && (
                                  <ModalPruebas
                                    setModalPruebas={setOpenModalPruebas}
                                    modalPruebas={openModalPruebas}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    requestSelected={requestSelected}
                                    setPruebasRequest={setPruebasRequest}
                                    handleSubmit={handleSubmit}
                                    docFiles={docFiles}
                                    setDocFiles={setDocFiles}
                                    rolesByCode={rolesByCode}
                                    userLogged={userLogged}
                                  />
                                )}
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[72]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[75]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[76]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[81, 82]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[84]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[86]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[79, 80]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {apruebaPruebasCompletas === 'no' && (
                              <>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Presenta Recurso de Apelación de Auto de Decisión de Pruebas?
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${presentaRecursoApelacionAutoDecisionPruebas}`}
                                      onChange={(e): any =>
                                        setPresentaRecursoApelacionAutoDecisionPruebas(e.target.value)
                                      }
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {presentaRecursoApelacionAutoDecisionPruebas === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[91, 92, 93, 94, 95]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <div className="space-y-6 sm:space-y-5">
                                      <div className="xs:col-span-3">
                                        <label className="block text-xs font-medium text-gray-700">
                                          ¿Concede Recurso?
                                        </label>
                                        <select
                                          id="userAgent"
                                          disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                          name="documentalType"
                                          autoComplete="documentalType"
                                          value={`${concedeRecurso}`}
                                          onChange={(e): any => setConcedeRecurso(e.target.value)}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        >
                                          <option value="default">- Seleccione -</option>
                                          <option value="yes">Si</option>
                                          <option value="no">No</option>
                                        </select>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            )}

                            {concedeRecurso === 'yes' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenModalPruebas(true);
                                  }}
                                  className="items-center pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                                >
                                  Registrar pruebas
                                </button>
                                {openModalPruebas && (
                                  <ModalPruebas
                                    setModalPruebas={setOpenModalPruebas}
                                    modalPruebas={openModalPruebas}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    requestSelected={requestSelected}
                                    setPruebasRequest={setPruebasRequest}
                                    handleSubmit={handleSubmit}
                                    docFiles={docFiles}
                                    setDocFiles={setDocFiles}
                                    rolesByCode={rolesByCode}
                                    userLogged={userLogged}
                                  />
                                )}
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[72]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[75]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[76]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[81, 82]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[84]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[86]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[79, 80]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {(concedeRecurso === 'no' || presentaRecursoApelacionAutoDecisionPruebas === 'no') && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[90]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[72]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[75]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[76]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[81, 82]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[84]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[86]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[79, 80]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {apelaFallo === 'yes' && (
                              <>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Hay Nulidad?</label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${hayNulidad}`}
                                      onChange={(e): any => setHayNulidad(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>

                                {/* <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      Desición de segunda instancia
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${decisionSegundaInstancia}`}
                                      onChange={(e): any => {
                                        setDecisionSegundaInstancia(e.target.value);
                                        continueInvestigation === 'no' && e.target.value === 'confirmacion_de_archivo'
                                          ? setEtapa('0765f69d-3d00-4524-ba2c-5c1ff4cb2b43')
                                          : setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');

                                        e.target.value === 'confirmacion_de_fallo' &&
                                          setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="nulidad">Nulidad</option>
                                      <option value="confirmacion_de_archivo">
                                        Confirmación de archivo de investigación disciplinaria
                                      </option>
                                      <option value="confirmacion_de_fallo">Confirmación de fallo</option>
                                      {continueInvestigation === 'yes' && (
                                        <option value="iniciar_investigacion_disciplinaria">
                                          Iniciar investigación disciplinaria
                                        </option>
                                      )}
                                      <option value="otros">Otros</option>
                                    </select>
                                  </div>
                                </div>
                                {decisionSegundaInstancia === 'otros' && (
                                  <div className=" space-y-6 sm:space-y-5">
                                    <div className="xs:col-span-3">
                                      <label className="block text-xs font-medium text-gray-700">Describa cual:</label>
                                      <input
                                        value={decisionSegundaInstanciaOtros}
                                        onChange={(e) => setDecisionSegundaInstanciaOtros(e.target.value)}
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                      />
                                    </div>
                                  </div> 
                                )} */}

                                {hayNulidad === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[119, 120]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[121, 122, 123]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                                {hayNulidad === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[117, 118]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                        <div className="space-y-6 sm:space-y-5 hidden">
                          <div className="xs:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">¿Se entrega copia?</label>
                            <select
                              id="userAgent"
                              disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                              name="documentalType"
                              autoComplete="documentalType"
                              value={`${entregaCopia}`}
                              onChange={(e): any => setEntregaCopia(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            >
                              <option value="default">- Seleccione -</option>
                              <option value="yes">Si</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {confesar === 'no' && (
                      // <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
                      //   <div className="w-full ml-4">
                      //     <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">
                      //       Documentos de juzgamiento
                      //     </h4>
                      //     <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
                      //     <table className="w-1/2">
                      //       <thead className=" bg-cidSecundaryGrey">
                      //         <th className="text-sm py-4 px-4">Documento</th>
                      //         <th className="text-sm py-4 px-4">Acciones</th>
                      //       </thead>
                      //       <tr>
                      //         <td className="py-2 px-2">
                      //           <p className="text-sm underline">Portada expedientes</p>
                      //         </td>
                      //         <td className="py-2 px-2">
                      //           {userLogged?.toString() !== 'f7d3edd7-8450-471a-84a9-8d171786eb7d' && (
                      //             <button
                      //               type="button"
                      //               onClick={generateAutoInhibitorio}
                      //               className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      //             >
                      //               Crear
                      //             </button>
                      //           )}
                      //           {/* Solo el director puede acceder a estas acciones */}
                      //           {userLogged?.toString() === 'f7d3edd7-8450-471a-84a9-8d171786eb7d' && (
                      //             <>
                      //               <button
                      //                 type="button"
                      //                 onClick={() => {}}
                      //                 className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-cidPrimaryGreen"
                      //               >
                      //                 Aprobar
                      //               </button>
                      //               <button
                      //                 type="button"
                      //                 onClick={() => {}}
                      //                 className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                      //               >
                      //                 Rechazar
                      //               </button>
                      //             </>
                      //           )}
                      //         </td>
                      //       </tr>
                      //     </table>
                      //   </div>
                      // </div>
                      <>
                        {/* {procedeConfesion === 'no' && ( */}
                        {/* //! Revisar */}
                        <>
                          <DocumentsTable
                            documentAproved={documentsNoProcedeConfesionApproved}
                            setDocumentAproved={setDocumentsNoProcedeConfesionApproved}
                            roles={rolesByCode}
                            currentUser={userLogged?.toString()}
                            requestSelected={requestSelected}
                            recepcionarSolicitudData={recepcionarSolicitudData}
                            initialDocuments={index.noProcedeConfesion}
                            stage={[22, 24]}
                            comparationState={'Aceptado'}
                            rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                          />
                          <DocumentsTable
                            documentAproved={documentsNoProcedeConfesionApproved}
                            setDocumentAproved={setDocumentsNoProcedeConfesionApproved}
                            roles={rolesByCode}
                            currentUser={userLogged?.toString()}
                            requestSelected={requestSelected}
                            recepcionarSolicitudData={recepcionarSolicitudData}
                            initialDocuments={index.noProcedeConfesion}
                            stage={[26, 27]}
                            comparationState={'Completado'}
                            rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                          />

                          {/* Se archiva la investigacion */}
                          {documentsNoProcedeConfesionApproved && (
                            <>
                              <div className="space-y-6 sm:space-y-5">
                                <div className="xs:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">
                                    ¿Se archiva la investigación disciplinaria?
                                  </label>
                                  <select
                                    id="userAgent"
                                    name="documentalType"
                                    disabled={userLogged?.toString() !== rolesByCode.secretariaComunInstruccion}
                                    autoComplete="documentalType"
                                    value={`${archiveDisciplanaryInvestigation}`}
                                    onChange={(e): any => setArchiveDisciplanaryInvestigation(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  >
                                    <option value="default">- Seleccione -</option>
                                    <option value="yes">Si</option>
                                    <option value="no">No</option>
                                  </select>
                                </div>
                              </div>
                            </>
                          )}

                          {archiveDisciplanaryInvestigation === 'yes' && (
                            <>
                              <DocumentsTable
                                documentAproved={null}
                                setDocumentAproved={null}
                                roles={rolesByCode}
                                currentUser={userLogged?.toString()}
                                requestSelected={requestSelected}
                                recepcionarSolicitudData={recepcionarSolicitudData}
                                stage={46}
                                initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                comparationState={'Aceptado'}
                                rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                              />
                              <DocumentsTable
                                documentAproved={null}
                                setDocumentAproved={null}
                                roles={rolesByCode}
                                currentUser={userLogged?.toString()}
                                requestSelected={requestSelected}
                                recepcionarSolicitudData={recepcionarSolicitudData}
                                stage={48}
                                initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                comparationState={'Completado'}
                                rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                              />

                              <div className="space-y-6 sm:space-y-5">
                                <div className="xs:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">
                                    ¿Utiliza el recurso de apelación?
                                  </label>
                                  <select
                                    id="userAgent"
                                    name="documentalType"
                                    disabled={userLogged?.toString() !== rolesByCode.secretariaComunInstruccion}
                                    autoComplete="documentalType"
                                    value={`${recursoApelacionJuzgamiento}`}
                                    onChange={(e): any => setRecursoApelacionJuzgamiento(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  >
                                    <option value="default">- Seleccione -</option>
                                    <option value="yes">Si</option>
                                    <option value="no">No</option>
                                  </select>
                                </div>
                              </div>
                              {recursoApelacionJuzgamiento === 'no' && (
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={18}
                                  initialDocuments={index.noRecursoApelacion}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                                />
                              )}
                              {recursoApelacionJuzgamiento === 'yes' && (
                                <>
                                  <DocumentsTable
                                    //! Tabla estado 53
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[53]}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.profesionalInstruccion,
                                      rolesByCode.directorInstruccion,
                                    ]}
                                  />

                                  {/* Procede recurso de apelación */}
                                  <div className="space-y-6 sm:space-y-5">
                                    <div className="xs:col-span-3">
                                      <label className="block text-xs font-medium text-gray-700">
                                        ¿Procede recurso de apelación?
                                      </label>
                                      <select
                                        id="userAgent"
                                        name="documentalType"
                                        // disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                        autoComplete="documentalType"
                                        value={`${procedeRecursoApelacionJuzgamiento}`}
                                        onChange={(e): any => setProcedeRecursoApelacionJuzgamiento(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                      >
                                        <option value="default">- Seleccione -</option>
                                        <option value="yes">Si</option>
                                        <option value="no">No</option>
                                      </select>
                                    </div>
                                  </div>
                                  {procedeRecursoApelacionJuzgamiento === 'yes' && (
                                    <>
                                      <DocumentsTable
                                        documentAproved={null}
                                        setDocumentAproved={null}
                                        roles={rolesByCode}
                                        currentUser={userLogged?.toString()}
                                        requestSelected={requestSelected}
                                        recepcionarSolicitudData={recepcionarSolicitudData}
                                        stage={[55, 56]}
                                        initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                        comparationState={'Aceptado'}
                                        rolesAdmitidos={[
                                          rolesByCode.directorInstruccion,
                                          rolesByCode.secretariaComunInstruccion,
                                        ]}
                                      />
                                      {userLogged?.toString() === rolesByCode.secretariaComunInstruccion && (
                                        <div style={{ background: '#e8f5e9' }} className=" p-4 w-1/2">
                                          <Switch
                                            onChange={(e: any) => {
                                              setDecisionSegundaInstanciaOtros(e.target.checked);
                                            }}
                                            color="success"
                                            value={decisionSegundaInstanciaOtros}
                                          />{' '}
                                          ¿Regresa de segunda instancia?
                                        </div>
                                      )}
                                      {decisionSegundaInstanciaOtros === true && (
                                        <div className="space-y-6 sm:space-y-5">
                                          <div className="xs:col-span-3">
                                            <label className="block text-xs font-medium text-gray-700">
                                              ¿Continua investigación?
                                            </label>
                                            <select
                                              id="userAgent"
                                              disabled={
                                                userLogged?.toString() === rolesByCode.secretariaComunInstruccion
                                              }
                                              name="documentalType"
                                              autoComplete="documentalType"
                                              value={`${continueInvestigationJuzgamiento}`}
                                              onChange={(e): any => {
                                                setContinueInvestigationJuzgamiento(e.target.value);
                                              }}
                                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                            >
                                              <option value="default">- Seleccione -</option>
                                              <option value="yes">Si</option>
                                              <option value="no">No</option>
                                            </select>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </>
                              )}

                              {continueInvestigationJuzgamiento === 'yes' && (
                                <>
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={28}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.profesionalInstruccion,
                                      rolesByCode.directorInstruccion,
                                    ]}
                                  />
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={30}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Completado'}
                                    rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                  />

                                  <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
                                    <div className="w-full ml-4">
                                      <DocumentsTable
                                        documentAproved={null}
                                        setDocumentAproved={null}
                                        roles={rolesByCode}
                                        currentUser={userLogged?.toString()}
                                        requestSelected={requestSelected}
                                        recepcionarSolicitudData={recepcionarSolicitudData}
                                        stage={[32, 45]}
                                        initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                        comparationState={'Completado'}
                                        rolesAdmitidos={[
                                          rolesByCode.profesionalInstruccion,
                                          rolesByCode.directorInstruccion,
                                        ]}
                                      />
                                      {/* <div style={{ background: '#e8f5e9' }} className=" p-4 w-1/2">
                                  <Switch
                                    onChange={(e: any) => {
                                      setDocumentAproved6(e.target.checked);
                                    }}
                                    color="success"
                                  />{' '}
                                  ¿Todos los documentos fueron aprobados? {documentAproved6}
                                </div> */}
                                    </div>
                                  </div>
                                </>
                              )}

                              {continueInvestigationJuzgamiento === 'no' && (
                                <>
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[58]}
                                    initialDocuments={index.noContinueInvestigacion}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.profesionalInstruccion,
                                      rolesByCode.directorInstruccion,
                                    ]}
                                  />
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[60]}
                                    initialDocuments={index.noContinueInvestigacion}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                                  />
                                </>
                              )}

                              {procedeRecursoApelacionJuzgamiento === 'no' && (
                                <>
                                  {/* <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[53]}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                  /> */}
                                  {/* <div className="space-y-6 sm:space-y-5 flex items-end col-span-6">
                                      <div className="w-full ml-4">
                                        <h4 className="text-sm leading-6 font-medium text-sidebarSubtitle pb-0">
                                          Documentos de archivo de investigación disciplinaria
                                        </h4>
                                        <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
                                        <table className="w-1/2">
                                          <thead className=" bg-cidSecundaryGrey">
                                            <th className="text-sm py-4 px-4">Documento</th>
                                            <th className="text-sm py-4 px-4">Acciones</th>
                                          </thead>
                                          <tr>
                                            <td className="py-2 px-2">
                                              <p className="text-sm underline">
                                                Constancia secretarial no presenta recurso apelación
                                              </p>
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                              secretaria de instruccion
                                              {userLogged?.toString() === 'dd1cdabc-d122-4a83-8b8a-2dd35d588c97' && (
                                                <button
                                                  type="button"
                                                  onClick={() => {}}
                                                  className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                                                >
                                                  Crear
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </div> */}
                                </>
                              )}
                            </>
                          )}
                          {
                            //! Empieza Juzgamiento
                          }
                          {archiveDisciplanaryInvestigation === 'no' && (
                            <>
                              <DocumentsTable
                                documentAproved={null}
                                setDocumentAproved={null}
                                roles={rolesByCode}
                                currentUser={userLogged?.toString()}
                                requestSelected={requestSelected}
                                recepcionarSolicitudData={recepcionarSolicitudData}
                                stage={28}
                                initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                comparationState={'Aceptado'}
                                rolesAdmitidos={[rolesByCode.profesionalInstruccion, rolesByCode.directorInstruccion]}
                              />
                              <DocumentsTable
                                documentAproved={null}
                                setDocumentAproved={null}
                                roles={rolesByCode}
                                currentUser={userLogged?.toString()}
                                requestSelected={requestSelected}
                                recepcionarSolicitudData={recepcionarSolicitudData}
                                stage={30}
                                initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                comparationState={'Completado'}
                                rolesAdmitidos={[rolesByCode.secretariaComunInstruccion]}
                              />
                            </>
                          )}
                        </>
                        {/* )} */}

                        {(procedeConfesion === 'yes' || archiveDisciplanaryInvestigation === 'no') && (
                          <>
                            <DocumentsTable
                              documentAproved={null}
                              setDocumentAproved={null}
                              roles={rolesByCode}
                              currentUser={userLogged?.toString()}
                              requestSelected={requestSelected}
                              recepcionarSolicitudData={recepcionarSolicitudData}
                              stage={[45]}
                              initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                              comparationState={'Aceptado'}
                              rolesAdmitidos={[rolesByCode.profesionalInstruccion]}
                            />

                            <div className="space-y-6 sm:space-y-5">
                              <div className="xs:col-span-3">
                                <label className="block text-xs font-medium text-gray-700">
                                  ¿Medio de juzgamiento Ordinario?
                                </label>
                                <select
                                  id="userAgent"
                                  name="documentalType"
                                  autoComplete="documentalType"
                                  value={`${medioJuzgamiento}`}
                                  onChange={(e): any => setMedioJuzgamiento(e.target.value)}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                >
                                  <option value="default">- Seleccione -</option>
                                  <option value="yes">Si</option>
                                  <option value="no">No</option>
                                </select>
                              </div>
                            </div>

                            {medioJuzgamiento === 'no' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">
                                    Fecha de citación a segunda audiencia
                                  </label>
                                  <input
                                    id="fechaCitacion"
                                    name="fechaCitacion"
                                    type="datetime-local"
                                    onChange={(e): any => setCitacionAudiencia(e.target.value)}
                                    value={citacionAudiencia}
                                  />
                                </div>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[98, 99]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[
                                    rolesByCode.secretariaComunJuzgamiento,
                                    rolesByCode.profesionalJuzgamiento,
                                    rolesByCode.directorJuzgamiento,
                                  ]}
                                />
                                <div className="space-y-6 sm:space-y-5 flex items-end col-span-6"></div>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Acepta los Cargos?
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${aceptaCargos}`}
                                      onChange={(e): any => setAceptaCargos(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {/* {aceptaCargos === 'yes' && (
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[100, 101]}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.secretariaComunJuzgamiento,
                                      rolesByCode.profesionalJuzgamiento,
                                      rolesByCode.directorJuzgamiento,
                                    ]}
                                  />
                                )} */}
                                {/* {aceptaCargos === 'no' && (
                                  <DocumentsTable
                                    documentAproved={null}
                                    setDocumentAproved={null}
                                    roles={rolesByCode}
                                    currentUser={userLogged?.toString()}
                                    requestSelected={requestSelected}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    stage={[102, 103, 104, 105]}
                                    initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                    comparationState={'Aceptado'}
                                    rolesAdmitidos={[
                                      rolesByCode.secretariaComunJuzgamiento,
                                      rolesByCode.profesionalJuzgamiento,
                                      rolesByCode.directorJuzgamiento,
                                    ]}
                                  />
                                )} */}
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    {/* <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[106]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    /> */}
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[107, 108]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[109, 110]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[111, 112, 113]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[114, 115, 116]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}
                            {medioJuzgamiento === 'yes' && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[67, 68, 69]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[
                                    rolesByCode.secretariaComunJuzgamiento,
                                    rolesByCode.profesionalJuzgamiento,
                                    rolesByCode.directorJuzgamiento,
                                  ]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Se Aprueban las Pruebas Completas?
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${apruebaPruebasCompletas}`}
                                      onChange={(e): any => setApruebaPruebasCompletas(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                              </>
                            )}
                            {apruebaPruebasCompletas === 'yes' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenModalPruebas(true);
                                  }}
                                  className="items-center pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                                >
                                  Registrar pruebas
                                </button>
                                {openModalPruebas && (
                                  <ModalPruebas
                                    setModalPruebas={setOpenModalPruebas}
                                    modalPruebas={openModalPruebas}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    requestSelected={requestSelected}
                                    setPruebasRequest={setPruebasRequest}
                                    handleSubmit={handleSubmit}
                                    docFiles={docFiles}
                                    setDocFiles={setDocFiles}
                                    rolesByCode={rolesByCode}
                                    userLogged={userLogged}
                                  />
                                )}
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[72]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[75]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[76]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[81, 82]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[84]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[86]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[79, 80]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {apruebaPruebasCompletas === 'no' && (
                              <>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      ¿Presenta Recurso de Apelación de Auto de Decisión de Pruebas?
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${presentaRecursoApelacionAutoDecisionPruebas}`}
                                      onChange={(e): any =>
                                        setPresentaRecursoApelacionAutoDecisionPruebas(e.target.value)
                                      }
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {presentaRecursoApelacionAutoDecisionPruebas === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[91, 92, 93, 94, 95]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <div className="space-y-6 sm:space-y-5">
                                      <div className="xs:col-span-3">
                                        <label className="block text-xs font-medium text-gray-700">
                                          ¿Concede Recurso?
                                        </label>
                                        <select
                                          id="userAgent"
                                          disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                          name="documentalType"
                                          autoComplete="documentalType"
                                          value={`${concedeRecurso}`}
                                          onChange={(e): any => setConcedeRecurso(e.target.value)}
                                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        >
                                          <option value="default">- Seleccione -</option>
                                          <option value="yes">Si</option>
                                          <option value="no">No</option>
                                        </select>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            )}

                            {concedeRecurso === 'yes' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenModalPruebas(true);
                                  }}
                                  className="items-center pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                                >
                                  Registrar pruebas
                                </button>
                                {openModalPruebas && (
                                  <ModalPruebas
                                    setModalPruebas={setOpenModalPruebas}
                                    modalPruebas={openModalPruebas}
                                    recepcionarSolicitudData={recepcionarSolicitudData}
                                    requestSelected={requestSelected}
                                    setPruebasRequest={setPruebasRequest}
                                    handleSubmit={handleSubmit}
                                    docFiles={docFiles}
                                    setDocFiles={setDocFiles}
                                    rolesByCode={rolesByCode}
                                    userLogged={userLogged}
                                  />
                                )}
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[72]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[75]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[76]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[81, 82]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[84]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[86]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[79, 80]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {(concedeRecurso === 'no' || presentaRecursoApelacionAutoDecisionPruebas === 'no') && (
                              <>
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[90]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[72]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[75]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.secretariaComunJuzgamiento]}
                                />
                                <DocumentsTable
                                  documentAproved={null}
                                  setDocumentAproved={null}
                                  roles={rolesByCode}
                                  currentUser={userLogged?.toString()}
                                  requestSelected={requestSelected}
                                  recepcionarSolicitudData={recepcionarSolicitudData}
                                  stage={[76]}
                                  initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                  comparationState={'Aceptado'}
                                  rolesAdmitidos={[rolesByCode.profesionalJuzgamiento, rolesByCode.directorJuzgamiento]}
                                />
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Apela el fallo?</label>
                                    <select
                                      id="userAgent"
                                      name="documentalType"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      autoComplete="documentalType"
                                      value={`${apelaFallo}`}
                                      onChange={(e): any => {
                                        setApelaFallo(e.target.value);
                                        e.target.value === 'no' && setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                        e.target.value === 'yes' && setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>
                                {apelaFallo === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[81, 82]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[84]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[86]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}

                                {apelaFallo === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[79, 80]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {apelaFallo === 'yes' && (
                              <>
                                <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">¿Hay Nulidad?</label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${hayNulidad}`}
                                      onChange={(e): any => setHayNulidad(e.target.value)}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="default">- Seleccione -</option>
                                      <option value="yes">Si</option>
                                      <option value="no">No</option>
                                    </select>
                                  </div>
                                </div>

                                {/* <div className="space-y-6 sm:space-y-5">
                                  <div className="xs:col-span-3">
                                    <label className="block text-xs font-medium text-gray-700">
                                      Desición de segunda instancia
                                    </label>
                                    <select
                                      id="userAgent"
                                      disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                                      name="documentalType"
                                      autoComplete="documentalType"
                                      value={`${decisionSegundaInstancia}`}
                                      onChange={(e): any => {
                                        setDecisionSegundaInstancia(e.target.value);
                                        continueInvestigation === 'no' && e.target.value === 'confirmacion_de_archivo'
                                          ? setEtapa('0765f69d-3d00-4524-ba2c-5c1ff4cb2b43')
                                          : setEtapa('48e86dde-3eaf-4cfd-b8c4-7f84d8e547a7');

                                        e.target.value === 'confirmacion_de_fallo' &&
                                          setEtapa('17cb42e6-0b5d-45fe-bdf0-761939ddd63f');
                                      }}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                    >
                                      <option value="nulidad">Nulidad</option>
                                      <option value="confirmacion_de_archivo">
                                        Confirmación de archivo de investigación disciplinaria
                                      </option>
                                      <option value="confirmacion_de_fallo">Confirmación de fallo</option>
                                      {continueInvestigation === 'yes' && (
                                        <option value="iniciar_investigacion_disciplinaria">
                                          Iniciar investigación disciplinaria
                                        </option>
                                      )}
                                      <option value="otros">Otros</option>
                                    </select>
                                  </div>
                                </div>
                                {decisionSegundaInstancia === 'otros' && (
                                  <div className=" space-y-6 sm:space-y-5">
                                    <div className="xs:col-span-3">
                                      <label className="block text-xs font-medium text-gray-700">Describa cual:</label>
                                      <input
                                        value={decisionSegundaInstanciaOtros}
                                        onChange={(e) => setDecisionSegundaInstanciaOtros(e.target.value)}
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                      />
                                    </div>
                                  </div> 
                                )} */}

                                {hayNulidad === 'no' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[119, 120]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[121, 122, 123]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.directorJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                                {hayNulidad === 'yes' && (
                                  <>
                                    <DocumentsTable
                                      documentAproved={null}
                                      setDocumentAproved={null}
                                      roles={rolesByCode}
                                      currentUser={userLogged?.toString()}
                                      requestSelected={requestSelected}
                                      recepcionarSolicitudData={recepcionarSolicitudData}
                                      stage={[117, 118]}
                                      initialDocuments={index.siArchivarInvesticacionDisciplinaria}
                                      comparationState={'Aceptado'}
                                      rolesAdmitidos={[
                                        rolesByCode.secretariaComunJuzgamiento,
                                        rolesByCode.profesionalJuzgamiento,
                                      ]}
                                    />
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                        <div className="space-y-6 sm:space-y-5 hidden">
                          <div className="xs:col-span-3">
                            <label className="block text-xs font-medium text-gray-700">¿Se entrega copia?</label>
                            <select
                              id="userAgent"
                              disabled={userLogged?.toString() === rolesByCode.secretariaComunInstruccion}
                              name="documentalType"
                              autoComplete="documentalType"
                              value={`${entregaCopia}`}
                              onChange={(e): any => setEntregaCopia(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            >
                              <option value="default">- Seleccione -</option>
                              <option value="yes">Si</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            {/* Adjuntar Documentos */}
            <h4 className="text-sm leading-6 font-medium text-primary pb-0 mt-4">Anexos</h4>
            <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
            <div className="w-1/2">
              <FormLabel id="demo-row-radio-buttons-group-label">
                <span className="text-black text-xs font-bold">Adjuntar documentos</span>
              </FormLabel>
              <div className="mt-2">
                <UploadFileComponent
                  setDocFiles={setDocFiles}
                  docFiles={docFiles}
                  rolesByCode={rolesByCode}
                  currentUser={userLogged?.toString()}
                />
              </div>
            </div>
            {userLogged?.toString() !== rolesByCode?.ventanillaUnica && (
              <div>
                <h4 className="text-sm leading-6 font-medium text-primary pb-0 mt-4">Folio</h4>
                <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />
                <div className="flex items-center gap-5">
                  {dataFolio && (
                    <p className="font-medium underline cursor-pointer" onClick={() => setOpenModalViewer(true)}>
                      {dataFolio?.name}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (docFiles.filter((doc: any) => doc.isFolied === true).length === 0)
                        return showToast(
                          'error',
                          'Ocurrio un error',
                          'Debe seleccionar al menos un documento para foliar',
                        );
                      setLoadingFolio(true);
                      callEndpoint(
                        createFolio({
                          requestId: requestSelected?.id,
                          attachments: docFiles.filter((doc: any) => doc.isFolied === true),
                        }),
                      ).then((res: any) => {
                        setDataFolio(res.data);
                        setSourceAssets({ source: res.data.base64, fileType: 'application/pdf' });
                        setLoadingFolio(false);
                        handleSubmit();
                      });
                    }}
                    style={{ minWidth: '70px' }}
                    className="pulse ml-3 inline-flex justify-center py-2 px-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary hover:bg-primary"
                  >
                    <span hidden={loadingFolio}>Foliar</span>
                    <span hidden={!loadingFolio}>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
                {openModalViewer && (
                  <ModalViewer
                    setOpenModalViewer={setOpenModalViewer}
                    openModalViewer={openModalViewer}
                    sourceAssets={sourceAssets}
                  />
                )}
              </div>
            )}

            {typeOfCRUDAction === 'edit' && (
              <div className="grid grid-cols-2">
                <div>
                  <h4 className="text-sm leading-6 font-medium text-primary pb-0 mt-4">Historial de Observaciones</h4>
                  <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />

                  {requestObservationsUser?.map((element: any, index: number) => (
                    <div key={index}>
                      <span
                        style={{
                          fontSize: 16,
                          marginTop: 20,
                          color: '#373380',
                          paddingTop: '1em',
                          marginBottom: '2em',
                          display: 'block',
                        }}
                      >
                        {moment(element.createdAt).format('LL')}
                      </span>

                      <div
                        style={{ paddingTop: 10, flexDirection: 'row', display: 'flex', marginLeft: 10, gap: '30px' }}
                      >
                        <div style={{ justifyContent: 'center', alignItems: 'center', minWidth: 60 }}>
                          <p className="text-sidebarSubtitle">{moment(element.createdAt).format('DD-MM-YYYY')}</p>
                          <p className="text-sidebarSubtitle">{moment(element.createdAt).format('HH:mm')}</p>
                        </div>
                        <div style={{ borderWidth: 1, borderColor: '#eeeeee' }}></div>
                        <div className="text-monettaPrimaryBlue" style={{ flexDirection: 'column', display: 'flex' }}>
                          <span>{element.content}</span>
                          <span className="text-xs">
                            <b>Usuario:</b> {element.userCreated.userName} {element.userCreated.userLastName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm leading-6 font-medium text-primary pb-0 mt-4">Historial de sistema</h4>
                  <hr className="pt-0 mb-5 mt-0 m-0" style={{ marginTop: 0 }} />

                  {requestObservationsSystem?.map((element: any, index: number) => (
                    <div key={index}>
                      <span
                        style={{
                          fontSize: 16,
                          marginTop: 20,
                          color: '#373380',
                          paddingTop: '1em',
                          marginBottom: '2em',
                          display: 'block',
                        }}
                      >
                        {moment(element.createdAt).format('LL')}
                      </span>

                      <div
                        style={{ paddingTop: 10, flexDirection: 'row', display: 'flex', marginLeft: 10, gap: '30px' }}
                      >
                        <div style={{ justifyContent: 'center', alignItems: 'center', minWidth: 60 }}>
                          <p className="text-sidebarSubtitle">{moment(element.createdAt).format('DD-MM-YYYY')}</p>
                          <p className="text-sidebarSubtitle">{moment(element.createdAt).format('HH:mm')}</p>
                        </div>
                        <div style={{ borderWidth: 1, borderColor: '#eeeeee' }}></div>
                        <div
                          className="text-monettaPrimaryBlue"
                          style={{ flexDirection: 'column', display: 'flex', justifyContent: 'center' }}
                        >
                          <span>{element.content}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/*  Action Buttons   */}
          <div className="pt-5 sticky bottom-0 bg-white left-0 right-0 p-5 pr-0">
            <div className="flex justify-end">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setOpenModal(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handledOpenModalComment()}
                  className="px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-blue-400 hover:text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </form>
        {openModalComment && (
          <ModalComment
            handleSubmit={handleSubmit}
            openModalComment={openModalComment}
            setOpenModalComment={setOpenModalComment}
            setRequestObservations={setRequestObservations}
          />
        )}
      </Drawer>
    </div>
  );
};
