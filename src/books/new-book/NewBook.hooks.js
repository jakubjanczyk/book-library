import { useHistory } from 'react-router';
import { useState } from 'react';

export const useBookSave = () => {
    const history = useHistory();
    const [error, setError] = useState(false);

    const handleSave = (bookData) => async (event) => {
        event.preventDefault();
        setError(false);
        const body = JSON.stringify(bookData);
        const headers = { 'Content-Type': 'application/json' };
        const response = await fetch('/api/books', { method: 'post', body, headers });
        if (response.ok) {
            const data = await response.json();
            history.push(`/books/${data.id}`);
        } else {
            setError(true);
        }
    };

    return { save: handleSave, saveError: error };
};
