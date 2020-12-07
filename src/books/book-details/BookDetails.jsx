import React from 'react';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import styles from './BookDetails.module.css';
import { Header } from '../../components/Header/Header';
import { useBookDetails, useBookRemove } from './BookDetails.hooks';
import { LoadingErrorState } from '../../components/LoadingErrorState/LoadingErrorState';

export const BookDetails = () => {
    const { loading, error, bookDetails } = useBookDetails();
    const handleRemove = useBookRemove();

    return (
      <div className={styles.container}>
          <Header backToLibrary>
              Book Details
          </Header>
          <LoadingErrorState errorText={'Unable to fetch book details, please try again.'} loading={loading} error={error}/>
          {
              bookDetails ? (
                  <div className={styles.details}>
                      <h2 className={styles.title}>
                          {bookDetails.title}
                      </h2>
                      <p className={styles.author}>
                          {bookDetails.author}
                      </p>
                      <p className={styles.pages}>
                          <strong>Pages:</strong>
                          <span>{bookDetails.pages}</span>
                      </p>
                      <ButtonToolbar className={styles.buttons}>
                          <Button variant={'danger'} onClick={handleRemove}>Remove</Button>
                      </ButtonToolbar>
                  </div>
                )
                : null
          }
      </div>
    );
};
