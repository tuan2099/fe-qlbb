import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllProject = ({ page }: { page: string | null }) => {
  return http.get('/project', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getProject = (id: string | undefined) => {
  return http.get(`/project/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addProject = (data: { name: string }) => {
  return http.post(`/project`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateProject = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/project/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteProject = (id: any) => {
  return http.delete(`/project/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
