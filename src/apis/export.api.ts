import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllExport = ({ page }: { page: string | null }) => {
  return http.get('/export', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getExport = (id: string | undefined) => {
  return http.get(`/export/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addExport = (data: any) => {
  return http.post(`/export`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateExport = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/export/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteExport = (id: any) => {
  return http.delete(`/export/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
