import axios from "axios";
import { urlCreateDocuments, urlGetAll2Documents, urlGetAllDocuments } from "../constants/urls";
import { documentRequest } from "../models/documentRequest.model";
import { loadAbort } from "../utilities";

export const getDocuments = (id: string, stage?: string) => {
    const controller = loadAbort();
    return {
        call: axios.get(`${urlGetAll2Documents}/${id}`, {
            signal: controller.signal,
        }),
        controller,
    };
};

export const createDocuments = (body: documentRequest) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlCreateDocuments, body, {
            signal: controller.signal,
        }),

        controller,
    };
};