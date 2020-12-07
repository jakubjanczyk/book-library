import React from 'react';
import { useHistory } from 'react-router';
import styles from './NewBook.module.css';
import { Header } from '../../components/Header/Header';
import { useBookSave } from './NewBook.hooks';
import { BookForm } from '../components/BookForm/BookForm';

export const NewBook = () => {
    const { save, saveError } = useBookSave();
    const history = useHistory();

    const handleCancel = () => {
        history.push(`/books`);
    };

    return (
      <div className={styles.container}>
          <Header>
              Add new book
          </Header>
          <BookForm initialState={{ title: '', author: '', pages: '' }} save={save} cancel={handleCancel} error={saveError}/>
      </div>
    );
};

