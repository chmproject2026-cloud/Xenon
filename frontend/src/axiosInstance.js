import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://backend-ili2.onrender.com/api',
});

export default instance;
