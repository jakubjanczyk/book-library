import React from 'react';
import { Header } from '../../components/Header/Header';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import styles from './BooksList.module.css';
import { useBooks } from './BooksList.hooks';
import { LoadingErrorState } from '../../components/LoadingErrorState/LoadingErrorState';
import { categories } from '../../static/categories';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';
import { sortOptions } from '../../static/sortOptions';

const NewBookButton = () => (
  <NavLink to={'/books/new'}>
      <Button>
          New book
      </Button>
  </NavLink>
);

export const BooksList = () => {
    const { books, error, loading, updateFilters, filters } = useBooks();

    const allCategories = [...categories(), 'Unassigned'];

    const handleCategoryClick = (category) => () => {
        updateFilters({ category: filters.category === category ? undefined : category });
    };
    const handleSortChange = (event) => {
        updateFilters({ sort: event.target.value })
    };
    return (
      <div className={styles.container}>
          <Header>
              Library
          </Header>
          <LoadingErrorState error={error} loading={loading} errorText={'Unable to fetch books list, please try again.'} />
          {books ? (
              <div className={styles.dataContainer}>
                  <div data-testid={'categories'} className={styles.categories}>
                      <h3 className={styles.categoriesHeader}>Select category</h3>
                      <ul className={styles.categoriesList}>
                          {allCategories.map(category => (
                            <li
                              className={classNames(styles.category, { [styles.categorySelected]: filters.category === category })}
                              key={category}
                              onClick={handleCategoryClick(category)}>
                                {category}
                            </li>
                          ))}
                      </ul>
                  </div>
                  <div className={styles.listContainer}>
                  {
                      books.length === 0
                        ? (
                            <div className={styles.noBooksContainer}>
                                <NewBookButton />
                                <h4 className={styles.noBooksText}>There are no books yet. Change filters or create a new book.</h4>
                            </div>
                        )
                        : (
                          <div className={styles.list}>
                              <div className={styles.listHeader}>
                              <NewBookButton />
                              <Form.Group className={styles.sortElement}>
                                  <Form.Label htmlFor={'sort'} className={styles.sortLabel}>
                                      Sort:
                                  </Form.Label>
                                  <Form.Control id={'sort'} as={'select'} placeholder="Select category" value={filters.sort || 'asc'} onChange={handleSortChange}>
                                      {sortOptions().map(sortOption => (<option key={sortOption.key} value={sortOption.key}>{sortOption.label}</option>))}
                                  </Form.Control>
                              </Form.Group>
                              </div>
                              <ul className={styles.items}>
                                  {
                                      books.map(book => (
                                        <NavLink key={book.id} data-testid={'book-item'} to={`/books/${book.id}`} className={styles.item}>
                                            <h4 data-testid={'book-title'}>{book.title}</h4>
                                            <p>{book.author}</p>
                                        </NavLink>
                                      ))
                                  }
                              </ul>
                          </div>
                        )
                  }
                  </div>
              </div>
            )
            : null
          }
      </div>
    );
};
