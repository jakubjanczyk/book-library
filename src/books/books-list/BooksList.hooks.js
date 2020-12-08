import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { orderBy } from 'lodash';
import { useFetchRequest } from '../../common/use-fetch-request';
import { useHistory, useLocation } from 'react-router';
import * as qs from 'qs';

const orderedBooks = books => orderBy(books, 'title', 'asc');

const useFilters = () => {
    const history = useHistory();
    const location = useLocation();
    const filters = useMemo(() => qs.parse(location.search, { ignoreQueryPrefix: true }), [location.search]);
    const updateFilters = useCallback((newFilters) => {
        const newLocationSearch = qs.stringify(newFilters, { addQueryPrefix: true });
        if (newLocationSearch !== history.location) {
            history.push({ search: newLocationSearch, pathname: '/books' });
        }
    }, [history]);

    return { filters, updateFilters };
}

export const useBooks = () => {
    const [books, setBooks] = useState(undefined);
    const initialBooks = useRef(undefined);
    const { filters, updateFilters } = useFilters();
    const { error, loading, fetchData } = useFetchRequest();

    const updateBooks = useCallback(() => {
        if (initialBooks.current) {
            const filteredBooks = filters.category
              ? initialBooks.current.filter(book =>
                filters.category === 'Unassigned'
                  ? book.category === undefined
                  : book.category === filters.category
              )
              : initialBooks.current;
            setBooks(orderedBooks(filteredBooks));
        }
    }, [filters]);

    useEffect(() => {
        const doFetch = async () => {
            initialBooks.current = await fetchData('books');
            updateBooks();
        };
        
        doFetch();
    }, []);

    useEffect(() => {
        updateBooks();
    }, [filters, updateBooks]);

    return { books, error, loading, updateFilters, filters };
};
