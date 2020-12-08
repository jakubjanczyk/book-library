import styles from './BookDetails.module.css';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import React from 'react';
import * as PropTypes from 'prop-types';

export const BookDetailsView = ({ bookDetails, handleEdit, handleRemove }) => (
  <div className={styles.details}>
      <h2 className={styles.title}>
          {bookDetails.title}
      </h2>
      <p className={styles.author}>
          {bookDetails.author}
      </p>
      {
          bookDetails.category ? (
              <p className={styles.category}>
                  <strong>Category:</strong>
                  <span>{bookDetails.category}</span>
              </p>
            )
            : null
      }
      <p className={styles.pages}>
          <strong>Pages:</strong>
          <span>{bookDetails.pages}</span>
      </p>
      <ButtonToolbar className={styles.buttons}>
          <Button variant={'primary'} onClick={handleEdit}>Edit</Button>
          <Button variant={'danger'} onClick={handleRemove}>Remove</Button>
      </ButtonToolbar>
  </div>
);

BookDetailsView.propTypes = {
    bookDetails: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        pages: PropTypes.string.isRequired,
        category: PropTypes.string
    }).isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired
};
