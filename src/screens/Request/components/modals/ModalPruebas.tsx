import { useState } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { UploadFileComponent } from '../UploadFileComponent';
import { ModalViewer } from './modalViewer';
import { FileUploader } from 'react-drag-drop-files';
import { Button, Tooltip } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};
const fileTypes = ['PNG', 'JPG', 'JPEG', 'PDF', 'MP4', 'MP3'];

export const ModalPruebas = ({
  modalPruebas,
  setModalPruebas,
  handleSubmit,
  requestSelected,
  setPruebasRequest,
  docFiles,
  setDocFiles,
  rolesByCode,
  userLogged,
}: any) => {
  const handleClose = () => setModalPruebas(false);

  const [optionPruebas, setOptionPruebas] = React.useState<any>([
    {
      name: 'Documentales',
      isCompleted: false,
    },
    {
      name: 'Testimoniales',
      isCompleted: false,
    },
    {
      name: 'Audiovisuales',
      isCompleted: false,
    },
    {
      name: 'Periciales',
      isCompleted: false,
    },
    {
      name: 'Visitas disciplinarias',
      isCompleted: false,
    },
    {
      name: 'otros',
      isCompleted: false,
    },
  ]);
  const [pruebas, setPruebas] = React.useState<any>([]);
  const [otros, setOtros] = React.useState<any>('');
  let arregloDeImagenes: any[] = [];
  const [archivos, setArchivos] = useState<any>([]);
  const [openModalViewer, setOpenModalViewer] = useState(false);
  const [sourceAssets, setSourceAssets] = useState({ source: '', fileType: '' });

  const uploadImage = async (files: any) => {
    //Fuente original
    arregloDeImagenes = [...files];

    const imagenesConvertidasaBase64: any[] = [];

    for (let i = 0; i < arregloDeImagenes.length; i++) {
      let imagen = await parseFileData(arregloDeImagenes[i]);
      imagenesConvertidasaBase64.push(imagen);
    }
    if (archivos?.length > 0) {
      setArchivos([...archivos, ...imagenesConvertidasaBase64]);
      setDocFiles([...archivos, ...imagenesConvertidasaBase64]);
    } else {
      setArchivos([...imagenesConvertidasaBase64]);
      setDocFiles([...imagenesConvertidasaBase64]);
    }
  };

  const eliminar = (fileDelete: any) => {
    const newArchivos = archivos.filter((file: any) => file.fileName !== fileDelete.fileName);
    setArchivos(newArchivos);
    setDocFiles(newArchivos);
  };

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

  const parseFileData = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve({ fileName: file.name, size: file.size, base64: fileReader.result, fileType: file.type });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  React.useEffect(() => {
    if (requestSelected && requestSelected?.pruebas) {
      setPruebas(requestSelected?.pruebas);
      if (requestSelected?.pruebas?.find((prueba: any) => prueba.name === 'otros')) {
        setOtros(requestSelected?.pruebas?.find((prueba: any) => prueba.name === 'otros')?.content);
      }
    }
  }, [requestSelected]);

  React.useEffect(() => {
    if (pruebas && pruebas.length > 0) {
      setPruebasRequest(pruebas);
    }
  }, [pruebas]);

  console.log('pruebas', pruebas)

  return (
    <div>
      <Modal
        open={modalPruebas}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid grid-cols-1  gap-4 pt-0">
            {/* Asunto */}
            <div className="space-y-6 sm:space-y-5 border-0 border-white">
              <p>
                <span className="text-xs font-medium text-cidTertiaryLightPurple">Pruebas a aplicar:</span>
              </p>
              <div className="xs:col-span-3 flex gap-10 overflow-x-scroll">
                {optionPruebas?.map((prueba: any, index: number) => (
                  <div className="xs:col-span-3 flex items-center gap-2" key={index}>
                    <input
                      type="checkbox"
                      checked={pruebas.find((prueba2: any) => prueba2.name === prueba.name)}
                      onChange={(e): any => {
                        const newPruebas = [...pruebas];
                        if (e.target.checked) {
                          newPruebas.push({
                            name: prueba.name,
                            isCompleted: false,
                          });
                          setPruebas(newPruebas);
                        } else {
                          setPruebas(newPruebas.filter((prueba1: any) => prueba1.name !== prueba.name));
                        }
                      }}
                    />
                    <label className="block text-xs font-medium text-gray-700">{prueba.name}</label>
                  </div>
                ))}
              </div>
              {pruebas.find((prueba: any) => prueba.name === 'otros') && (
                <div className="xs:col-span-3">
                  <label className="block text-xs font-medium text-gray-700">
                    Otras (Opcional)
                  </label>
                  <textarea
                    id="subject"
                    name="subject"
                    rows={4}
                    autoComplete="subject"
                    value={otros}
                    onChange={(e): any => {
                      setOtros(e.target.value);
                      if (e.target.value.length > 0) {
                        const newPruebas = optionPruebas.map((prueba: any) => {
                          if (prueba.name === 'otros') {
                            return {
                              name: 'otros',
                              isCompleted: false,
                              content: e.target.value,
                            };
                          }
                          return prueba;
                        });
                        setPruebas(newPruebas);
                      } else {
                        const newPruebas = [...pruebas];
                        setPruebas(newPruebas.filter((prueba: any) => prueba.name !== 'otros'));
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>
              )}
              <p>
                <span className="text-xs font-medium text-cidTertiaryLightPurple">Pruebas Completadas:</span>
              </p>
              <div className="xs:col-span-3 flex gap-10 overflow-x-scroll">
                {pruebas?.map((prueba: any, index: number) => (
                  <div className="xs:col-span-3 flex items-center gap-2" key={index}>
                    <input
                      type="checkbox"
                      checked={prueba.isCompleted}
                      onChange={(e): any => {
                        const newPruebas = [...pruebas];
                        if (e.target.checked) {
                          newPruebas[index].isCompleted = true;
                          setPruebas(newPruebas);
                        } else {
                          newPruebas[index].isCompleted = false;
                          setPruebas(newPruebas);
                        }
                      }}
                    />
                    <label className="block text-xs font-medium text-gray-700">{prueba.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div>
              <div className="grid grid-cols-1 grid-flow-col gap-4">
                <FileUploader
                  multiple={true}
                  classes={'widthDragAndDrop, widthDragAndDrop'}
                  handleChange={uploadImage}
                  name="file"
                  label={'Drag a file here (PNG or MP4)'}
                  types={fileTypes}
                />
                <div className="place-self-center hidden">
                  <Button
                    size="small"
                    style={{
                      backgroundColor: '#3ECE80',
                    }}
                    /* onClick={handleOpen} */
                  >
                    <Tooltip title={'Save Changes'}>
                      <i className="uil uil-save text-white text-2xl"></i>
                    </Tooltip>
                  </Button>
                </div>
              </div>
              {archivos?.map((data: any, index: number) => (
                <div key={index}>
                  <div className="items-center p-2 border-b-2 justify-between  flex">
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
            </div>
          </div>

          <div className="pt-5 bottom-0 bg-white left-0 right-0 pr-0">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setPruebasRequest(pruebas);
                  handleSubmit();
                  handleClose();
                }}
                className="bg-primary py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white  "
              >
                Guardar
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
