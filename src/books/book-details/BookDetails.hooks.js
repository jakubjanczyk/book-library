import { useHistory, useParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { httpClient } from '../../common/http-client';
import { useFetchRequest } from '../../common/use-fetch-request';

const useBookId = () => {
    const params = useParams();
    return params.id;
};

export const useBookDetails = () => {
    const bookId = useBookId();
    const [bookDetails, setBookDetails] = useState();
    const { error, loading, fetchData } = useFetchRequest();
    const [updateError, setUpdateError] = useState(false);

    useEffect(() => {
        let mounted = true;
        const fetchDetails = async () => {
            setUpdateError(false);
            const book = await fetchData(`books/${bookId}`);
            if (mounted) {
                setBookDetails(book);
            }
        };
        fetchDetails();
        return () => {
            mounted = false;
        };
    }, [bookId, fetchData]);

    const update = useCallback(async (newDetails) => {
        setUpdateError(false);
        try {
            const updated = await httpClient().put(`books/${bookId}`, newDetails);
            setBookDetails(updated);
        } catch (e) {
            setUpdateError(true);
            throw e;
        }
    }, [bookId]);

    return { loading, error, bookDetails, update, updateError };
};

export const useBookRemove = () => {
    const history = useHistory();
    const bookId = useBookId();

    return async () => {
        await httpClient().delete(`books/${bookId}`);
        history.push('/books');
    };
};
