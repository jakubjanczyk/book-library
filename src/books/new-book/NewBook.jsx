import React from 'react';
import { useHistory } from 'react-router';
import { Header } from '../../components/Header/Header';
import { useBookSave } from './NewBook.hooks';
import { BookForm } from '../components/BookForm/BookForm';
import { PageContainer } from '../../components/PageContainer/PageContainer';

export const NewBook = () => {
    const { save, saveError } = useBookSave();
    const history = useHistory();

    const handleCancel = () => {
        history.push(`/books`);
    };

    return (
      <PageContainer>
          <Header>
              New book
          </Header>
          <BookForm initialState={{ title: '', author: '', pages: '' }} save={save} cancel={handleCancel} error={saveError}/>
      </PageContainer>
    );
};

