import axios from "axios";
import { urlSearchDocuments } from "../constants/urls";
import { loadAbort } from "../utilities";

export const getDocumentsSearch = (body: any) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlSearchDocuments, body, {
            signal: controller.signal,
        }),

        controller,
    };
};