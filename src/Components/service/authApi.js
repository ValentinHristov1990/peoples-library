import { authRequest } from "./request";

export const register = async ({ email, password, username }) => {
  return authRequest("/signup", "POST", {
    email,
    password,
    data: { username },
  });
};

export const login = async ({ email, password }) => {
  return authRequest("/token?grant_type=password", "POST", { email, password });
};

export const logout = async (accessToken) => {
  return authRequest("/logout", "POST", null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
