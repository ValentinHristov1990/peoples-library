const url = "https://stsrqzkttgyjnyjavknl.supabase.co/rest/v1";

export default async function request(
  path = "/",
  method = "GET",
  data = null,
  opts = {},
) {
  const options = {
    headers: {
      apikey: import.meta.env.VITE_API_KEY,
      Prefer: "return=representation",
    },
    ...opts,
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`,
    );
  }

  // Ако е 204 No Content, връщаме празен обект или null
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
