import axios from "axios";
import { urlGetAllStages, urlGetStagesWithStates } from "../constants/urls";
import { loadAbort } from "../utilities";

export const getAllStages = () => {
    const controller = loadAbort();
    return {
        call: axios.get(urlGetAllStages, {
            signal: controller.signal,
        }),

        controller,
    };
};

export const getStagesWithStates = () => {
    const controller = loadAbort();
    return {
        call: axios.get(urlGetStagesWithStates, {
            signal: controller.signal,
        }),

        controller,
    };
};