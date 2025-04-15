import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllSignboard = ({ page }: { page: string | null }) => {
  return http.get('/signboard', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getSignboard = (id: string | undefined) => {
  return http.get(`/signboard/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addSignboard = (data: { name: string }) => {
  return http.post(`/signboard`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateSignboard = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/signboard/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteSignboard = (id: any) => {
  return http.delete(`/signboard/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
