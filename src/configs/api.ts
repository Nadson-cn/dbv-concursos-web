// eslint-disable-next-line import/named
import axios, { AxiosInstance } from 'axios';

export class Api {
  axios: AxiosInstance;

  public constructor() {
    const thirtySeconds = 30000;
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: thirtySeconds,
    });
  }
}
