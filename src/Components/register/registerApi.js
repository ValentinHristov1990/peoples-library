import { authRequest } from "../service/request";

export async function registerUser({ username, email, password }) {
  if (!username || !email || !password) {
    throw new Error("All fields are required!");
  }

  return authRequest("/signup", "POST", {
    email,
    password,
    data: { username },
  });
}
