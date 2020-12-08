import React from 'react';
import { Header } from '../../components/Header/Header';
import styles from './BooksList.module.css';
import { useBooks } from './BooksList.hooks';
import { LoadingErrorState } from '../../components/LoadingErrorState/LoadingErrorState';
import { Categories } from './components/Categories';
import { NoBooks } from './components/NoBooks';
import { List } from './components/List';

export const BooksList = () => {
    const { books, error, loading, updateFilters, filters } = useBooks();

    const handleCategoryClick = (category) => () => updateFilters({ category: filters.category === category ? undefined : category });
    const handleSortChange = (sort) => updateFilters({ sort });

    return (
      <div className={styles.container}>
          <Header>
              Library
          </Header>
          <LoadingErrorState error={error} loading={loading} errorText={'Unable to fetch books list, please try again.'} />
          {books ? (
              <div className={styles.dataContainer}>
                  <Categories onCategoryClick={handleCategoryClick} currentCategory={filters.category} />
                  <div className={styles.listContainer}>
                      {
                          books.length === 0
                            ? (<NoBooks />)
                            : (<List sort={filters.sort || 'asc'} onSortChange={handleSortChange} books={books} />)
                      }
                  </div>
              </div>
            )
            : null
          }
      </div>
    );
};
