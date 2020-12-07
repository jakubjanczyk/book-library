import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import { ButtonToolbar } from 'react-bootstrap';
import styles from './NewBook.module.css';
import { Header } from '../../components/Header/Header';

export const NewBook = () => {
    const [formState, setFormState] = useState({ title: '', author: '', pages: '' });
    const [error, setError] = useState(false);
    const history = useHistory();

    const updateField = (field) => (event) => {
        const value = event.target.value;
        setFormState((previousState) => ({
            ...previousState,
            [field]: value
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setError(false);
        const body = JSON.stringify(formState);
        const headers = { 'Content-Type': 'application/json' };
        const response = await fetch('/api/books', { method: 'post', body, headers });
        if (response.ok) {
            const data = await response.json();
            history.push(`/books/${data.id}`);
        } else {
            setError(true);
        }
    };

    const handleCancel = () => {
        history.push(`/books`);
    };

    return (
      <div className={styles.container}>
          <Header>
              Add new book
          </Header>
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
                  <Button onClick={handleCancel} variant={'danger'}>
                      Cancel
                  </Button>
              </ButtonToolbar>
          </Form>
      </div>
    );
};
