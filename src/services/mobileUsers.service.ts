import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlGetAllMobileUsers } from '../constants/urls';

export const getAllMobileUsers = (pageSize: any, page: any) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${urlGetAllMobileUsers}/?take=${pageSize}&page=${page}&orderby=name`, {
      signal: controller.signal,
    }),
    controller,
  };
};
