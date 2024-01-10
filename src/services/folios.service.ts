import axios from "axios";
import { urlCreateDocuments, urlFolios, urlGetAllStates, urlGetAllTemplates, urlGetFolios } from "../constants/urls";
import { documentRequest } from "../models/documentRequest.model";
import { loadAbort } from "../utilities";

// export const getAllStates = () => {
//     const controller = loadAbort();
//     return {
//         call: axios.get(`${urlGetAllStates}`, {
//             signal: controller.signal,
//         }),
//         controller,
//     };
// };

export const createFolio = (body: any) => {
    const controller = loadAbort();
    return {
        call: axios.post(urlFolios, body, {
            signal: controller.signal,
        }),

        controller,
    };
};

export const getFolio = (folioId: string) => {
    const controller = loadAbort();
    return {
        call: axios.get(`${urlGetFolios}/${folioId}`, {
            signal: controller.signal,
        }),
        controller,
    };
}