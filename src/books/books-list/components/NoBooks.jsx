import styles from '../BooksList.module.css';
import { NewBookButton } from './NewBookButton';
import React from 'react';

export function NoBooks() {
    return <div className={styles.noBooksContainer}>
        <NewBookButton />
        <h4 className={styles.noBooksText}>There are no books yet. Change filters or create a new book.</h4>
    </div>;
}
