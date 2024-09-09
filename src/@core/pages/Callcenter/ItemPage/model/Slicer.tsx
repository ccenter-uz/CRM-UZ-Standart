import { api } from "@/@core/application/utils/api";
import { create } from "zustand";

const useItemPageSlicer = create((set) => ({
  // VARS
  data: [],
  loading: true,

  // SETTERS
  setLoading: (value: boolean) => {
    set({
      loading: value,
    });
  },

  // GETTERS
  getData: async (id: string) => {
    const res = await api.get(`/organization/one/${id}`);

    set({
      data: res.data,
    });
    set({ loading: false });

    return res.data;
  },
}));

export const useItemPage = () => {
  const { data, getData, loading, setLoading } = useItemPageSlicer(
    (state: any) => state
  );

  return {
    data,
    getData,
    loading,
    setLoading,
  };
};
