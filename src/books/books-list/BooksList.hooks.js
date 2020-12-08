import { useEffect, useState } from 'react';
import { orderBy } from 'lodash';
import { useFetchRequest } from '../../common/use-fetch-request';

export const useBooks = () => {
    const [books, setBooks] = useState([]);
    const { error, loading, fetchData } = useFetchRequest();

    useEffect(() => {
        const doFetch = async () => {
            const fetchedBooks = await fetchData('books');
            setBooks(orderBy(fetchedBooks, 'title', 'asc'));
        };
        doFetch();
    }, [fetchData]);

    return { books, error, loading };
};
