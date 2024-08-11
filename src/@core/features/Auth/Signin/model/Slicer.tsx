import { api } from "@/@core/application/utils/api";
import { GlobalVars } from "@/@core/shared/vars";
import { create } from "zustand";

const useSigninSlice = create((set) => ({
  users: [],
  getUsers: async () => {
    try {
      const response = await api.get(`/Auth/getUser/all`, {
        params: {
          page: GlobalVars.FirstPage,
          pageSize: GlobalVars.All,
          search: GlobalVars.NullString,
          role: GlobalVars.NullString,
        },
      });
      set({ users: response?.data?.results });
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useSignin = () => {
  const users = useSigninSlice((state: any) => state.users);
  const getUsers = useSigninSlice((state: any) => state.getUsers);

  return {
    users,
    getUsers,
  };
};
