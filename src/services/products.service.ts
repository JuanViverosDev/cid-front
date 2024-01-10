import axios from 'axios';
import { loadAbort } from '../utilities';
import {
  urlCreateProductRequest,
  urlGetAllProducts,
  urlGetCMSCategories,
  urlGetCMSSubcategories,
  urlUpdateProductRequest,
} from '../constants/urls';
import {
  CREATE_PRODUCT_REQUEST_MODEL,
  UPDATE_PRODUCT_MODEL,
  UPDATE_PRODUCT_STATE_MODEL,
} from '../models/products.model';

export const getAllProducts = () => {
  const controller = loadAbort();
  let obj = { take: 100, page: 1, orderby: 'name' };

  return {
    call: axios.post(`${urlGetAllProducts}?take=${obj.take}&page=${obj.page}&orderby=${obj.orderby}`, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const createProductRequest = (body: CREATE_PRODUCT_REQUEST_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreateProductRequest, body, { signal: controller.signal }),
    controller,
  };
};

export const updateProduct = (productId: any, body: UPDATE_PRODUCT_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${urlUpdateProductRequest}/${productId}`, body, { signal: controller.signal }),
    controller,
  };
};

export const updateProductState = (productSelected: any, body: UPDATE_PRODUCT_STATE_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${urlUpdateProductRequest}${productSelected.id}`, body, { signal: controller.signal }),
    controller,
  };
};

//Categories services
export const getAllProductCategories = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetCMSCategories, { signal: controller.signal }),
    controller,
  };
};

//Subcategories services
export const getAllSubcategories = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetCMSSubcategories, { signal: controller.signal }),
    controller,
  };
};
