// import { ROUTES } from '@/router'
import axios, { AxiosInstance } from 'axios';

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
    );
  }
}

const http = new Http().instance;
export default http;
