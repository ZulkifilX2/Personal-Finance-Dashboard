import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getTransactions = async (skip = 0, limit = 100) => {
    const response = await axios.get(`${API_URL}/transactions`, {
        params: { skip, limit }
    });
    return response.data;
};

export const getStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};
