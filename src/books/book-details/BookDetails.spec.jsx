import { BrowserRouter, Route } from 'react-router-dom';
import { BookDetails } from './BookDetails';
import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import nock from 'nock';
import userEvent from '@testing-library/user-event';
import { pathToBeChangedTo } from '../../test-utils/router-utils';

describe('Displaying book details', () => {
    beforeEach(() => {
        nock.cleanAll();
    });

    const bookId = '123';

    it('should fetch and display book details', async () => {
        const bookDetails = { id: bookId, title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' };
        givenBookFetch(bookId, bookDetails);
        renderComponent(bookId);

        expect(await screen.findByText('The Hobbit')).toBeInTheDocument();
        expect(await screen.findByText('J.R.R. Tolkien')).toBeInTheDocument();
        expect(await screen.findByText('310')).toBeInTheDocument();
    });

    it('should show spinner before finished loading', async () => {
        const bookDetails = { id: bookId, title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' };
        givenBookFetch(bookId, bookDetails);
        renderComponent(bookId);

        expect(screen.queryByTestId('spinner')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));
    });

    it('should show error message and hide spinner when could not fetch book details', async () => {
        givenBookFetchFailed(bookId);
        renderComponent(bookId);

        expect(await screen.findByRole('alert')).toHaveTextContent('Unable to fetch book details, please try again.');
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should allow to remove a book', async () => {
        const bookDetails = { id: bookId, title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' };
        givenBookFetch(bookId, bookDetails);
        renderComponent(bookId);

        const removeButton = await screen.findByRole('button', { name: 'Remove' });
        givenBookRemove(bookId, bookDetails);
        userEvent.click(removeButton);

        await waitFor(pathToBeChangedTo('/books'));
    });

    it('should allow to get back to list', async () => {
        const bookDetails = { id: bookId, title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' };
        givenBookFetch(bookId, bookDetails);
        renderComponent(bookId);

        const backButton = await screen.findByRole('link', { name: 'Back to library' });
        userEvent.click(backButton);

        await waitFor(pathToBeChangedTo('/books'));
    });

    it('should allow to edit a book', async () => {
        const bookDetails = { id: bookId, title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' };
        givenBookFetch(bookId, bookDetails);
        renderComponent(bookId);

        const editButton = await screen.findByRole('button', { name: 'Edit' });
        userEvent.click(editButton);

        givenBookUpdate(bookId, { id: bookId, title: 'Harry Potter', author: 'J.K. Rowling', pages: '550' })
        userEvent.clear(titleInput());
        userEvent.clear(authorInput());
        userEvent.clear(pagesInput());
        userEvent.type(titleInput(), 'Harry Potter');
        userEvent.type(authorInput(), 'J.K. Rowling');
        userEvent.type(pagesInput(), '550');
        userEvent.click(saveButton());

        expect(await screen.findByText('Harry Potter')).toBeInTheDocument();
        expect(await screen.findByText('J.K. Rowling')).toBeInTheDocument();
        expect(await screen.findByText('550')).toBeInTheDocument();
    });

    const renderComponent = (bookId) => {
        window.history.pushState({}, 'Book details', `/books/${bookId}`);
        return render(
          <BrowserRouter>
            <Route path={'/books/:id'} component={BookDetails}/>
        </BrowserRouter>
        );
    };

    const titleInput = () => screen.getByLabelText('Title');
    const authorInput = () => screen.getByLabelText('Author');
    const pagesInput = () => screen.getByLabelText('Pages');
    const saveButton = () => screen.getByRole('button', { name: 'Save' });

    const givenBookFetch = (bookId, bookDetails) => {
        nock('http://localhost')
          .get(`/api/books/${bookId}`)
          .once()
          .reply(200, bookDetails);
    };
    const givenBookUpdate = (bookId, bookDetails) => {
        nock('http://localhost')
          .put(`/api/books/${bookId}`, bookDetails)
          .once()
          .reply(204);
    };
    const givenBookRemove = (bookId) => {
        nock('http://localhost')
          .delete(`/api/books/${bookId}`)
          .once()
          .reply(204);
    };
    const givenBookFetchFailed = (bookId) => {
        nock('http://localhost')
          .get(`/api/books/${bookId}`)
          .once()
          .reply(500, {});
    };
});
