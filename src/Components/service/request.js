const restUrl = "https://stsrqzkttgyjnyjavknl.supabase.co/rest/v1";
const authUrl = "https://stsrqzkttgyjnyjavknl.supabase.co/auth/v1";

async function baseRequest(
  url,
  path = "/",
  method = "GET",
  data = null,
  opts = {},
) {
  const options = {
    ...opts,
    headers: {
      ...opts.headers,
      apikey: import.meta.env.VITE_API_KEY,
      Prefer: "return=representation",
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

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default baseRequest.bind(null, restUrl);
export const authRequest = baseRequest.bind(null, authUrl);
