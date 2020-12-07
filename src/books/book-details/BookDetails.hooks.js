import { useHistory, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';

const useBookId = () => {
    const params = useParams();
    return params.id;
};

export const useBookDetails = () => {
    const bookId = useBookId();
    const [bookDetails, setBookDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [updateError, setUpdateError] = useState(false);
    const unmountedRef = useRef(false);

    useEffect(() => {
        return () => {
            unmountedRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (!unmountedRef.current) {
            setUpdateError(false);
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
        }
    }, [bookId]);

    const update = (newDetails) => {
        setUpdateError(false);
        const newValue = { ...newDetails, id: bookId };
        const body = JSON.stringify(newValue);
        const headers = { 'Content-Type': 'application/json' };
        return fetch(`/api/books/${bookId}`, { method: 'put', body, headers })
          .then(response => response.ok ? Promise.resolve() : Promise.reject(response))
          .then(() => {
              setBookDetails(newValue);
          })
          .catch(() => {
              setUpdateError(true);
              return Promise.reject();
          });
    };

    return { loading, error, bookDetails, update, updateError };
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
