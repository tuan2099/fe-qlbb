import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getRoles = ({ page }: { page: string | null }) => {
  return http.get('/role', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addRole = (data: { name: string }) => {
  return http.post(`/role`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const deleteRole = (id: any) => {
  return http.delete(`/role/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
