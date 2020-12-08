import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import React from 'react';

export const NewBookButton = () => (
  <NavLink to={'/books/new'}>
      <Button>
          New book
      </Button>
  </NavLink>
);
