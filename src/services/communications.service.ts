import axios from 'axios';
import { loadAbort } from '../utilities';

import { urlAttachVoucher, urlGetAllCompletedComunications, urlGetAllComunications, urlGetNotificationsPanel, urlGetVouchers, urlNotifyOrCommunicate } from '../constants/urls';

export const getAllComunications = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetNotificationsPanel, { signal: controller.signal }),
    controller,
  };
};

export const getAllComunicationsByTitle = (title) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetAllComunications}/${title}`, { signal: controller.signal }),
    controller,
  };
};

export const getAllCompletedComunicationsByTitle = (title) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetAllCompletedComunications}/${title}`, { signal: controller.signal }),
    controller,
  };
};

export const sendCommunication = (communication) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlNotifyOrCommunicate, communication, { signal: controller.signal }),
    controller,
  };
}

export const sendCommunicationWithFile = (id, body) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${urlAttachVoucher}/${id}`, body, { signal: controller.signal }),
    controller,
  };
}

export const getVouchers = (requestId, documentId) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetVouchers}/${requestId}/${documentId}`, { signal: controller.signal }),
    controller,
  };
}