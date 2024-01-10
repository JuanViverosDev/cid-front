import Box from '@mui/material/Box';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { ModalViewer } from './modals/modalViewer';
import { createNofity } from '../../../services/notify.service';
import Swal from 'sweetalert2';
import { useFetchAndLoad } from '../../../hooks';
import moment from 'moment';

export const CrearComunicacion = (props: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const { title, state, request, attachments, documentPermissions } = props;
  const [receptores, setReceptores] = useState<string[]>([]);
  const [correo, setCorreo] = useState<string>('');
  const [openModalViewer, setOpenModalViewer] = useState(false);
  const [sourceAssets, setSourceAssets] = useState<any>({});
  const [emailQuejoso, setEmailQuejoso] = useState<string>('');
  const [attachmentsToSend, setAttachmentsToSend] = useState<any[]>([]);
  const [recipientsToSend, setRecipientsToSend] = useState<any[]>([]);

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
    request ? setEmailQuejoso(request?.correo) : setEmailQuejoso('');
  }, [request]);

  const handleOpenViewer = (source: any, fileType: any) => {
    setSourceAssets({ source, fileType });
    setOpenModalViewer(true);
  };

  const formatBytes = (bytes: any, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const sendNotify = async () => {
    const actualDate = new Date();
    const date = actualDate.getDate();
    const month = actualDate.getMonth() + 1;
    const year = actualDate.getFullYear();
    const dateToSend = moment(`${year}-${month}-${date}`).format('YYYY-MM-DD');

    let recipients = [];
    if (documentPermissions?.seComunicaDisciplinado) {
      request?.disciplined?.forEach((disciplined: any) => {
        if (disciplined?.medioAComunicar === 'email') {
          recipients.push(disciplined.email);
        }
        if (disciplined?.medioAComunicar === 'ambos') {
          recipients.push(disciplined.email);
        }
      });
    }

    if (documentPermissions?.seComunicaQuejoso) {
      if (request?.medioComunicar === 'informante' || request?.medioComunicar === 'anonimo')
        recipients.push(emailQuejoso);
    }

    let body = {
      data: [
        {
          documentId: documentPermissions?.id,
          fechaComunicacionDisciplinado: dateToSend,
          fechaNotificacionDisciplinado: dateToSend,
          fechaComunicacionFisicaDisciplinado: dateToSend,
          fechaNotificacionFisicaDisciplinado: dateToSend,
          fechaNotificacionQuejoso: dateToSend,
          fechaComunicacionQuejoso: dateToSend,
          recipients: recipients,
          attachmentsId: attachmentsToSend,
        },
      ],
    };

    try {
      const response = await callEndpoint(createNofity(body));
      if (response.success) {
        showToast('success', '¡Notificado!', 'Se ha enviado correctamente la notificación');
      } else {
        showToast('warning', 'Por favor revise la información suministrada', response.message);
      }
    } catch (error) {
      showToast('error', '¡Error!', 'Ha ocurrido un error');
    }
  };

  return (
    <>
      {documentPermissions?.seComunicaDisciplinado ||
      documentPermissions?.seNotificaDisciplinado ||
      documentPermissions?.seComunicaQuejoso ||
      documentPermissions?.seNotificaQuejoso ? (
        <>
          <Box className="px-5 py-5 bg-cidSecundaryGrey rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-cidPrimaryWhite bg-red-500 px-3 py-2 rounded-md">{title}</h2>
              <h3 className="text-md font-bold text-gray-700">Estado ({state})</h3>
            </div>
            {documentPermissions?.seComunicaQuejoso || documentPermissions?.seNotificaQuejoso ? (
              <>
                <h1 className="border-b-2 border-gray-700 py-2 mt-5 font-bold text-lg pl-4">Quejoso</h1>
                <div className="my-5">
                  <div className="grid grid-cols-4 bg-gray-300 py-4 px-5 rounded-lg items-center">
                    <div className="font-semibold">{request?.nombreSolicitante}</div>
                    {request?.medioComunicar === 'informante' && (
                      <div className="gap-5 grid grid-cols-3 items-center col-span-3">
                        {documentPermissions?.seNotificaQuejoso ? (
                          <div className="flex flex-col">
                            <div className="text-cidSecundaryBlack">Notificado por correo</div>
                            <input
                              type="date"
                              className=""
                              value={moment(documentPermissions?.fechaNotificacionQuejoso).format('YYYY-MM-DD')}
                              disabled={true}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-500">No se notifica</div>
                        )}
                        {documentPermissions?.seComunicaQuejoso ? (
                          <div className="flex flex-col">
                            <div>Comunicado por correo</div>
                            <input
                              type="date"
                              className=""
                              value={moment(documentPermissions?.fechaComunicacionQuejoso).format('YYYY-MM-DD')}
                              disabled={true}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-500">No se comunica</div>
                        )}
                        <>
                          <div className="flex flex-col">
                            <div>Correo Electrónico</div>
                            <input
                              type="email"
                              className=""
                              value={emailQuejoso}
                              onChange={(e) => setEmailQuejoso(e.target.value)}
                            />
                            <label className="text-xs text-gray-500">
                              Fecha envío:{' '}
                              {documentPermissions?.fechaComunicacionQuejoso
                                ? moment(documentPermissions?.fechaComunicacionQuejoso).format('YYYY-MM-DD')
                                : 'Aún sin enviar'}
                            </label>
                          </div>
                        </>
                      </div>
                    )}
                    {request?.medioComunicar === 'personal' && (
                      <div className="gap-5 grid grid-cols-3 items-center col-span-3 col-start-2">
                        {documentPermissions?.seNotificaQuejoso ? (
                          <div className="flex flex-col">
                            <div className="text-cidSecundaryBlack">Notificado por físico</div>
                            <input
                              type="date"
                              className=""
                              value={moment(documentPermissions?.fechaNotificacionFisicaQuejoso).format('YYYY-MM-DD')}
                              disabled={true}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-500">No se notifica</div>
                        )}
                        {documentPermissions?.seComunicaQuejoso ? (
                          <div className="flex flex-col">
                            <div>Comunicado por físico</div>
                            <input
                              type="date"
                              className=""
                              value={moment(documentPermissions?.fechaComunicacionFisicaQuejoso).format('YYYY-MM-DD')}
                              disabled={true}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-500">No se comunica</div>
                        )}
                      </div>
                    )}
                    {request?.medioComunicar === 'anonimo' && (
                      <>
                        <div className="gap-5 grid grid-cols-3 items-center col-span-3">
                          {documentPermissions?.seNotificaQuejoso ? (
                            <div className="flex flex-col">
                              <div className="text-cidSecundaryBlack">Notificado por correo</div>
                              <input
                                type="date"
                                className=""
                                value={moment(documentPermissions?.fechaNotificacionQuejoso).format('YYYY-MM-DD')}
                                disabled={true}
                              />
                            </div>
                          ) : (
                            <div className="text-gray-500">No se notifica</div>
                          )}
                          {documentPermissions?.seComunicaQuejoso ? (
                            <div className="flex flex-col">
                              <div>Comunicado por correo</div>
                              <input
                                type="date"
                                className=""
                                value={moment(documentPermissions?.fechaComunicacionQuejoso).format('YYYY-MM-DD')}
                                disabled={true}
                              />
                            </div>
                          ) : (
                            <div className="text-gray-500">No se comunica</div>
                          )}
                          <>
                            <div className="flex flex-col">
                              <div>Correo Electrónico</div>
                              <input
                                type="email"
                                className=""
                                value={emailQuejoso}
                                onChange={(e) => setEmailQuejoso(e.target.value)}
                              />
                              <label className="text-xs text-gray-500">
                                Fecha envío:{' '}
                                {documentPermissions?.fechaComunicacionQuejoso
                                  ? moment(documentPermissions?.fechaComunicacionQuejoso).format('YYYY-MM-DD')
                                  : 'Aún sin enviar'}
                              </label>
                            </div>
                          </>
                        </div>
                        <div className="gap-5 grid grid-cols-3 items-center col-span-3 col-start-2">
                          {documentPermissions?.seNotificaQuejoso ? (
                            <div className="flex flex-col">
                              <div className="text-cidSecundaryBlack">Notificado por físico</div>
                              <input
                                type="date"
                                className=""
                                value={moment(documentPermissions?.fechaNotificacionFisicaQuejoso).format('YYYY-MM-DD')}
                                disabled={true}
                              />
                            </div>
                          ) : (
                            <div className="text-gray-500">No se notifica</div>
                          )}
                          {documentPermissions?.seComunicaQuejoso ? (
                            <div className="flex flex-col">
                              <div>Comunicado por físico</div>
                              <input
                                type="date"
                                className=""
                                value={moment(documentPermissions?.fechaComunicacionFisicaQuejoso).format('YYYY-MM-DD')}
                                disabled={true}
                              />
                            </div>
                          ) : (
                            <div className="text-gray-500">No se comunica</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {request?.disciplined?.length >= 1 && (
              <>
                {documentPermissions.seNotificaDisciplinado || documentPermissions.seComunicaDisciplinado ? (
                  <>
                    <h1 className="border-b-2 border-gray-700 py-2 mt-5 font-bold text-lg pl-4">Disciplinados</h1>
                    {request?.disciplined?.map((disciplinado: any) => (
                      <div className="my-4">
                        <div className="grid grid-cols-4 items-center bg-gray-300 py-4 px-5 rounded-lg">
                          <div className="font-semibold">{disciplinado?.name}</div>
                          {disciplinado?.medioAComunicar === 'email' && (
                            <div className="gap-5 grid grid-cols-3 items-center col-span-3">
                              {documentPermissions?.seNotificaDisciplinado ? (
                                <div className="flex flex-col">
                                  <div className="text-cidSecundaryBlack">Notificado por correo</div>
                                  <input
                                    type="date"
                                    className=""
                                    value={moment(documentPermissions?.fechaNotificacionDisciplinado).format(
                                      'YYYY-MM-DD',
                                    )}
                                    disabled={true}
                                  />
                                </div>
                              ) : (
                                <div className="text-gray-500">No se notifica</div>
                              )}
                              {documentPermissions?.seComunicaDisciplinado ? (
                                <div className="flex flex-col">
                                  <div>Comunicado por correo</div>
                                  <input
                                    type="date"
                                    className=""
                                    value={moment(documentPermissions?.fechaComunicacionDisciplinado).format(
                                      'YYYY-MM-DD',
                                    )}
                                    disabled={true}
                                  />
                                </div>
                              ) : (
                                <div className="text-gray-500">No se comunica</div>
                              )}
                              <>
                                <div className="flex flex-col">
                                  <div>Correo Electrónico</div>
                                  <input type="email" className="" value={disciplinado?.email} />
                                  <label className="text-xs text-gray-500">
                                    Fecha envío:{' '}
                                    {documentPermissions?.fechaComunicacionDisciplinado
                                      ? moment(documentPermissions?.fechaComunicacionDisciplinado).format('YYYY-MM-DD')
                                      : 'Aún sin enviar'}
                                  </label>
                                </div>
                              </>
                            </div>
                          )}
                          {disciplinado?.medioAComunicar === 'fisico' && (
                            <div className="gap-5 grid grid-cols-3 items-center col-span-3 col-start-2">
                              {documentPermissions?.seNotificaDisciplinado ? (
                                <div className="flex flex-col">
                                  <div className="text-cidSecundaryBlack">Notificado por físico</div>
                                  <input
                                    type="date"
                                    className=""
                                    value={moment(documentPermissions?.fechaNotificacionFisicaDisciplinado).format(
                                      'YYYY-MM-DD',
                                    )}
                                    disabled={true}
                                  />
                                </div>
                              ) : (
                                <div className="text-gray-500">No se notifica</div>
                              )}
                              {documentPermissions?.seComunicaDisciplinado ? (
                                <div className="flex flex-col">
                                  <div>Comunicado por físico</div>
                                  <input
                                    type="date"
                                    className=""
                                    value={moment(documentPermissions?.fechaComunicacionFisicaDisciplinado).format(
                                      'YYYY-MM-DD',
                                    )}
                                    disabled={true}
                                  />
                                </div>
                              ) : (
                                <div className="text-gray-500">No se comunica</div>
                              )}
                            </div>
                          )}
                          {disciplinado?.medioAComunicar === 'ambos' && (
                            <>
                              <div className="gap-5 grid grid-cols-3 items-center col-span-3">
                                {documentPermissions?.seNotificaDisciplinado ? (
                                  <div className="flex flex-col">
                                    <div className="text-cidSecundaryBlack">Notificado por correo</div>
                                    <input
                                      type="date"
                                      className=""
                                      value={moment(documentPermissions?.fechaNotificacionDisciplinado).format(
                                        'YYYY-MM-DD',
                                      )}
                                      disabled={true}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-gray-500">No se notifica</div>
                                )}
                                {documentPermissions?.seComunicaDisciplinado ? (
                                  <div className="flex flex-col">
                                    <div>Comunicado por correo</div>
                                    <input
                                      type="date"
                                      className=""
                                      value={moment(documentPermissions?.fechaComunicacionDisciplinado).format(
                                        'YYYY-MM-DD',
                                      )}
                                      disabled={true}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-gray-500">No se comunica</div>
                                )}
                                <>
                                  <div className="flex flex-col">
                                    <div>Correo Electrónico</div>
                                    <input type="email" className="" value={disciplinado?.email} />
                                    <label className="text-xs text-gray-500">
                                      Fecha envío:{' '}
                                      {documentPermissions?.fechaComunicacionDisciplinado
                                        ? moment(documentPermissions?.fechaComunicacionDisciplinado).format(
                                            'YYYY-MM-DD',
                                          )
                                        : 'Aún sin enviar'}
                                    </label>
                                  </div>
                                </>
                              </div>
                              <div className="gap-5 grid grid-cols-3 items-center col-span-3 col-start-2">
                                {documentPermissions?.seNotificaDisciplinado ? (
                                  <div className="flex flex-col">
                                    <div className="text-cidSecundaryBlack">Notificado por físico</div>
                                    <input
                                      type="date"
                                      className=""
                                      value={moment(documentPermissions?.fechaNotificacionFisicaDisciplinado).format(
                                        'YYYY-MM-DD',
                                      )}
                                      disabled={true}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-gray-500">No se notifica</div>
                                )}
                                {documentPermissions?.seComunicaDisciplinado ? (
                                  <div className="flex flex-col">
                                    <div>Comunicado por físico</div>
                                    <input
                                      type="date"
                                      className=""
                                      value={moment(documentPermissions?.fechaComunicacionFisicaDisciplinado).format(
                                        'YYYY-MM-DD',
                                      )}
                                      disabled={true}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-gray-500">No se comunica</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            <h1 className="border-b-2 border-gray-700 py-2 mt-5 font-bold text-lg pl-4">Recursos</h1>
            {attachments?.length >= 1 ? (
              <>
                {attachments?.map((data: any, index: number) => (
                  <div key={index}>
                    <div className="items-center p-2 border-b-2 justify-between flex bg-gray-300 rounded-lg mt-4">
                      <div>
                        {/* <a target="_blank" rel="noreferrer"> */}
                        <i className="il uil-cloud-download text-lg text-monettaSecundayBlue" />
                        <span
                          onClick={() => handleOpenViewer(data.base64, data.fileType)}
                          className="ml-2 cursor-pointer text-cidSecundayBlue underline"
                        >
                          {data.fileName}
                        </span>
                        {/* </a> */}
                      </div>
                      <div>{formatBytes(data.base64.length)}</div>
                      <div className="mr-3 place-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-monettaSecundayBlue"
                          name="agreement"
                          id="agreement"
                          onChange={(e) => setAttachmentsToSend([...attachmentsToSend, data.id])}
                        />
                      </div>
                    </div>
                    {openModalViewer && (
                      <ModalViewer
                        setOpenModalViewer={setOpenModalViewer}
                        openModalViewer={openModalViewer}
                        sourceAssets={sourceAssets}
                      />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="my-5">
                <div className="gap-5 grid grid-cols-4 items-center">
                  <div>No hay recursos</div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-4 mt-10">
              {/* <button
                type="button"
                className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button> */}
              <button
                type="button"
                onClick={() => sendNotify()}
                className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Enviar
              </button>
              {/* <button
              type="button"
              className="col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Archivar
            </button> */}
            </div>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
