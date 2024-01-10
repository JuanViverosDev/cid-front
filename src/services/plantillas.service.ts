import axios from "axios";
import { urlCreateDocuments, urlGetAllTemplates, urlGetGlobalConfig } from "../constants/urls";
import { documentRequest } from "../models/documentRequest.model";
import { loadAbort } from "../utilities";

export const getTemplates = () => {
    const controller = loadAbort();
    return {
        call: axios.get(`${urlGetAllTemplates}`, {
            signal: controller.signal,
        }),
        controller,
    };
};

export const createTemplates = (body: documentRequest) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlGetAllTemplates, body, {
            signal: controller.signal,
        }),

        controller,
    };
};

export const updateTemplates = (body: documentRequest) => {
    const controller = loadAbort();
    return {
        call: axios.patch(urlGetAllTemplates, body, {
            signal: controller.signal,
        }),

        controller,
    };
}

export const createGlobalConfig = (body: documentRequest) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlGetGlobalConfig, body, {
            signal: controller.signal,
        }),

        controller,
    };
};

export const getGlobalConfig = () => {
    const controller = loadAbort();
    return {
        call: axios.get(`${urlGetGlobalConfig}`, {
            signal: controller.signal,
        }),
        controller,
    };
}