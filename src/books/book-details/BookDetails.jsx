import React, { useCallback, useState } from 'react';
import styles from './BookDetails.module.css';
import { Header } from '../../components/Header/Header';
import { useBookDetails, useBookRemove } from './BookDetails.hooks';
import { LoadingErrorState } from '../../components/LoadingErrorState/LoadingErrorState';
import { BookForm } from '../components/BookForm/BookForm';
import { BookDetailsView } from './BookDetailsView';
import { BackToLibrary } from '../../components/BackToLibrary/BackToLibrary';


export const BookDetails = () => {
    const { loading, error, bookDetails, update, updateError } = useBookDetails();
    const handleRemove = useBookRemove();
    const [editing, setEditing] = useState(false);

    const handleEdit = useCallback(() => setEditing(true), []);
    const closeEdit = useCallback(() => setEditing(false), []);
    const handleSave =  useCallback((details) => update(details).then(closeEdit), [closeEdit, update]);
    
    return (
      <div className={styles.container}>
          <Header renderSubHeader={() => <BackToLibrary/>}>
              Book Details
          </Header>
          <LoadingErrorState errorText={'Unable to fetch book details, please try again.'} loading={loading} error={error}/>
          {
              bookDetails && (
                editing
                  ? <BookForm cancel={closeEdit} error={updateError} save={handleSave} initialState={bookDetails}/>
                  : <BookDetailsView bookDetails={bookDetails} handleEdit={handleEdit} handleRemove={handleRemove} />
                )
          }
      </div>
    );
};
