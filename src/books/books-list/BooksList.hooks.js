import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { orderBy } from 'lodash';
import { useFetchRequest } from '../../common/use-fetch-request';
import { useHistory, useLocation } from 'react-router';
import * as qs from 'qs';

const parseFilters = searchString => qs.parse(searchString, { ignoreQueryPrefix: true });

const useFilters = () => {
    const history = useHistory();
    const location = useLocation();

    const filters = useMemo(() => parseFilters(location.search), [location]);

    const updateFilters = useCallback((newFilters) => {
        const previousFilters = parseFilters(history.location.search);
        const allFilters = {
            ...previousFilters,
            ...newFilters
        };
        const newLocationSearch = qs.stringify(allFilters, { addQueryPrefix: true });
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

    const orderedBooks = useCallback(books => {
        const { by, order } = filters.sort === 'recent' ? { by: 'created', order: 'desc' } : { by: 'title', order: filters.sort };
        return orderBy(books, by, order);
    }, [filters.sort]);

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
    }, [filters.category, orderedBooks]);

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
