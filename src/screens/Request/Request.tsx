import { Box, Tab, Tabs, Typography } from '@mui/material';
//DataGrid import

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

//SVG Icon
/* import iconSearch from "../../assets/images/svg/iconSearch.svg";
import iconEdit from "../../assets/images/svg/iconEdit.svg";
import iconLock from "../../assets/images/svg/iconLock.svg";
import iconLockOpen from "../../assets/images/svg/iconLockOpen.svg"; */
//Components
import { Titles } from '../../components';

//Services
import requestMock from '../../mocks/request.mock.json';
/* import { usePermission } from "../../utilities"; */

// import { Auth } from "../../core/interfaces/Auth";
/* import useFetchAndLoad from "../../hooks/useFetchAndLoad"; */
import { RequestAssigned, AllRequest } from './components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export const Request = () => {
  /* const { callEndpoint } = useFetchAndLoad(); */

  const [searchText /* setSearchText */] = useState('');
  /* const [openModal, setOpenModal] = useState(false); */
  const [dataSource, setDataSource] = useState<any>('');
  const [, /* rows */ setRows] = useState<any>(null);
  /* const [system, setSystem] = useState<any>(""); */
  const [systemSaved /* setSystemSaved */] = useState(false);
  /* const [typeOfCRUDAction, setTypeOfCRUDAction] = useState(""); */
  const [state /* setState */] = useState('true');
  const [, /* isLoading */ setIsLoading] = useState(false);
  /* const canCreate = usePermission("request-types", "canCreate");
  const canEdit = usePermission("request-types", "canEdit"); */

  const [value, setValue] = useState(1);

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

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };//!Peligroso

  useEffect(() => {
    const newData =
      dataSource &&
      dataSource.filter(
        (row: any) =>
          (row.id.toString().toLocaleLowerCase().includes(searchText) ||
            row.name.toLocaleLowerCase().includes(searchText)) &&
          row.state.toString() === state,
      );
    setRows(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, state]);

  const getSystems = async () => {
    try {
      setIsLoading(true);
      // const response = await callEndpoint(getAllBankOffices());
      const response = await requestMock;
      response.success && setRows(response.data);
      response.success && setDataSource(response.data);

      setIsLoading(false);
    } catch (error) {
      showToast('error', 'An error occurred loading the information', 'Contact technical support');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSystems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemSaved]);

  return (
    <div>
      {/*Title Component*/} <Titles title="Peticiones" moduleDescription="Listado y registro de peticiones."></Titles>
      <Box className="ml-27 mr-27 mt-29  w-auto rounded" sx={{ height: '100%' }}>
        <Box
          sx={{
            borderBottom: 0,
            borderColor: 'divider',
            position: 'relative',
            bottom: '-1px',
            padding: '0px 72px',
          }}
        >
          <Tabs value={value} aria-label="tabs">
            <Tab label="Solicitudes" value={1} />
            {/* <Tab label="Solicitudes" /> */}
          </Tabs>
        </Box>
        <TabPanel value={value} index={1}>
          <AllRequest />
        </TabPanel>
      </Box>
    </div>
  );
};
