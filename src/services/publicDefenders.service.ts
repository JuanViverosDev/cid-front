import axios from 'axios';
import { urlCreatePublicDefenders, urlGetAllPublicDefenders, urlUpdatePublicDefenders } from '../constants/urls';
import {
  CREATE_PUBLIC_DEFENDER_MODEL,
  UPDATE_PUBLIC_DEFENDER_MODEL,
  UPDATE_PUBLIC_DEFENDER_STATE_MODEL,
} from '../models/publicDefenders.model';
import { loadAbort } from '../utilities';

export const getAllPublicDefenders = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetAllPublicDefenders, { signal: controller.signal }),
    controller,
  };
};
export const createPublicDefenders = (body: CREATE_PUBLIC_DEFENDER_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreatePublicDefenders, body, { signal: controller.signal }),
    controller,
  };
};
export const updatePublicDefenders = (publicDefenderSelected: any, body: UPDATE_PUBLIC_DEFENDER_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdatePublicDefenders}/${publicDefenderSelected ? publicDefenderSelected.id : 0}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updatePublicDefendersState = (publicDefenderSelected: any, body: UPDATE_PUBLIC_DEFENDER_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdatePublicDefenders}/${publicDefenderSelected ? publicDefenderSelected.id : 0}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
