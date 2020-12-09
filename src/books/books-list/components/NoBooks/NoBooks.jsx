import styles from './NoBooks.module.css';
import { NewBookButton } from '../NewBookButton';
import React from 'react';

export const NoBooks = () => (
  <div className={styles.noBooksContainer}>
      <NewBookButton />
      <h4 className={styles.noBooksText}>
          <span>No books to display</span>
          <span>Either change filters or create a new book</span>
      </h4>
  </div>
);
