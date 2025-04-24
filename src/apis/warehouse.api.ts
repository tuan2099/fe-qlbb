import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getWarehouses = ({ page }: { page: string | null }) => {
  return http.get('/storage', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const getWarehouseDetail = (id: string | undefined) => {
  return http.get(`/storage/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const addWarehouse = (data: { name: string }) => {
  return http.post(`/storage`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const updateWarehouse = ({ id, data }: { id: string | undefined; data: any }) =>
  http.put(`/storage/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });

export const deleteWarehouse = (id: any) => {
  return http.delete(`/storage/${id}`, {
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};

export const fetchAllWarehouse = async (): Promise<any[]> => {
  let allData: any[] = [];
  let hasNext = true;
  let page = '';
  while (hasNext) {
    const response = await http.get('/storage', {
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
