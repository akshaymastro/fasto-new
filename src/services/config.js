import axios from 'axios';
export const client = axios.create({
  baseURL: 'http://10.0.2.2:4000/'
});
client.interceptors.response.use(
  (response) => response,
  (error) => error.response
);