import { AxiosCall } from './../models';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../redux/states/authSlice';

const useFetchAndLoad = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let controller: AbortController;

  const callEndpoint = async (axiosCall: AxiosCall<any>) => {
    if (axiosCall.controller) controller = axiosCall.controller;
    setLoading(true);
    let result = {} as AxiosResponse<any>;
    try {
      result = await axiosCall.call;
    } catch (err: any) {
      setLoading(false);
      if (err?.response?.data?.message === "Token Expirado") {
        dispatch(logOut());
        navigate('/')
      }
    }
    setLoading(false);


    return result.data;
  };

  const cancelEndpoint = () => {
    setLoading(false);
    controller && controller.abort();
  };

  useEffect(() => {
    return () => cancelEndpoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, callEndpoint };
};

export default useFetchAndLoad;
