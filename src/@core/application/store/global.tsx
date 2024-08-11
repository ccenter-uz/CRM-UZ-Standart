import { create } from "zustand";
import { useEffect } from "react";
import { api } from "../utils/api";
import { GlobalVars } from "@/@core/shared/vars";

const useGlobalStore = create((set) => ({
  role: null,
  setRole: (value: any) => set({ role: value }),
  razdel: [],
  podrazdel: [],
  setPodrazdel: (value: any) => set({ podrazdel: value }),
  loading: false,
  operators: [],
  organizations: [],
  performers: [],
  regions: [],
  district: [],
  setDistrict: (value: any) => set({ district: value }),
  setOperators: (value: any) => set({ operators: value }),
  setOrganizations: (value: any) => set({ organizations: value }),
  setPerformers: (value: any) => set({ performers: value }),
  getPerformers: async (params: {
    page: number;
    pageSize: number;
    search: string;
  }) => {
    const fetchingPerformers = await api.get(`/Performer/all`, {
      params,
    });
    set({
      performers: fetchingPerformers.data?.results.map(
        (item: any, index: number) => ({ ...item, index: index + 1 })
      ),
    });
  },

  getOrganizations: async (params: {
    page: GlobalVars.FirstPage;
    pageSize: GlobalVars.All;
    search: GlobalVars.NullString;
  }) => {
    const fetchingOrganizations = await api.get(`/SendeOrganization/all`, {
      params,
    });
    set({
      organizations: fetchingOrganizations.data?.results?.map(
        (item: any, index: number) => ({ ...item, index: index + 1 })
      ),
    });
  },
  getOperators: async (params: {
    page: number;
    pageSize: number;
    search: string;
    role: string;
  }) => {
    const fetchingOperators = await api.get(`/Auth/getUser/all`, {
      params,
    });
    set({
      operators: fetchingOperators.data?.results.map(
        (item: any, index: number) => ({ ...item, index: index + 1 })
      ),
    });
  },
  getRazdel: async (
    page = GlobalVars.FirstPage,
    pageSize = GlobalVars.All,
    search = GlobalVars.NullString
  ) => {
    set({ loading: true });
    const fethingRazdel = await api.get(`/SectionCategories/all`, {
      params: { page, pageSize, search },
    });
    set({
      razdel: fethingRazdel.data?.results?.map((item: any, index: number) => ({
        ...item,
        index: index + 1,
      })),
    });
    set({ loading: false });
  },
  getPodrazdel: async (
    page = GlobalVars.FirstPage,
    pageSize = GlobalVars.All
  ) => {
    set({ loading: true });
    const fethingPodrazdel = await api.get(`/SubCategorySection/all`, {
      params: { search: GlobalVars.NullString, page, pageSize },
    });
    set({
      podrazdel: fethingPodrazdel.data?.results?.map(
        (item: any, index: number) => ({
          ...item,
          index: index + 1,
        })
      ),
    });
    set({ loading: false });
  },
  getRegions: async (
    page = GlobalVars.FirstPage,
    pageSize = GlobalVars.All,
    search = GlobalVars.NullString
  ) => {
    set({ loading: true });
    const fethingRegions = await api.get(`/RegionCategories/all`, {
      params: { page, pageSize, search },
    });
    set({ regions: fethingRegions.data?.results });
    set({ loading: false });
  },
  getDistrictByRegionId: async (id: string, page = 1, pageSize = 1000000) => {
    set({ loading: true });
    const fethingDistrict = await api.get(`/RegionCategories/one/${id}`, {
      params: { page, pageSize, search: GlobalVars.NullString },
    });
    set({
      district: fethingDistrict.data?.results?.map(
        (item: any, index: number) => ({
          ...item,
          index: index + 1,
        })
      ),
    });
    set({ loading: false });
  },
  getDistrict: async (
    page = GlobalVars.FirstPage,
    pageSize = GlobalVars.All
  ) => {
    set({ loading: true });
    const fethingDistrict = await api.get(`/District/all`, {
      params: { page, pageSize },
    });
    set({
      district: fethingDistrict.data?.results?.map(
        (item: any, index: number) => ({
          ...item,
        })
      ),
    });
    set({ loading: false });
  },
}));

export const useGlobal = () => {
  const razdel = useGlobalStore((state: any) => state.razdel);
  const podrazdel = useGlobalStore((state: any) => state.podrazdel);
  const loading = useGlobalStore((state: any) => state.loading);
  const getRazdel = useGlobalStore((state: any) => state.getRazdel);
  const getPodrazdel = useGlobalStore((state: any) => state.getPodrazdel);
  const regions = useGlobalStore((state: any) => state.regions);
  const setPodrazdel = useGlobalStore((state: any) => state.setPodrazdel);
  const district = useGlobalStore((state: any) => state.district);
  const operators = useGlobalStore((state: any) => state.operators);
  const getRegions = useGlobalStore((state: any) => state.getRegions);
  const getOperators = useGlobalStore((state: any) => state.getOperators);
  const getDistrictByRegionId = useGlobalStore(
    (state: any) => state.getDistrictByRegionId
  );
  const getDistrict = useGlobalStore((state: any) => state.getDistrict);
  const setDistrict = useGlobalStore((state: any) => state.setDistrict);
  const setOperators = useGlobalStore((state: any) => state.setOperators);
  const organizations = useGlobalStore((state: any) => state.organizations);
  const getOrganizations = useGlobalStore(
    (state: any) => state.getOrganizations
  );
  const setOrganizations = useGlobalStore(
    (state: any) => state.setOrganizations
  );
  const role = useGlobalStore((state: any) => state.role);
  const setRole = useGlobalStore((state: any) => state.setRole);
  const getPerformers = useGlobalStore((state: any) => state.getPerformers);
  const performers = useGlobalStore((state: any) => state.performers);
  const setPerformers = useGlobalStore((state: any) => state.setPerformers);

  return {
    razdel,
    loading,
    podrazdel,
    regions,
    district,
    setPodrazdel,
    getPodrazdel,
    getRazdel,
    operators,
    getRegions,
    getDistrictByRegionId,
    getDistrict,
    setDistrict,
    getOperators,
    organizations,
    getOrganizations,
    setOrganizations,
    setOperators,
    role,
    setRole,
    getPerformers,
    performers,
    setPerformers,
  };
};
