import { api } from "@/@core/application/utils/api";
import { GlobalVars } from "@/@core/shared/vars";

export const postChangeRazdel = async (id: number | string) => {
  try {
    const response = await api.get(`/SectionCategories/one/${id}`, {
      params: {
        page: GlobalVars.FirstPage,
        pageSize: GlobalVars.All,
        search: GlobalVars.NullString,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
