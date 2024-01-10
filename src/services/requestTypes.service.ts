import axios from "axios";
import { loadAbort } from "../utilities";
import {
  urlGetRequestTypes,
  urlCreateRequestTypes,
  urlUpdateRequestType,
  urlGetAllExpedientes,
  urlGetExpedientesById,
} from "../constants/urls";
import {
  CREATE_REQUEST_TYPES_MODEL,
  UPDATE_REQUEST_TYPE_MODEL,
  UPDATE_REQUEST_TYPE_STATE_MODEL,
} from "../models/requestTypes.model";

//Request Types
export const getAllRequestTypes = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetRequestTypes, { signal: controller.signal }),
    controller,
  };
};
export const createRequestTypes = (body: CREATE_REQUEST_TYPES_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateRequestTypes, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
export const updateRequestTypes = (
  requestType: any,
  body: UPDATE_REQUEST_TYPE_MODEL
) => {
  const controller = loadAbort();
  return {
    call: axios.patch(
      `${urlUpdateRequestType}/${requestType ? requestType.id : 0}`,
      body,
      {
        signal: controller.signal,
      }
    ),
    controller,
  };
};
export const updateRequestTypeState = (
  requestType: any,
  body: UPDATE_REQUEST_TYPE_STATE_MODEL
) => {
  const controller = loadAbort();
  return {
    call: axios.patch(
      `${urlUpdateRequestType}/${requestType ? requestType.id : 0}`,
      body,
      {
        signal: controller.signal,
      }
    ),
    controller,
  };
};
export const getExpendientes = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetAllExpedientes, { signal: controller.signal }),
    controller,
  };
};
export const getExpendientesById = (id: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetExpedientesById}/${id}`, { signal: controller.signal }),
    controller,
  };
};
