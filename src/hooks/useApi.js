import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = useCallback(async (method, endpoint, requestData = null) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            switch (method.toLowerCase()) {
                case 'get':
                    response = await apiService.get(endpoint);
                    break;
                case 'post':
                    response = await apiService.post(endpoint, requestData);
                    break;
                case 'put':
                    response = await apiService.put(endpoint, requestData);
                    break;
                case 'delete':
                    response = await apiService.delete(endpoint);
                    break;
                default:
                    throw new Error('Invalid HTTP method');
            }
            setData(response);
            return response;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        data,
        execute
    };
}; 