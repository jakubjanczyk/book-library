import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';

export const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('/api/books')
          .then(response => response.ok ? response.json() : Promise.reject(response))
          .then(fetchedBooks => {
              setBooks(orderBy(fetchedBooks, 'title', 'asc'));
              setLoading(false);
          })
          .catch(() => {
              setLoading(false);
              setError(true);
          });
    }, []);

    return { books, error, loading };
};
