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

export const fetchAllSignboard = async (): Promise<any[]> => {
  let allData: any[] = [];
  let hasNext = true;
  let page = '';
  while (hasNext) {
    const response = await http.get('/signboard', {
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
