import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getWarehouses = ({ page }: { page: string | null }) => {
    return http.get('/warehouse', {
        params: {
            page: page,
        },
        headers: {
            Authorization: `Bearer ${getStorage('accessToken')}`,
        },
    });
};

export const getWarehouseDetail = (id: string | undefined) => {
    return http.get(`/warehouse/${id}`, {
        headers: {
            Authorization: `Bearer ${getStorage('accessToken')}`,
        },
    });
};

export const addWarehouse = (data: { name: string }) => {
    return http.post(`/warehouse`, data, {
        headers: {
            Authorization: `Bearer ${getStorage('accessToken')}`,
        },
    });
};

export const updateWarehouse = ({ id, data }: { id: string | undefined; data: any }) =>
    http.put(`/warehouse/${id}`, data, {
        headers: {
            Authorization: `Bearer ${getStorage('accessToken')}`,
        },
    });

export const deleteWarehouse = (id: any) => {
    return http.delete(`/warehouse/${id}`, {
        headers: {
            Authorization: `Bearer ${getStorage('accessToken')}`,
        },
    });
};
