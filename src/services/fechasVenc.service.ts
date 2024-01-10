import axios from "axios";
import { urlCreateDocuments, urlGetAllStates, urlGetAllTemplates } from "../constants/urls";
import { documentRequest } from "../models/documentRequest.model";
import { loadAbort } from "../utilities";

export const getAllStates = () => {
    const controller = loadAbort();
    return {
        call: axios.get(`${urlGetAllStates}`, {
            signal: controller.signal,
        }),
        controller,
    };
};

export const updateStates = (body: any) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlGetAllStates, body, {
            signal: controller.signal,
        }),

        controller,
    };
};