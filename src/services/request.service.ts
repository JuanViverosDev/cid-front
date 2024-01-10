import axios from 'axios';
import { loadAbort } from '../utilities';

import { urlCreateRequest, urlGetRequestByUser, urlUpdateRequest, urlProceedingsNumber, urlGetAllDisciplined } from '../constants/urls';
import { CREATE_REQUEST_MODEL, UPDATE_REQUEST_MODEL, UPDATE_REQUEST_STATE_MODEL } from '../models';

export const getAllRequestByUser = (userId: any) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetRequestByUser}/${userId}`, { signal: controller.signal }),
    controller,
  };
};

export const createRequest = (body: CREATE_REQUEST_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateRequest, body, { signal: controller.signal }),
    controller,
  };
};

export const updateRequest = (requestSelected: any, body: UPDATE_REQUEST_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateRequest}/${requestSelected.id}`, body, { signal: controller.signal }),
    controller,
  };
};

export const updateRequestState = (requestSelected: any, body: UPDATE_REQUEST_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateRequest}/${requestSelected.id}`, body, { signal: controller.signal }),
    controller,
  };

};

export const createProceedings = () => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlProceedingsNumber}`),
    controller
  }
}

export const getAllDisciplined = () => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetAllDisciplined}`),
    
    controller
  }
}
