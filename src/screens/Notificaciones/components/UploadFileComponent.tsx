import { Button, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { ModalViewer } from './modalViewer';
// 'XLS', 'XLSX', 'DOC', 'PPT', 'JPEG', 'MP4', 'MOV'
const fileTypes = ['PNG', 'JPG', 'JPEG', 'PDF', 'MP4', 'MP3'];

export const UploadFileComponent = ({ setDocFiles, docFiles, dataRequest }: any) => {
  let arregloDeImagenes: any[] = [];
  const [archivos, setArchivos] = useState<any>([]);
  const [openModalViewer, setOpenModalViewer] = useState(false);
  const [sourceAssets, setSourceAssets] = useState({ source: '', fileType: '' });

  useEffect(() => {
    setArchivos(docFiles);
  }, [docFiles]);

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
        resolve({ fileName: file.name, size: file.size, base64: fileReader.result, fileType: file.type, ...dataRequest });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
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
            <div>
              <i onClick={() => eliminar(data)} className="uil uil-trash-alt text-lg text-monettaSecundayBlue" />
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
    </div>
  );
};
