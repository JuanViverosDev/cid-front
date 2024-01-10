import axios from 'axios';
import { loadAbort } from './../utilities';
import { urlAuthLogin, urlRecoverPassword } from '../constants/urls';
import { FORGOT_PASS_MODEL, LOGIN_MODEL } from '../models/auth.model';

export const login = (body: LOGIN_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlAuthLogin, body, { signal: controller.signal }),
    controller,
  };
};

export const forgotPass = (body: FORGOT_PASS_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlRecoverPassword, body, { signal: controller.signal }),
    controller,
  };
};
