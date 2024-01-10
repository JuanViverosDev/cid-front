import axios from 'axios';
import { loadAbort } from '../utilities';
import { urlDashboard } from '../constants/urls';

export const getDashboardData = () => {
    const controller = loadAbort();
    return {
      call: axios.get(urlDashboard, { signal: controller.signal }),
      controller,
    };
  };
