import { useHistory } from 'react-router';
import { useCallback, useState } from 'react';
import { httpClient } from '../../common/http-client';

export const useBookSave = () => {
    const history = useHistory();
    const [error, setError] = useState(false);

    const handleSave = useCallback(async (bookData) => {
        setError(false);
        try {
            const data = await httpClient().post('books', {...bookData, created: Date.now()});
            history.push(`/books/${data.id}`);
        } catch (e) {
            setError(true);
        }
    }, [history]);

    return { save: handleSave, saveError: error };
};
