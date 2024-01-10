import axios from "axios";
import { loadAbort } from "../utilities";
import {
  urlCreateContactTypes,
  urlGetAllContactTypes,
  urlUpdateContactTypes,
} from "../constants/urls";
import {
  CREATE_CONTACT_TYPE_MODEL,
  UPDATE_CONTACT_TYPES_MODEL,
  UPDATE_CONTACT_TYPE_STATE_MODEL,
} from "../models/contactTypes.model";

export const getAllContactTypes = () => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlGetAllContactTypes}`, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const createContactTypes = (body: CREATE_CONTACT_TYPE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateContactTypes, body, {
      signal: controller.signal,
    }),

    controller,
  };
};

export const updateContactTypes = (
  contactTypeSelected: any,
  body: UPDATE_CONTACT_TYPES_MODEL
) => {
  const controller = loadAbort();
  return {
    call: axios.patch(
      `${urlUpdateContactTypes}/${
        contactTypeSelected && contactTypeSelected.id
      }`,
      body,
      {
        signal: controller.signal,
      }
    ),

    controller,
  };
};

export const updateContactTypeState = (
  contactTypeSelected: any,
  body: UPDATE_CONTACT_TYPE_STATE_MODEL
) => {
  const controller = loadAbort();
  return {
    call: axios.patch(
      `${urlUpdateContactTypes}/${
        contactTypeSelected && contactTypeSelected.id
      }`,
      body,
      {
        signal: controller.signal,
      }
    ),

    controller,
  };
};
