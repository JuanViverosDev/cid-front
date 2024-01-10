import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlGetCategories, urlGetModules, urlListAvailableModules } from '../constants/urls';
import {
  CREATE_NEW_CATEGORY_MODEL,
  CREATE_NEW_MODULE_MODEL,
  UPDATE_CATEGORY_MODEL,
  UPDATE_CATEGORY_STATE_MODEL,
  UPDATE_MODULE_MODEL,
  UPDATE_MODULE_STATE_MODEL,
} from '../models/menu.model';

//Categories services
export const getAllCategories = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetCategories, { signal: controller.signal }),
    controller,
  };
};

//! falta servicio para traer los modulos disponibles
export const getAvailableModules = (switchChecked: boolean) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlListAvailableModules, { filter: switchChecked ? 't' : 'd' }, { signal: controller.signal }),
    controller,
  };
};

export const createNewCategory = (body: CREATE_NEW_CATEGORY_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlGetCategories, body, { signal: controller.signal }),
    controller,
  };
};

export const updateCategory = (categoryId: any, body: UPDATE_CATEGORY_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlGetCategories}/${categoryId}`, body, { signal: controller.signal }),
    controller,
  };
};

export const updateCategoryState = (categorySelected: any, body: UPDATE_CATEGORY_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlGetCategories}/${categorySelected && categorySelected.id}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};

//Modules services

export const getAllModules = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetModules, { signal: controller.signal }),
    controller,
  };
};

export const createNewModule = (body: CREATE_NEW_MODULE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlGetModules, body, { signal: controller.signal }),
    controller,
  };
};

export const updateModule = (moduleId: any, body: UPDATE_MODULE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlGetModules}/${moduleId}`, body, { signal: controller.signal }),
    controller,
  };
};
export const updateModuleState = (moduleSelected: any, body: UPDATE_MODULE_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlGetModules}/${moduleSelected && moduleSelected.id}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
