import axios from 'axios';
import { String } from 'lodash';

import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllUser = ({ page }: { page: string | null }) => {
  return http.get('/user', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getUser = (id: string | undefined) => {
  return http.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateUser = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/user/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
