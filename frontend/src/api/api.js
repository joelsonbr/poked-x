import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Sem o /api aqui
})

export default api