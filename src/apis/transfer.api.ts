import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllTransfer = ({ page }: { page: string | null }) => {
  return http.get('/transfer', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getTransfer = (id: string | undefined) => {
  return http.get(`/transfer/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addTransfer = (data: any) => {
  return http.post(`/transfer`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateTransfer = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/transfer/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteTransfer = (id: any) => {
  return http.delete(`/transfer/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
