import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH } from '../models/';
import { MenuRoutes } from '../routers/MenuRoutes';
import { setReLogin } from '../redux/states/authSlice';
// Import Theme Global Configuration - MUI
import theme from '../assets/theme/themeConfiguration';
import { LockScreen } from '../screens';
import { Navbar, Sidebar } from '.';

export const Layout = () => {
  const RELOGIN = useSelector(({ auth }: { auth: AUTH }) => auth.reLogin);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status } = error.response;
        dispatch(setReLogin(status === 401));
        return Promise.reject(error);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {RELOGIN ? (
        <LockScreen />
      ) : (
        <div>
          <Sidebar />
          <div className="md:pl-64 flex flex-col flex-1 bg-lightBloom">
            <Navbar />
            <div>
              <MenuRoutes />
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};
