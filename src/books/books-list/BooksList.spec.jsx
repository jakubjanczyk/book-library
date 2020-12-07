import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { BooksList } from './BooksList';
import nock from 'nock';
import userEvent from '@testing-library/user-event';
import { pathToBeChangedTo } from '../../test-utils/router-utils';

describe('Books list', () => {
    beforeEach(() => {
        nock.cleanAll();
    });

    it('should fetch and display list of available books', async () => {
        const books = [
            { id: '1', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', pages: '423' },
            { id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' },
        ];
        givenBooksFetched(books);
        renderComponent();

        expect(await getDisplayedBooksTitles()).toEqual(['The Fellowship of the Ring', 'The Hobbit']);
    });

    it('should display books alphabetically', async () => {
        const books = [
            { id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' },
            { id: '1', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', pages: '423' },
        ];
        givenBooksFetched(books);
        renderComponent();

        expect(await getDisplayedBooksTitles()).toEqual(['The Fellowship of the Ring', 'The Hobbit']);
    });

    it('should show spinner before finished loading', async () => {
        givenBooksFetched([]);
        renderComponent();

        expect(screen.queryByTestId('spinner')).toBeInTheDocument();
        await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));
    });

    it('should show error message and hide spinner when could not fetch book details', async () => {
        givenBooksFetchFailed();
        renderComponent();

        expect(await screen.findByRole('alert')).toHaveTextContent('Unable to fetch books list, please try again.');
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should move to book details page when book clicked', async () => {
        const books = [
            { id: '1', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', pages: '423' },
            { id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310' },
        ];
        givenBooksFetched(books);
        renderComponent();

        const bookItems = await screen.findAllByTestId('book-item');
        const bookItem = bookItems.find(item => item.textContent.match(/The Hobbit/));
        userEvent.click(bookItem);

        await waitFor(pathToBeChangedTo('/books/2'));
    });

    it('should allow to create new book', async () => {
        givenBooksFetched([]);
        renderComponent();

        userEvent.click(await screen.findByRole('button', {name: /New book/}));

        await waitFor(pathToBeChangedTo('/books/new'));
    });

    const renderComponent = () => {
        window.history.pushState({}, 'Books list', `/books`);
        return render(
          <BrowserRouter>
              <BooksList />
          </BrowserRouter>
        );
    }

    const getDisplayedBooksTitles = async () => {
        const bookTitles = await screen.findAllByTestId('book-title');
        return bookTitles.map(el => el.textContent);
    };

    const givenBooksFetched = books => {
        nock('http://localhost')
          .get('/api/books')
          .reply(200, books);
    };

    const givenBooksFetchFailed = books => {
        nock('http://localhost')
          .get('/api/books')
          .reply(500, { });
    };
});
