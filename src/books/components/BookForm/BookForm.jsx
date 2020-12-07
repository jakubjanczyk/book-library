import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './BookForm.module.css';
import Alert from 'react-bootstrap/Alert';
import { ButtonToolbar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

export const BookForm = ({ initialState, save, cancel, error }) => {
    const [formState, setFormState] = useState(initialState);
    const updateField = (field) => (event) => {
        const value = event.target.value;
        setFormState((previousState) => ({
            ...previousState,
            [field]: value
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();
        save(formState);
    };
    return (
      <Form onSubmit={handleSave} className={styles.form}>
          {error ? <Alert variant={'danger'}>Something went wrong, please try again.</Alert> : null}
          <Form.Group className={styles.formGroup}>
              <Form.Label htmlFor={'title'}>
                  Title
              </Form.Label>
              <Form.Control id={'title'} type="text" placeholder="Enter title" value={formState.title} onChange={updateField('title')} />
          </Form.Group>
          <Form.Group className={styles.formGroup}>
              <Form.Label htmlFor={'author'}>
                  Author
              </Form.Label>
              <Form.Control id={'author'} type="text" placeholder="Enter author" value={formState.author} onChange={updateField('author')} />
          </Form.Group>
          <Form.Group className={styles.formGroup}>
              <Form.Label htmlFor={'pages'}>
                  Pages
              </Form.Label>
              <Form.Control id={'pages'} type="number" placeholder="Enter pages no." value={formState.pages} onChange={updateField('pages')} />
          </Form.Group>
          <ButtonToolbar className={styles.buttons}>
              <Button type={'submit'}>
                  Save
              </Button>
              <Button onClick={cancel} variant={'danger'}>
                  Cancel
              </Button>
          </ButtonToolbar>
      </Form>
    );
};

BookForm.propTypes = {
    initialState: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        pages: PropTypes.string.isRequired
    }).isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired
}
