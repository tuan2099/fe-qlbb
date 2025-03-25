import { getStorage } from 'src/utils/getStorage';
import http from 'src/utils/http';

export const getPermisson = ({ page }: { page: string | null }) => {
  return http.get('/permission', {
    params: {
      page: page,
    },
    headers: {
      Authorization: `Bearer ${getStorage('accessToken')}`,
    },
  });
};
