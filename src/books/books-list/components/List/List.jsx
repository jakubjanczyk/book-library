import styles from './List.module.css';
import { NewBookButton } from '../NewBookButton';
import Form from 'react-bootstrap/Form';
import { sortOptions } from '../../../../static/sortOptions';
import { NavLink } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

export const List = ({ books, onSortChange, sort }) => {
    return (
      <div className={styles.list}>
          <div className={styles.listHeader}>
              <NewBookButton />
              <Form.Group className={styles.sortElement}>
                  <Form.Label htmlFor={'sort'} className={styles.sortLabel}>
                      Sort:
                  </Form.Label>
                  <Form.Control
                    id={'sort'}
                    as={'select'}
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value)}
                  >
                      {sortOptions().map(sortOption => (<option key={sortOption.key} value={sortOption.key}>{sortOption.label}</option>))}
                  </Form.Control>
              </Form.Group>
          </div>
          <ul className={styles.items}>
              {
                  books.map(book => (
                    <NavLink key={book.id} data-testid={'book-item'} to={`/books/${book.id}`} className={styles.item}>
                        <h4 data-testid={'book-title'}>{book.title}</h4>
                        <p className={styles.itemAuthor}>{book.author}</p>
                    </NavLink>
                  ))
              }
          </ul>
      </div>
    );
};


List.propTypes = {
    books: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired
    })),
    onSortChange: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired
};
