import axios from 'axios';
import {
  urlCreateCollections,
  urlGetCollections,
  urlListAvailableCollections,
  urlUpdateCollections,
} from '../constants/urls';
import {
  CREATE_COLLECTION_MODEL,
  UPDATE_COLLECTION_MODEL,
  UPDATE_COLLECTION_STATE_MODEL,
} from '../models/collections.model';
import { loadAbort } from '../utilities';

//Collection services
export const getAllCollections = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetCollections, { signal: controller.signal }),
    controller,
  };
};

/**
 *t: todas las colecciones disponibles
 *d: colecciones disponibles
 */
export const getAllAvailableCollections = (switchChecked: any) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${urlListAvailableCollections}${switchChecked ? 't' : 'd'}`, { signal: controller.signal }),
    controller,
  };
};

export const createCollection = (body: CREATE_COLLECTION_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateCollections, body, { signal: controller.signal }),
    controller,
  };
};

export const updateCollection = (collectionId: any, body: UPDATE_COLLECTION_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateCollections}/${collectionId}`, body, { signal: controller.signal }),
    controller,
  };
};

export const updateCollectionState = (collectionSelected: any, body: UPDATE_COLLECTION_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdateCollections}/${collectionSelected.id}`, body, { signal: controller.signal }),
    controller,
  };
};
