import { useCallback, useState } from 'react';
import { httpClient } from './http-client';

export const useFetchRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async (url) => {
        setLoading(true);
        try {
            const data = await httpClient().get(url);
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(true);
        }
    }, []);

    return { loading, error, fetchData };
};
