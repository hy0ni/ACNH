import axios from 'axios';

const API_BASE_URL = 'https://api.nookipedia.com';
const requestOptions = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-KEY": process.env.REACT_APP_API_KEY,
    "Accept-Version": "1.0.0",
  },
})

export async function fetchVillagers() {
  try {
    const response = await requestOptions.get('/villagers?game=nh');
    return response.data;
  } catch (error) {
    console.error('주민정보를 불러오는중 오류가 발생하였습니다.', error);
    throw error;
  }
}