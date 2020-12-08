import { NewBook } from './NewBook';
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { BrowserRouter } from 'react-router-dom';
import { pathToBeChangedTo } from '../../test-utils/router-utils';

describe('Adding a book', () => {
    beforeEach(() => {
        nock.cleanAll()
    })

    it('should display necessary inputs to create a book', () => {
        renderComponent();

        expect(titleInput()).toBeInTheDocument();
        expect(authorInput()).toBeInTheDocument();
        expect(pagesInput()).toBeInTheDocument();
    });

    it('should allow to type value for title', () => {
        renderComponent();

        userEvent.type(titleInput(), 'The Hobbit');

        expect(titleInput()).toHaveValue('The Hobbit');
    });

    it('should allow to type value for author', () => {
        renderComponent();

        userEvent.type(authorInput(), 'J.R.R. Tolkien');

        expect(authorInput()).toHaveValue('J.R.R. Tolkien');
    });

    it('should allow to type value for pages', () => {
        renderComponent();

        userEvent.type(pagesInput(), '310');

        expect(pagesInput()).toHaveValue(310);
    });

    it('should show available categories to select', () => {
        renderComponent();

        const allOptions = within(categorySelect()).getAllByRole('option').map(option => option.textContent);

        expect(allOptions).toEqual(['Fantasy', 'Sci-Fi', 'Biography', 'History']);
    });

    it('should allow to select category', () => {
        renderComponent();

        userEvent.selectOptions(categorySelect(), 'Biography')

        expect(categorySelect()).toHaveValue('Biography');
    });

    it('should allow to save new book with all fields provided and change page to details', async () => {
        givenSaveRequest({ title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310', category: 'Fantasy' }, '12345');
        renderComponent();

        userEvent.type(titleInput(), 'The Hobbit');
        userEvent.type(authorInput(), 'J.R.R. Tolkien');
        userEvent.type(pagesInput(), '310');
        userEvent.selectOptions(categorySelect(), 'Fantasy');
        userEvent.click(saveButton());

        const pathToBeChanged = pathToBeChangedTo('/books/12345');
        await waitFor(pathToBeChanged);
    });

    it('should show error and keep data if save failed', async () => {
        givenSaveFailed();
        renderComponent();

        userEvent.type(titleInput(), 'The Hobbit');
        userEvent.type(authorInput(), 'J.R.R. Tolkien');
        userEvent.type(pagesInput(), '310');
        userEvent.click(saveButton());

        expect(await errorAlert()).toHaveTextContent('Something went wrong, please try again.');
        expect(window.location.pathname).toEqual('/books/new');
        expect(titleInput()).toHaveValue('The Hobbit');
    });

    it('should hide error when save clicked again', async () => {
        givenSaveFailed();
        renderComponent();

        userEvent.click(saveButton());
        expect(await errorAlert()).toBeInTheDocument();

        givenSaveRequest({title: '', author: '', pages: ''}, '123');
        userEvent.click(saveButton());
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should allow to cancel and go to the list of books', async () => {
        renderComponent();

        userEvent.click(cancelButton());

        await waitFor(pathToBeChangedTo('/books'));
    });

    const givenSaveRequest = (body, id) => {
        nock('http://localhost')
          .post('/api/books', body)
          .reply(201, { id });
    };

    const givenSaveFailed = () => {
        nock('http://localhost')
          .post('/api/books')
          .reply(500, { });
    };

    const renderComponent = () => {
        window.history.pushState({}, 'Test page', '/books/new')
        return render(<BrowserRouter><NewBook /></BrowserRouter>);
    }

    const titleInput = () => screen.getByLabelText('Title');
    const authorInput = () => screen.getByLabelText('Author');
    const pagesInput = () => screen.getByLabelText('Pages');
    const categorySelect = () => screen.getByLabelText('Category');
    const saveButton = () => screen.getByRole('button', { name: 'Save' });
    const cancelButton = () => screen.getByRole('button', { name: 'Cancel' });
    const errorAlert = () => screen.findByRole('alert');

});


