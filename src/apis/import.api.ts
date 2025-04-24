import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllImport = ({ page }: { page: string | null }) => {
  return http.get('/import', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getImport = (id: string | undefined) => {
  return http.get(`/import/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addImport = (data: any) => {
  return http.post(`/import`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateImport = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/import/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteImport = (id: any) => {
  return http.delete(`/import/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
