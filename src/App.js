import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App.module.css';
import React from 'react';
import { Route, Switch } from 'react-router';
import { NewBook } from './books/new-book/NewBook';
import { BookDetails } from './books/book-details/BookDetails';
import { BooksList } from './books/books-list/BooksList';

function App() {
  return (
    <main className={styles.content}>
      <Switch>
        <Route path={'/books/new'} component={NewBook}/>
        <Route path={'/books/:id'} component={BookDetails}/>
        <Route path={['/books', '/']} component={BooksList}/>
      </Switch>
    </main>
  );
}

export default App;
