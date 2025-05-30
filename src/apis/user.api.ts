import axios from 'axios';
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
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const registerUser = (data: any) =>
  http.post(`/user`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteUser = (id: any) => {
  return http.delete(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const uploadAvatar = ({ file, upload_preset }: { file: any; upload_preset: any }) => {
  return axios.post(
    'https://api.cloudinary.com/v1_1/dhm9uuyv1/image/upload',
    { file, upload_preset },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const updateProfile = (data: any) =>
  http.put('/auth/profile', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const fetchAllUser = async (): Promise<any[]> => {
  let allData: any[] = [];
  let hasNext = true;
  let page = '';
  while (hasNext) {
    const response = await http.get('/user', {
      params: {
        page,
        limit: 100,
      },

      headers: {
        Authorization: `Bearer ${getStorage('accessToken')}`,
      },
    });

    const data = response.data?.response[0].data || [];
    allData = [...allData, ...data];

    if (data.length < 100) {
      hasNext = false;
    } else {
    }
  }

  return allData;
};
