import { useEffect, useState } from 'react';

// Hooks
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';

// Services
import {
  getAllRequestTypes,
  getAllWebUsers,
  createProceedings,
  getExpendientes,
  getExpendientesById,
  getAllDisciplined,
  getAllPublicDefenders,
} from '../../../../services';

// Mocks
import positionMock from '../../../../mocks/positions.mock.json';
import { radioClasses, Tooltip } from '@mui/material';
import { FALSE } from 'sass';
import moment from 'moment';

/**
 *
 * @param roles: Roles activos para control de permisos
 * @param currentUser: Usuario logueado.
 * @param setRecepcionarSolicitudData: Control del Formulario
 * @param recepcionarSolicitudData: Acceso a la información del formulario
 * @param showToast: Sistema de notificaciones
 * @param typeOfCRUDAction: Modo edición ó creación
 * @returns
 */

export const RecepcionarSolicitud = ({
  roles,
  currentUser,
  setRecepcionarSolicitudData,
  recepcionarSolicitudData,
  showToast,
  typeOfCRUDAction,
  setDisciplined,
  requestHeader,
  setDocFiles,
  docFiles,
  setRequestSelected,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();
  const validEmail = new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}');

  const [funcionarios, setFuncionarios] = useState<any>([]);
  const [requestsAsigned, setRequestsAsigned] = useState<any>([]);
  const [infoDisciplinados, setInfoDisciplinados] = useState<any>({
    requestHeader: requestHeader,
    identificacion: '',
    name: '',
    primerApellido: '',
    segundoApellido: '',
    cargo: '',
    dependencia: '',
    email: '',
    isDisciplined: false,
    numeroRegistro: '',
    fechaIngreso: '',
    tipoVinculacion: '',
    tipoContrato: '',
    direccionResidencia: '',
    ciudadResidencia: '',
    nombreDptoResidencia: '',
    telefono: '',
    medioAComunicar: '',
    lawyer: null,
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailErrorDisciplinados, setEmailErrorDisciplinados] = useState('');
  const [tipoDocumentalList, setTipoDocumentalList] = useState([]);
  const [position, setPosition] = useState<any>([]);
  const [profesionales, setProfesionales] = useState<any>([]);
  const [numeroExpediente, setNumeroExpediente] = useState('');
  const [botonGenerar, setBotonGenerar] = useState(false);
  const [botonLimpiar, setBotonLimpiar] = useState(false);
  const [allExpedientes, setAllExpedientes] = useState<any>([]);
  const [allDisciplined, setAllDisciplined] = useState<any>([]);
  const [lawyers, setLawyers] = useState<any>([]);
  useEffect(() => {
    setInfoDisciplinados({
      requestHeader: requestHeader,
      identificacion: '',
      name: '',
      primerApellido: '',
      segundoApellido: '',
      cargo: '',
      dependencia: '',
      email: '',
      isDisciplined: false,
      fechaIngreso: null,
      tipoVinculacion: '',
      tipoContrato: '',
      direccionResidencia: '',
      ciudadResidencia: '',
      nombreDptoResidencia: '',
      telefono: '',
      medioAComunicar: '',
      lawyer: '',
    });
    typeOfCRUDAction === 'edit' && setIsDisabled(currentUser === roles.ventanillaUnica);
    getTiposDocumental();
    getCargos();
    getProfesionales();
    getAllExpendientes();
    callEndpoint(getAllPublicDefenders()).then((response) => {
      response?.success && setLawyers(response.data);
    });
    if (recepcionarSolicitudData?.expediente !== 0) {
      setNumeroExpediente(recepcionarSolicitudData?.expediente.toString());
      setBotonGenerar(true);
    } else {
      getNumeroExpediente();
      setBotonGenerar(false);
    }
  }, [recepcionarSolicitudData?.expediente]);

  useEffect(() => {
    callEndpoint(getAllDisciplined()).then((response) => {
      response?.success && setAllDisciplined(response.data);
    });
    if (recepcionarSolicitudData?.disciplined) {
      setFuncionarios(recepcionarSolicitudData?.disciplined);
      setDisciplined(recepcionarSolicitudData?.disciplined);
    }
    recepcionarSolicitudData?.proceedingsNumbers?.forEach((element: any) => {
      getExpendienteById(element);
    });
  }, [recepcionarSolicitudData?.disciplined]);

  const getNumeroExpediente = () => {
    callEndpoint(createProceedings())
      .then((response) => {
        response.success && setNumeroExpediente(response.data);
        if (recepcionarSolicitudData?.expediente === 0) setBotonLimpiar(true);
        setRecepcionarSolicitudData({ ...recepcionarSolicitudData, expediente: `${response.data}` });
        setBotonGenerar(true);
      })
      .catch((error) => showToast('error', 'Ocurrió un error cargando la petición', 'Contacte a soporte técnico'));
  };

  const getTiposDocumental = async () => {
    try {
      const response = await callEndpoint(getAllRequestTypes());
      response.success &&
        setTipoDocumentalList(response.data.filter((row: any) => row.typeReqState?.toString().includes(true)));
    } catch (error) {
      showToast('error', 'Ocurrió un error cargando la petición', 'Contacte a soporte técnico');
    }
  };

  const getAllExpendientes = async () => {
    try {
      const response = await callEndpoint(getExpendientes());
      response.success && setAllExpedientes(response?.data);
    } catch (error) {
      showToast('error', 'Ocurrió un error cargando la petición', 'Contacte a soporte técnico');
    }
  };

  const getExpendienteById = async (id: any) => {
    try {
      const response = await callEndpoint(getExpendientesById(id));
      response.success && setRequestsAsigned([...requestsAsigned, response?.data]);
      setRecepcionarSolicitudData({
        ...recepcionarSolicitudData,
        proceedingsNumbers: [...requestsAsigned, response?.data],
      });
      //   setRecepcionarSolicitudData({
      //     ...response?.data,
      //     asunto: response?.data?.subject,
      //     medioComunicar: response?.data?.comunicationChannelSelected,
      //   });
      // setDocFiles([...docFiles, ...response?.data?.attachments]);
      // setRequestSelected({
      //   ...recepcionarSolicitudData,
      //   id: response?.data?.id,
      // });
    } catch (error) {
      showToast('error', 'Ocurrió un error cargando la petición', 'Contacte a soporte técnico');
    }
  };

  const getCargos = async () => {
    const response = await positionMock;
    setPosition(response.data);
  };

  const getProfesionales = async () => {
    try {
      const response = await callEndpoint(getAllWebUsers());
      let data = [{ id: null, userName: 'Defecto' }];
      if (currentUser === roles.directorInstruccion) {
        response.data
          .filter(
            (row: any) =>
              row.userState.toString().includes(true) &&
              (row?.userRole?.roleName?.toString().includes('Profesional I, II, III/Abogados') ||
                row?.userRole?.roleName?.toString().includes('Secretaria Comun de Instruccion')),
          )
          .map((row: any) => data.push(row));
        response.success && setProfesionales(response.data);
      } else {
        response.data.filter((row: any) => row.userState.toString().includes(true)).map((row: any) => data.push(row));
        response.success && setProfesionales(data);
      }
    } catch (error) {
      showToast('error', 'Ocurrió un error realizando la consulta', 'Contacte a soporte técnico');
    }
  };

  const validateEmail = (email: any) => {
    return !validEmail.test(email);
  };

  const handleCorreo = (e: any) => {
    const correo = e.target.value;
    setRecepcionarSolicitudData({ ...recepcionarSolicitudData, correo });
    if (!validateEmail(correo)) {
      setEmailError('');
    } else {
      setEmailError('Nota: Ingrese un correo válido.');
    }
  };

  const validateEmailDisciplinados = (email: any) => {
    return !validEmail.test(email);
  };

  const handleCorreoDisciplinados = (e: any) => {
    const correo = e.target.value;
    setInfoDisciplinados({ ...infoDisciplinados, email: correo });
    if (!validateEmailDisciplinados(correo)) {
      setEmailErrorDisciplinados('');
    } else {
      setEmailErrorDisciplinados('Nota: Ingrese un correo válido.');
    }
  };

  return (
    <>
      {/* Radicado */}

      {currentUser !== roles.ventanillaUnica && (
        <div className="space-y-6 sm:space-y-5">
          <div className="xs:col-span-3">
            <label className="block text-xs font-medium text-gray-700">Nº de Radicado</label>
            <input
              type="text"
              value={recepcionarSolicitudData.radicado}
              disabled={!(currentUser === roles.ventanillaUnica || currentUser === roles.secretariaComunInstruccion)}
              onChange={(e: any) =>
                setRecepcionarSolicitudData({ ...recepcionarSolicitudData, radicado: e.target.value })
              }
              name="radicado"
              id="radicado"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
        </div>
      )}
      {currentUser === roles.ventanillaUnica && (
        <div className="flex gap-4">
          <div className="space-y-6 sm:space-y-5">
            <div className="xs:col-span-3">
              <label className="block text-xs font-medium text-gray-700">Nº de Radicado</label>
              <input
                type="text"
                value={recepcionarSolicitudData.radicado}
                disabled={!(currentUser === roles.ventanillaUnica || currentUser === roles.secretariaComunInstruccion)}
                onChange={(e: any) =>
                  setRecepcionarSolicitudData({ ...recepcionarSolicitudData, radicado: e.target.value })
                }
                name="radicado"
                id="radicado"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="pt-5">
            <button
              type="button"
              onClick={() => {
                getNumeroExpediente();
              }}
              disabled
              className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Generar
            </button>
          </div>
        </div>
      )}

      {currentUser !== roles.ventanillaUnica && (
        <>
          {/* Nº Expediente */}
          {recepcionarSolicitudData.tipoDocumental !== 'Memorando' &&
            recepcionarSolicitudData.tipoDocumental !== 'Oficio' &&
            recepcionarSolicitudData.tipoDocumental !== 'Solicitud Administrativa' &&
            recepcionarSolicitudData.tipoDocumental !== 'Recurso Apelación' && (
              <>
                <div className="space-y-6 sm:space-y-5">
                  <div className="xs:col-span-3">
                    <label className="block text-xs font-medium text-gray-700">Nº de Expediente</label>
                    <input
                      type="text"
                      readOnly
                      value={numeroExpediente}
                      placeholder={numeroExpediente}
                      disabled={true}
                      name="expediente"
                      id="expediente"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex pt-5">
                  {numeroExpediente === '0' && (
                    <button
                      type="button"
                      onClick={() => {
                        getNumeroExpediente();
                      }}
                      className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Crear
                    </button>
                  )}
                  {numeroExpediente !== '0' && (
                    <button
                      type="button"
                      onClick={() => {
                        setNumeroExpediente('0');
                      }}
                      className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </>
            )}
          {recepcionarSolicitudData.tipoDocumental === 'Memorando' && (
            <>
              <div className="space-y-6 sm:space-y-5">
                <div className="xs:col-span-3">
                  <label className="block text-xs font-medium text-gray-700">Nº de Expediente</label>
                  <input
                    type="search"
                    value={numeroExpediente}
                    placeholder={numeroExpediente}
                    onChange={(e: any) => setNumeroExpediente(e.target.value)}
                    disabled={false}
                    list="expedientes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <datalist id="expedientes">
                    {allExpedientes.map((expediente: any) => {
                      return <option value={expediente.expediente} />;
                    })}
                  </datalist>
                </div>
              </div>
              <div className="col-span-1 items-baseline mt-5">
                <button
                  type="button"
                  onClick={() => {
                    getExpendienteById(numeroExpediente);
                  }}
                  className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agregar
                </button>
              </div>
            </>
          )}
          {recepcionarSolicitudData.tipoDocumental === 'Oficio' && (
            <>
              <div className="space-y-6 sm:space-y-5">
                <div className="xs:col-span-3">
                  <label className="block text-xs font-medium text-gray-700">Nº de Expediente</label>
                  <input
                    type="search"
                    value={numeroExpediente}
                    placeholder={numeroExpediente}
                    onChange={(e: any) => setNumeroExpediente(e.target.value)}
                    disabled={false}
                    list="expedientes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <datalist id="expedientes">
                    {allExpedientes.map((expediente: any) => {
                      return <option value={expediente.expediente} />;
                    })}
                  </datalist>
                </div>
              </div>
              <div className="col-span-1 items-baseline mt-5">
                <button
                  type="button"
                  onClick={() => {
                    getExpendienteById(numeroExpediente);
                  }}
                  className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agregar
                </button>
              </div>
            </>
          )}
          {recepcionarSolicitudData.tipoDocumental === 'Solicitud Administrativa' && (
            <>
              <div className="space-y-6 sm:space-y-5">
                <div className="xs:col-span-3">
                  <label className="block text-xs font-medium text-gray-700">Nº de Expediente</label>
                  <input
                    type="search"
                    value={numeroExpediente}
                    placeholder={numeroExpediente}
                    onChange={(e: any) => setNumeroExpediente(e.target.value)}
                    disabled={false}
                    list="expedientes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <datalist id="expedientes">
                    {allExpedientes.map((expediente: any) => {
                      return <option value={expediente.expediente} />;
                    })}
                  </datalist>
                </div>
              </div>
              <div className="col-span-1 items-baseline mt-5">
                <button
                  type="button"
                  onClick={() => {
                    getExpendienteById(numeroExpediente);
                  }}
                  className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agregar
                </button>
              </div>
            </>
          )}
          {recepcionarSolicitudData.tipoDocumental === 'Recurso Apelación' && (
            <>
              <div className="space-y-6 sm:space-y-5">
                <div className="xs:col-span-3">
                  <label className="block text-xs font-medium text-gray-700">Nº de Expediente</label>
                  <input
                    type="search"
                    value={numeroExpediente}
                    placeholder={numeroExpediente}
                    onChange={(e: any) => setNumeroExpediente(e.target.value)}
                    disabled={false}
                    list="expedientes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <datalist id="expedientes">
                    {allExpedientes.map((expediente: any) => {
                      return <option value={expediente.expediente} />;
                    })}
                  </datalist>
                </div>
              </div>
              <div className="col-span-1 items-baseline mt-5">
                <button
                  type="button"
                  onClick={() => {
                    getExpendienteById(numeroExpediente);
                  }}
                  className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agregar
                </button>
              </div>
            </>
          )}
          {/* Tipo Documental */}
          <div className=" space-y-6 sm:space-y-5">
            <div className="xs:col-span-3">
              <label className="block text-xs font-medium text-gray-700">
                Tipo Documental <span className="text-xs text-primary">(Obligatorio)</span>
              </label>
              <select
                id="documentalType"
                name="documentalType"
                autoComplete="documentalType"
                disabled={isDisabled}
                value={recepcionarSolicitudData.tipoDocumental}
                onChange={(e: any) =>
                  setRecepcionarSolicitudData({ ...recepcionarSolicitudData, tipoDocumental: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                <option value="true">Defecto</option>
                {tipoDocumentalList?.map((item: any) => (
                  <option key={item.id} value={item.typeReqName}>
                    {item.typeReqName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Calidad del solicitante */}
          <div className="space-y-6 sm:space-y-5">
            <div className="xs:col-span-3">
              <label className="block text-xs font-medium text-gray-700">Calidad del Solicitante</label>
              <select
                id="calidadSolicitante"
                name="calidadSolicitante"
                autoComplete="calidadSolicitante"
                disabled={isDisabled}
                value={recepcionarSolicitudData.calidadSolicitante}
                onChange={(e: any) =>
                  setRecepcionarSolicitudData({ ...recepcionarSolicitudData, calidadSolicitante: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                <option value="default">Defecto</option>
                <option value="informante">Informante</option>
                <option value="anonimo">Anónimo</option>
                <option value="remitente">Remitente</option>
                <option value="opoderado">Apoderado</option>
              </select>
            </div>
          </div>
          {recepcionarSolicitudData.tipoDocumental === 'Queja' && (
            <div className="space-y-6 sm:space-y-5">
              <div className="xs:col-span-3">
                <label className="block text-xs font-medium text-gray-700">Cumplimiento de los hechos</label>
                <input
                  type="date"
                  id="fechaCumplimiento"
                  name="fechaCumplimiento"
                  disabled={isDisabled}
                  value={new Date(recepcionarSolicitudData?.complianceFacts).toISOString().split('T')[0]}
                  onChange={(e: any) => {
                    setRecepcionarSolicitudData({ ...recepcionarSolicitudData, complianceFacts: e.target.value });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
            </div>
          )}
          {(recepcionarSolicitudData.tipoDocumental === 'Queja' ||
            recepcionarSolicitudData.tipoDocumental === 'Informe' ||
            recepcionarSolicitudData.tipoDocumental === 'Anónimo') && (
            <>
              <p className="col-span-6 mt-5 text-primary font-medium text-sm">Disciplinados</p>
              <div className="flex overflow-x-auto col-span-6 gap-4 items-end pb-5">
                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Identificación</label>
                  <input
                    id="disciplinadosData"
                    disabled={isDisabled}
                    name="identificacion"
                    autoComplete="identificacion"
                    value={infoDisciplinados.identificacion}
                    onChange={(e: any) => {
                      setInfoDisciplinados({ ...infoDisciplinados, identificacion: e.target.value });
                      allDisciplined.map((disc: any) => {
                        if (disc.identificacion === e.target.value) {
                          setInfoDisciplinados(disc);
                        }
                      });
                    }}
                    type="search"
                    list="disciplinadosDataa"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <datalist id="disciplinadosDataa">
                    {allDisciplined.map((disc: any) => {
                      return <option value={disc.identificacion} />;
                    })}
                  </datalist>
                </div>
                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Número de registro</label>
                  <input
                    disabled={isDisabled}
                    autoComplete="numeroRegistro"
                    value={infoDisciplinados.numeroRegistro}
                    onChange={(e: any) => {
                      setInfoDisciplinados({ ...infoDisciplinados, numeroRegistro: e.target.value });
                      allDisciplined.map((disc: any) => {
                        if (disc.numeroRegistro === e.target.value) {
                          setInfoDisciplinados(disc);
                        }
                      });
                    }}
                    type="search"
                    name="numeroRegistro"
                    id="numeroRegistro"
                    list="numeroRegistroDataa"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <datalist id="numeroRegistroDataa">
                    {allDisciplined.map((disc: any) => {
                      return <option value={disc.numeroRegistro} />;
                    })}
                  </datalist>
                </div>
                {/* Nombre del funcionario */}
                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Nombre</label>
                  <input
                    value={infoDisciplinados.name}
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, name: e.target.value })}
                    type="text"
                    disabled
                    name="fullname"
                    id="fullname"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Primer apellido</label>
                  <input
                    disabled
                    value={infoDisciplinados.primerApellido}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, primerApellido: e.target.value })
                    }
                    type="text"
                    name="primerApellido"
                    id="primerApellido"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Segundo apellido</label>
                  <input
                    disabled
                    value={infoDisciplinados.segundoApellido}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, segundoApellido: e.target.value })
                    }
                    type="text"
                    name="segundoApellido"
                    id="segundoApellido"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                {/* Cargo */}
                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Cargo</label>
                  <input
                    type="text"
                    id="cargo"
                    disabled
                    name="cargo"
                    autoComplete="cargo"
                    value={infoDisciplinados.cargo}
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, cargo: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                {/* Dependecia */}
                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Dependencia</label>
                  <input
                    value={infoDisciplinados.dependencia}
                    disabled
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, dependencia: e.target.value })}
                    type="text"
                    name="dependecia"
                    id="dependecia"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    disabled
                    autoComplete="email"
                    value={infoDisciplinados.email}
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, email: e.target.value })}
                    type="text"
                    name="email"
                    id="email"
                    pattern="[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                  <span className="text-primary text-xs font-bold">{emailErrorDisciplinados}</span>
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Fecha ingreso</label>
                  <input
                    disabled
                    value={infoDisciplinados.fechaIngreso}
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, fechaIngreso: e.target.value })}
                    type="date"
                    name="fechaIngreso"
                    id="fechaIngreso"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>
                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Tipo vinculación</label>
                  <input
                    disabled
                    autoComplete="tipoVinculacion"
                    value={infoDisciplinados.tipoVinculacion}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, tipoVinculacion: e.target.value })
                    }
                    type="text"
                    name="tipoVinculacion"
                    id="tipoVinculacion"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Tipo contrato</label>
                  <input
                    disabled
                    autoComplete="tipoContrato"
                    value={infoDisciplinados.tipoContrato}
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, tipoContrato: e.target.value })}
                    type="text"
                    name="tipoContrato"
                    id="tipoContrato"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Dirección contrato</label>
                  <input
                    disabled
                    value={infoDisciplinados.direccionContrato}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, direccionContrato: e.target.value })
                    }
                    type="text"
                    name="direccionContrato"
                    id="direccionContrato"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Dirección residencia</label>
                  <input
                    disabled
                    value={infoDisciplinados.direccionResidencia}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, direccionResidencia: e.target.value })
                    }
                    type="text"
                    name="direccionResidencia"
                    id="direccionResidencia"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Ciudad residencia</label>
                  <input
                    disabled
                    value={infoDisciplinados.ciudadResidencia}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, ciudadResidencia: e.target.value })
                    }
                    type="text"
                    name="ciudadResidencia"
                    id="ciudadResidencia"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Departamento de residencia</label>
                  <input
                    disabled
                    value={infoDisciplinados.nombreDptoResidencia}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, nombreDptoResidencia: e.target.value })
                    }
                    type="text"
                    name="nombreDptoResidencia"
                    id="nombreDptoResidencia"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Teléfonos</label>
                  <input
                    disabled
                    value={infoDisciplinados.telefono}
                    onChange={(e: any) => setInfoDisciplinados({ ...infoDisciplinados, telefono: e.target.value })}
                    type="number"
                    name="telefono"
                    id="telefono"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Medio a comunicar</label>
                  <select
                    id="medioAComunicar"
                    name="medioAComunicar"
                    autoComplete="medioAComunicar"
                    value={infoDisciplinados.medioAComunicar}
                    onChange={(e: any) =>
                      setInfoDisciplinados({ ...infoDisciplinados, medioAComunicar: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value={null}>-Seleccione-</option>
                    <option value="fisico">Físico</option>
                    <option value="email">Correo electrónico</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>

                <div className="min-w-max">
                  <label className="block text-xs font-medium text-gray-700">Apoderado</label>
                  <select
                    id="lawyer"
                    name="lawyer"
                    autoComplete="lawyer"
                    value={infoDisciplinados.lawyer}
                    onChange={(e: any) =>
                      setInfoDisciplinados({
                        ...infoDisciplinados,
                        lawyer: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value={null}>-Seleccione-</option>
                    {lawyers.map((lawyer: any) => (
                      <option key={lawyer.id} value={lawyer.id}>
                        {lawyer.publicDefenderName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 items-baseline my-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        infoDisciplinados.identificacion !== '' &&
                        infoDisciplinados.medioAComunicar &&
                        infoDisciplinados.numeroRegistro !== '' &&
                        infoDisciplinados.lawyer
                      ) {
                        setFuncionarios([
                          ...funcionarios,
                          { ...infoDisciplinados, isDisciplined: 'false', requestHeader: requestHeader },
                        ]);
                        setDisciplined([
                          ...funcionarios,
                          { ...infoDisciplinados, isDisciplined: 'true', requestHeader: requestHeader },
                        ]);
                        setInfoDisciplinados({
                          name: '',
                          fechaIngreso: null,
                          primerApellido: '',
                          segundoApellido: '',
                          identificacion: '',
                          numeroRegistro: '',
                          cargo: '',
                          dependencia: '',
                          direccionContrato: '',
                          direccionResidencia: '',
                          ciudadResidencia: '',
                          nombreDptoResidencia: '',
                          telefono: '',
                          medioAComunicar: null,
                          email: '',
                          tipoVinculacion: '',
                          tipoContrato: '',
                          lawyer: null,
                        });
                      } else {
                        showToast('error', 'Por favor diligencie todos los campos');
                      }
                    }}
                    className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Agregar
                  </button>
                </div>
              </div>
              <div className="my-2 border col-span-6 p-5">
                {funcionarios?.map((funcionario: any, index: any) => (
                  <div className="flex overflow-x-auto col-span-6 gap-4 items-center pb-5 w-full justify-between">
                    <div className="col-span-2">
                      <p>{funcionario.identificacion}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.name}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.primerApellido}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.segundoApellido}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.cargo}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.dependencia}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{moment(funcionario.fechaIngreso).format('DD - MM - YYYY')}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.numeroRegistro}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.tipoVinculacion}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.tipoContrato}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.direccionContrato}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.direccionResidencia}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.ciudadResidencia}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.nombreDptoResidencia}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.telefono}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{funcionario.medioAComunicar}</p>
                    </div>
                    <div className="col-span-2">
                      <p>
                        {funcionario?.lawyer?.publicDefenderName ||
                          lawyers?.find((lawyer: any) => lawyer.id === funcionario.lawyer)?.publicDefenderName}
                      </p>
                    </div>
                    <div className="col-span-1 my-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const newFuncionarios = funcionarios.filter((item: any) => item !== funcionario);
                          setFuncionarios(newFuncionarios);
                          setDisciplined(newFuncionarios);
                        }}
                        className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <Tooltip title={'Delete Funcionario'}>
                          <i className="uil uil-trash-alt text-2xl"></i>
                        </Tooltip>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Se describen los hechos */}
              {/* <div className="space-y-6 sm:space-y-5">
                <div className="xs:col-span-3">
                  <label className="block text-xs font-medium text-gray-700">¿Se describieron los hechos?</label>
                  <select
                    id="describieronHechos"
                    name="describieronHechos"
                    disabled={isDisabled}
                    autoComplete="describieronHechos"
                    value={recepcionarSolicitudData.describieronHechos}
                    onChange={(e: any) =>
                      setRecepcionarSolicitudData({ ...recepcionarSolicitudData, describieronHechos: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  >
                    <option value="yes">Si</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div> */}
            </>
          )}
        </>
      )}
      {/* Nombre del solicitante */}
      <p className="col-span-6 mt-5 text-primary font-medium text-sm">
        Solicitante: {recepcionarSolicitudData?.nombreSolicitante}
      </p>
      <div className="space-y-6 sm:space-y-5">
        <div className="xs:col-span-3">
          <label className="block text-xs font-medium text-gray-700">Nombre del Solicitante</label>
          <input
            value={recepcionarSolicitudData.nombreSolicitante}
            onChange={(e: any) =>
              setRecepcionarSolicitudData({ ...recepcionarSolicitudData, nombreSolicitante: e.target.value })
            }
            type="text"
            name="nombreSolicitante"
            id="nombreSolicitante"
            disabled={isDisabled}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>
      <div className="space-y-6 sm:space-y-5">
        <div className="xs:col-span-3">
          <label className="block text-xs font-medium text-gray-700">Cédula del Solicitante</label>
          <input
            value={recepcionarSolicitudData.cedulaSolicitante}
            onChange={(e: any) =>
              setRecepcionarSolicitudData({ ...recepcionarSolicitudData, cedulaSolicitante: e.target.value })
            }
            type="number"
            name="cedulaSolicitante"
            id="cedulaSolicitante"
            disabled={isDisabled}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>
      {/* Medio a Comunicar */}
      {recepcionarSolicitudData.calidadSolicitante !== 'anonimo' && (
        <div className="space-y-6 sm:space-y-5">
          <div className="xs:col-span-3">
            <label className="block text-xs font-medium text-gray-700">Medio a Comunicar</label>
            <select
              id="medioComunicar"
              name="medioComunicar"
              autoComplete="medioComunicar"
              disabled={isDisabled}
              value={`${recepcionarSolicitudData.medioComunicar}`}
              onChange={(e: any) =>
                setRecepcionarSolicitudData({ ...recepcionarSolicitudData, medioComunicar: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            >
              <option value={null}>Defecto</option>
              <option value="personal">Personal</option>
              <option value="informante">Correo Electrónico</option>
              <option value="anonimo">Personal y Correo Electrónico</option>
            </select>
          </div>
        </div>
      )}
      {(recepcionarSolicitudData.medioComunicar === 'personal' ||
        recepcionarSolicitudData.medioComunicar === 'anonimo') && (
        <>
          {/* Dirección de Correspondencia */}
          <div className="space-y-6 sm:space-y-5">
            <div className="xs:col-span-3">
              <label className="block text-xs font-medium text-gray-700">Dirección de Correspondencia</label>
              <input
                value={recepcionarSolicitudData.direccionCorrespondencia}
                onChange={(e: any) =>
                  setRecepcionarSolicitudData({ ...recepcionarSolicitudData, direccionCorrespondencia: e.target.value })
                }
                disabled={isDisabled}
                type="text"
                name="first-name"
                id="first-name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>
          </div>
        </>
      )}
      {(recepcionarSolicitudData.medioComunicar === 'informante' ||
        recepcionarSolicitudData.medioComunicar === 'anonimo') && (
        <>
          {/* correo electronico */}
          <div className="space-y-6 sm:space-y-5">
            <div className="xs:col-span-3">
              <label className="block text-xs font-medium text-gray-700">Correo Electrónico</label>
              <input
                value={recepcionarSolicitudData.correo}
                disabled={isDisabled}
                onChange={(e) => handleCorreo(e)}
                type="email"
                pattern="[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
                name="first-name"
                id="first-name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>
            <span className="text-primary text-xs font-bold">{emailError}</span>
          </div>
        </>
      )}
      {/* Telefónos */}
      <div className="space-y-6 sm:space-y-5">
        <div className="xs:col-span-3">
          <label className="block text-xs font-medium text-gray-700">Teléfono</label>
          <input
            value={recepcionarSolicitudData.telefono}
            disabled={isDisabled}
            onChange={(e: any) =>
              setRecepcionarSolicitudData({ ...recepcionarSolicitudData, telefono: e.target.value })
            }
            type="text"
            name="telefono"
            id="telefono"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      {/* Asignado a */}

      {(currentUser === roles.directorInstruccion || currentUser === roles.directorJuzgamiento) && (
        <div className="space-y-6 sm:space-y-5">
          <div className="xs:col-span-3">
            <label className="block text-xs font-medium text-gray-700">
              Asignado a <span className="text-xs text-primary">(Obligatorio)</span>
            </label>
            <select
              required
              id="userAgent"
              name="userAgent"
              autoComplete="userAgent"
              value={recepcionarSolicitudData.profesionalAsignado}
              onChange={(e: any) =>
                setRecepcionarSolicitudData({ ...recepcionarSolicitudData, profesionalAsignado: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            >
              {profesionales?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.userName} {item.userLastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {(currentUser === roles.secretariaComunInstruccion || currentUser === roles.secretariaComunJuzgamiento) && (
        <div className="space-y-6 sm:space-y-5">
          <div className="xs:col-span-3">
            <label className="block text-xs font-medium text-gray-700">
              Asignado a <span className="text-xs text-primary">(Obligatorio)</span>
            </label>
            <select
              required
              id="userAgent"
              name="userAgent"
              autoComplete="userAgent"
              value={recepcionarSolicitudData.profesionalAsignado}
              onChange={(e: any) =>
                setRecepcionarSolicitudData({ ...recepcionarSolicitudData, profesionalAsignado: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            >
              {profesionales?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.userName} {item.userLastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Asunto */}
      {currentUser !== roles.ventanillaUnica && (
        <div className="space-y-6 sm:space-y-5 border-0 border-white">
          <div className="xs:col-span-3">
            <label className="block text-xs font-medium text-gray-700">
              Descripción de los hechos <span className="text-xs text-primary">(Opcional)</span>
            </label>
            <textarea
              id="asunto"
              disabled={isDisabled}
              name="asunto"
              autoComplete="asunto"
              value={`${recepcionarSolicitudData.asunto}`}
              onChange={(e: any) =>
                setRecepcionarSolicitudData({ ...recepcionarSolicitudData, asunto: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
        </div>
      )}

      {requestsAsigned.length > 0 && (
        <>
          <div className="space-y-6 sm:space-y-5">
            <div className="xs:col-span-3">
              <label className="block text-primary font-medium text-sm my-4">Solicitudes Asignadas</label>
              {requestsAsigned?.map((item: any) => (
                <ul>
                  <li>
                    {item?.expediente} - {item?.nombreSolicitante}
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
