import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlCreateRoles, urlGetModulesByRol, urlGetRoles, urlUpdateRoles } from '../constants/urls';
import { CREATE_NEW_ROLE_MODEL, UPDATE_ROLE_MODEL, UPDATE_ROLE_STATE_MODEL } from '../models/roles.model';

export const getAllRoles = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetRoles, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const getModulesByRoles = (role: any) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetModulesByRol}/${role ? role : 0}`, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const createNewRole = (body: CREATE_NEW_ROLE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateRoles, body, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const updateRole = (roleSelected: any, body: UPDATE_ROLE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateRoles}/${roleSelected.id}`, body, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const updateRoleState = (roleSelected: any, body: UPDATE_ROLE_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateRoles}/${roleSelected ? roleSelected.id : 0}`, body, {
      signal: controller.signal,
    }),

    controller,
  };
};
