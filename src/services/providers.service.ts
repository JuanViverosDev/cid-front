import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlCreateProviders, urlGetProviders, urlUpdateProviders } from '../constants/urls';
import {
  CREATE_PROCESS_STATES_MODEL,
  UPDATE_PROCESS_STATES_MODEL,
  UPDATE_PROCESS_STATES_STATE_MODEL,
} from '../models/processStates.model';

//Providers services
export const getAllProvidersService = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetProviders, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const createProviders = (body: CREATE_PROCESS_STATES_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateProviders, body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateProviders = (providerId: any, body: UPDATE_PROCESS_STATES_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateProviders}/${providerId}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateProvidersState = (providerSelected: any, body: UPDATE_PROCESS_STATES_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateProviders}/${providerSelected.id}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
