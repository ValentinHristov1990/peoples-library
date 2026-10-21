import request from "../service/request";

export const getAll = (accessToken) => {
  return request("/books?order=created_at.desc", "GET", null, {
    headers: {
      ...getAuthHeader(accessToken),
    },
  });
};

export const getById = (bookId, accessToken) => {
  return request(`/books?id=eq.${bookId}`, "GET", null, {
    headers: {
      ...getAuthHeader(accessToken),
    },
  });
};

export const create = (data, accessToken) => {
  return request("/books", "POST", data, {
    headers: {
      ...getAuthHeader(accessToken),
    },
  });
};

export const update = async (bookId, data, accessToken) => {
  return request(`/books?id=eq.${bookId}`, "PATCH", data, {
    headers: {
      ...getAuthHeader(accessToken),
    },
  });
};

export const remove = async (bookId, accessToken) => {
  return request(`/books?id=eq.${bookId}`, "DELETE", null, {
    headers: {
      ...getAuthHeader(accessToken),
    },
  });
};

function getAuthHeader(accessToken) {
  return {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}
