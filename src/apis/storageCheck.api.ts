import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllStorageCheck = ({ page }: { page: string | null }) => {
  return http.get('/storage_check', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getStorageCheck = (id: string | undefined) => {
  return http.get(`/storage_check/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addStorageCheck = (data: any) => {
  return http.post(`/storage_check`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateStorageCheck = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/storage_check/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteStorageCheck = (id: any) => {
  return http.delete(`/storage_check/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
