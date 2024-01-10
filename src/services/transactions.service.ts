import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlGetAllMobileTransactions } from '../constants/urls';
import { GET_ALL_TRANSACTIONS_MODEL } from '../models/transactions.model';

export const getAllTransactions = (body: GET_ALL_TRANSACTIONS_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlGetAllMobileTransactions, body, { signal: controller.signal }),
    controller,
  };
};
