import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getAllSupplier = ({ page }: { page: string | null }) => {
  return http.get('/supplier', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getSupplier = (id: string | undefined) => {
  return http.get(`/supplier/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addSupplier = (data: { name: string }) => {
  return http.post(`/supplier`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateSupplier = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/supplier/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteSupplier = (id: any) => {
  return http.delete(`/supplier/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const fetchAllSupplier = async (): Promise<any[]> => {
  let allData: any[] = [];
  let hasNext = true;
  let page = '';
  while (hasNext) {
    const response = await http.get('/supplier', {
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
