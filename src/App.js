import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App.module.css';
import React from 'react';
import { Route, Switch } from 'react-router';
import { NewBook } from './books/new-book/NewBook';

function App() {
  return (
    <main className={styles.content}>
      <Switch>
        <Route path={'/books/new'} component={NewBook}/>
        <Route component={() => <div/>}/>
      </Switch>
    </main>
  );
}

export default App;
