import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlCreateUser, urlGetAllCMSUsers, urlUpdateUser } from '../constants/urls';
import { CREATE_WEB_USERS_MODEL, UPDATE_WEB_USERS_MODEL, UPDATE_WEB_USER_STATE_MODEL } from '../models/webUsers.model';

export const getAllWebUsers = () => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetAllCMSUsers}`, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const createWebUsers = (body: CREATE_WEB_USERS_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateUser, body, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const updateWebUsers = (userId: any, body: UPDATE_WEB_USERS_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateUser}/${userId}`, body, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const updateWebUserState = (userSelected: any, body: UPDATE_WEB_USER_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateUser}/${userSelected && userSelected.id}`, body, {
      signal: controller.signal,
    }),

    controller,
  };
};
