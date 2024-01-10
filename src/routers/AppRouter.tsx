import axios from 'axios';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from '../screens';
import { AUTH } from '../models/';
import { store } from '../redux/store';
import { Layout } from '../components/';

axios.interceptors.request.use(
  (config: any) => {
    const token = store.getState().auth.data.stsTokenManager.token;

    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const AppRouter = () => {
  const authToken = useSelector(({ auth }: { auth: AUTH }) => auth.data.stsTokenManager?.token);
  return (
    <BrowserRouter>
      <Routes>{authToken ? <Route path="/*" element={<Layout />} /> : <Route path="/*" element={<Login />} />}</Routes>
    </BrowserRouter>
  );
};
