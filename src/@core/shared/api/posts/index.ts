import { api } from "@/@core/application/utils/api";

const enum ENDPOINTS {
    createResponseFile ='/response-file/create',
}

export const createResponseFile = async (values: unknown) => {
    try {
        const response = await api.post(`${ENDPOINTS.createResponseFile}`, values);
       
        return response;
    } catch (error) {
        console.error(error);
    }
}