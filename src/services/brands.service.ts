import axios from 'axios';
import { loadAbort } from '../utilities';

import { urlCreateBrand, urlGetBrands, urlUpdateBrand } from '../constants/urls';
import { CREATE_BRAND_MODEL, UPDATE_BRAND_MODEL, UPDATE_BRAND_STATE_MODEL } from '../models/brands.model';

//Brands services
export const getAllBrands = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetBrands, { signal: controller.signal }),
    controller,
  };
};

export const createBrand = (body: CREATE_BRAND_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateBrand, body, { signal: controller.signal }),
    controller,
  };
};

export const updateBrand = (brandId: any, body: UPDATE_BRAND_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${urlUpdateBrand}/${brandId}`, body, { signal: controller.signal }),
    controller,
  };
};

export const updateBrandState = (brandSelected: any, body: UPDATE_BRAND_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${urlUpdateBrand}/${brandSelected && brandSelected.id}`, body, { signal: controller.signal }),
    controller,
  };
};
