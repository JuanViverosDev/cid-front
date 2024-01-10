import axios from "axios";
import { urlSendNotification } from "../constants/urls";
import { documentRequest } from "../models/documentRequest.model";
import { loadAbort } from "../utilities";

export const createNofity = (body: documentRequest) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlSendNotification, body, {
            signal: controller.signal,
        }),

        controller,
    };
};