import axios from 'axios';
import { loadAbort } from '../utilities';

import { urlCreatePaymentMethods, urlGetAllPaymentMethods, urlUpdatePaymentMethods } from '../constants/urls';
import {
  CREATE_PAYMENT_METHOD_MODEL,
  UPDATE_PAYMENT_METHOD_MODEL,
  UPDATE_PAYMENT_METHOD_MODEL_STATE,
} from '../models/paymentMethod.model';

//payment methods services
export const getAllPaymentMethods = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetAllPaymentMethods, { signal: controller.signal }),
    controller,
  };
};

export const createPaymentMethod = (body: CREATE_PAYMENT_METHOD_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreatePaymentMethods, body, { signal: controller.signal }),
    controller,
  };
};

export const updatePaymentMethod = (paymentMethodId: any, body: UPDATE_PAYMENT_METHOD_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdatePaymentMethods}/${paymentMethodId}`, body, { signal: controller.signal }),
    controller,
  };
};

export const updatePaymentMethodState = (paymentMethodSelected: any, body: UPDATE_PAYMENT_METHOD_MODEL_STATE) => {
  const controller = loadAbort();
  return {
    call: axios.patch(`${urlUpdatePaymentMethods}/${paymentMethodSelected && paymentMethodSelected.id}`, body, {
      signal: controller.signal,
    }),
    controller,
  };
};
