import { create } from "zustand";

type TokenStore = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const useTokenStore = create<TokenStore>((set) => ({
  token: null,
  setToken: (access_token) => {
    set({ token: access_token });
    localStorage.setItem("token", access_token);
  },
  clearToken: () => {
    set({ token: null });
    localStorage.removeItem("token");
  },
}));

export const isAuthenticated = () => useTokenStore.getState().token !== null;
export const signIn = (token: string) =>
  useTokenStore.getState().setToken(token);
export const signOut = () => useTokenStore.getState().clearToken();
