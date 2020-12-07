import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import styles from './BookDetails.module.css';
import { Header } from '../../components/Header/Header';
import Spinner from 'react-bootstrap/Spinner';

export const BookDetails = () => {
    const params = useParams();
    const history = useHistory();
    const bookId = params.id;
    const [bookDetails, setBookDetails] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/books/${bookId}`)
          .then(response => response.ok ? response.json() : Promise.reject(response))
          .then(book => {
              setBookDetails(book);
              setLoading(false);
          })
          .catch(() => {
              setLoading(false);
              setError(true);
          });
    }, [bookId]);

    const handleRemove = async () => {
        const response = await fetch(`/api/books/${bookId}`, { method: 'delete' });
        if (response.ok) {
            history.push('/books');
        }
    };

    return (
      <div className={styles.container}>
          <Header>
              Book Details
          </Header>
          {loading ? <Spinner animation="border" variant="primary" data-testid={'spinner'} /> : null}
          {error ? <Alert variant={'danger'}>Unable to fetch book details, please try again.</Alert> : null}
          {
              bookDetails ? (
                  <div className={styles.details}>
                      <div className={styles.title}>
                          {bookDetails.title}
                      </div>
                      <div className={styles.author}>
                          {bookDetails.author}
                      </div>
                      <div className={styles.pages}>
                          <strong>Pages:</strong>
                          <div>{bookDetails.pages}</div>
                      </div>
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
