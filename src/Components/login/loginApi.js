import { authRequest } from "../service/request";

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required!");
  }

  const data = await authRequest("/token?grant_type=password", "POST", {
    email,
    password,
  });

  return data;
}
