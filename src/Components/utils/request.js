const restUrl = "https://stsrqzkttgyjnyjavknl.supabase.co/rest/v1";
const authUrl = "https://stsrqzkttgyjnyjavknl.supabase.co/auth/v1";

async function baseRequest(
  url,
  path = "/",
  method = "GET",
  data = null,
  opts = {},
) {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = authData.accessToken || authData.token || authData.access_token;

  const options = {
    ...opts,
    headers: {
      ...opts.headers,
      apikey: import.meta.env.VITE_API_KEY,
      Prefer: "return=representation",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (method !== "GET") {
    options.method = method;
  }

  if (data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${url}${path}`, options);

  if (response.status === 401) {
    localStorage.removeItem("auth");
    window.dispatchEvent(new Event("auth:session-expired"));

    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.msg ||
        errorData.message ||
        errorData.error_description ||
        `HTTP error! Status: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default baseRequest.bind(null, restUrl);
export const authRequest = baseRequest.bind(null, authUrl);
