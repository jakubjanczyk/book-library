import { useHistory, useParams } from 'react-router';
import { useEffect, useState } from 'react';

const useBookId = () => {
    const params = useParams();
    return params.id;
};

export const useBookDetails = () => {
    const bookId = useBookId();
    const [bookDetails, setBookDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/books/${bookId}`)
          .then(response => response.ok ? response.json() : Promise.reject(response))
          .then(book => {
              setBookDetails(book);
              setLoading(false);
          })
          .catch(() => {
              setLoading(false);
              setError(true);
          });
    }, [bookId]);

    return { loading, error, bookDetails };
};
export const useBookRemove = () => {
    const history = useHistory();
    const bookId = useBookId();

    return async () => {
        const response = await fetch(`/api/books/${bookId}`, { method: 'delete' });
        if (response.ok) {
            history.push('/books');
        }
    };
};
