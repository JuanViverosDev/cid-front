import { Button, Tooltip } from '@mui/material';

export const ShowFiles = ({ docFiles }: any) => {
  return (
    <>
      {docFiles.map((data: any, index: number) => (
        <div key={index} className="items-center p-2 border-b-2 justify-between  flex">
          <div>
            {/* <a target="_blank" rel="noreferrer"> */}
            <i className="il uil-cloud-download text-lg text-monettaSecundayBlue" />
            <span className="ml-2">{data.fileName}</span>
            {/* </a> */}
          </div>
          {/* <div>{moment(data.createdAt).format('YY-MM-DD HH:MM:ss')}</div> */}
          <div className="mr-3 place-items-center">
            <Button
              size="small"
              variant="outlined"
              style={{
                maxWidth: '30px',
                maxHeight: '30px',
                minWidth: '30px',
                minHeight: '30px',
              }}
            >
              <Tooltip title={'Delete Document'}>
                <i className="uil uil-trash-alt text-cidTertiaryLightPurple text-2xl"></i>
              </Tooltip>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
