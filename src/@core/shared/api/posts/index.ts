import { api } from "@/@core/application/utils/api";

const enum ENDPOINTS {
    createResponseFile ='/organization/response',
}

export const createResponseFile = async (values: unknown,id:string) => {
    try {
        const response = await api.post(`${ENDPOINTS.createResponseFile}/${id}`, values);
       
        return response;
    } catch (error) {
        console.error(error);
    }
}