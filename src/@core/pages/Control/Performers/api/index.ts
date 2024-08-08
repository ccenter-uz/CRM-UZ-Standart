import { api } from "@/@core/application/utils/api";

enum Endpoints {
  GET = "/Performer/all",
  CREATE = "/Performer/create",
  UPDATE = "/Performer/update",
}

// GET
export const get = async (params: {
  page: string;
  pageSize: string;
  search: string;
}) => {
  try {
    const response = await api.get(`${Endpoints.GET}`, {
      params,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

// CREATE
export const create = async (values: unknown) => {
  try {
    const response = await api.post(`${Endpoints.CREATE}`, values);

    return response;
  } catch (error) {
    console.error(error);
  }
};

// UPDATE
export const update = async (values: unknown, id: number) => {
  try {
    const response = await api.patch(`${Endpoints.UPDATE}/${id}`, values);

    return response;
  } catch (error) {
    console.error(error);
  }
};
