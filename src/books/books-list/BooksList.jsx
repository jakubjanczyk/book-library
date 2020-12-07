import React from 'react';
import { Header } from '../../components/Header/Header';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import styles from './BooksList.module.css';
import { useBooks } from './BooksList.hooks';
import { LoadingErrorState } from '../../components/LoadingErrorState/LoadingErrorState';

export const BooksList = () => {
    const { books, error, loading } = useBooks();

    return (
      <div className={styles.container}>
          <Header>
              Library
          </Header>
          <LoadingErrorState error={error} loading={loading} errorText={'Unable to fetch books list, please try again.'} />
          <div className={styles.list}>
              <NavLink to={'/books/new'}>
                  <Button>
                      New book
                  </Button>
              </NavLink>
              {books ?
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
                : null
              }
          </div>

      </div>
    );
};
