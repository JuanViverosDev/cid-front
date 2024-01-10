import axios from 'axios';
import { urlCreateProcessStates, urlGetProcessStates, urlUpdateProcessStates } from '../constants/urls';
import { CREATE_PROCESS_STATES_MODEL, UPDATE_PROCESS_STATES_MODEL, UPDATE_PROCESS_STATES_STATE_MODEL } from '../models';
import { loadAbort } from '../utilities';

//Process States Services
export const getAllProcessState = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetProcessStates, { signal: controller.signal }),
    controller,
  };
};
export const createProcessState = (body: CREATE_PROCESS_STATES_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateProcessStates, body, { signal: controller.signal }),
    controller,
  };
};
export const updateProcessState = (processState: any, body: UPDATE_PROCESS_STATES_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateProcessStates}/${processState.id}`, body, { signal: controller.signal }),
    controller,
  };
};
export const updateProcessState_State = (processState: any, body: UPDATE_PROCESS_STATES_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateProcessStates}/${processState && processState.id}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
