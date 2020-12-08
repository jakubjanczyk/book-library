import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
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

    it('should display placeholder when no books fetched', async () => {
        givenBooksFetched([]);
        renderComponent();

        expect(await noBooksPlaceholder()).toBeInTheDocument();
    });

    it('should fetch and display list of available books', async () => {
        const books = [
            fellowshipOfTheRing(),
            theHobbit(),
        ];
        givenBooksFetched(books);
        renderComponent();

        expect(await getDisplayedBooksTitles()).toEqual(['The Fellowship of the Ring', 'The Hobbit']);
    });

    it('should display books alphabetically', async () => {
        const books = [
            theHobbit(),
            fellowshipOfTheRing(),
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
            fellowshipOfTheRing(),
            theHobbit(),
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

        userEvent.click(await screen.findByRole('button', { name: /New book/ }));

        await waitFor(pathToBeChangedTo('/books/new'));
    });

    it('should allow to create new book when some books exist', async () => {
        const books = [
            fellowshipOfTheRing(),
            theHobbit(),
        ];
        givenBooksFetched(books);
        renderComponent();

        userEvent.click(await screen.findByRole('button', { name: /New book/ }));

        await waitFor(pathToBeChangedTo('/books/new'));
    });

    describe('handling categories', () => {
        it('should display available categories to select from', async () => {
            givenBooksFetched([]);
            renderComponent();

            const categoriesList = await screen.findByTestId('categories');
            const allCategories = within(categoriesList).getAllByRole('listitem').map(item => item.textContent);

            expect(allCategories).toEqual(['Fantasy', 'Sci-Fi', 'Biography', 'History', 'Unassigned']);
        });

        it('should click on category and filter books by this category', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890', category: 'Sci-Fi' },
            ]);
            renderComponent();

            await clickCategory('Fantasy');

            expect(await getDisplayedBooksTitles()).toEqual(['The Fellowship of the Ring', 'The Hobbit']);
        });

        it('should show no books placeholder when filtered out everything', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890', category: 'Sci-Fi' },
            ]);
            renderComponent();

            await clickCategory('History');

            expect(await noBooksPlaceholder()).toBeInTheDocument();
        });

        it('should click second time on category and show all books', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890', category: 'Sci-Fi' },
            ]);
            renderComponent();

            await clickCategory('Fantasy');
            await clickCategory('Fantasy');

            expect(await getDisplayedBooksTitles()).toEqual(['Dune', 'The Fellowship of the Ring', 'The Hobbit']);
        });

        it('should allow to select unassigned books', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890' },
            ]);
            renderComponent();

            await clickCategory('Unassigned');

            expect(await getDisplayedBooksTitles()).toEqual(['Dune']);
        });

        it('should save selected category to URL', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890', category: 'Sci-Fi' },
            ]);
            renderComponent();

            await clickCategory('Fantasy');

            expect(window.location.search).toEqual('?category=Fantasy');
        });

        it('should restore selected category from URL', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890', category: 'Sci-Fi' },
            ]);

            renderComponent({ searchString: '?category=Fantasy' });

            expect(await getDisplayedBooksTitles()).toEqual(['The Fellowship of the Ring', 'The Hobbit']);
        });
    });

    describe('handling sort', () => {
        it('should display available sort options', async () => {
            givenBooksFetched([
                fellowshipOfTheRing()
            ]);
            renderComponent();

            const sortSelect = await getSortSelect();
            const allSortOptions = within(sortSelect).getAllByRole('option').map(item => item.textContent);

            expect(allSortOptions).toEqual(['Ascending', 'Descending', 'Most recent']);
        });

        it('should not display sort select when no books displayed', async () => {
            givenBooksFetched([]);
            renderComponent();

            await waitForElementToBeRemoved(() => screen.getByTestId('spinner'));

            expect(screen.queryByLabelText('Sort:')).not.toBeInTheDocument();
        });

        it('should have ascending selected by default', async () => {
            givenBooksFetched([
                fellowshipOfTheRing()
            ]);
            renderComponent();

            const sortSelect = await getSortSelect();

            expect(sortSelect).toHaveDisplayValue('Ascending');
        });

        it('should change sort to descending', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit()
            ]);
            renderComponent();

            const sortSelect = await getSortSelect();
            userEvent.selectOptions(sortSelect, 'Descending');

            expect(await getDisplayedBooksTitles()).toEqual(['The Hobbit', 'The Fellowship of the Ring']);
        });

        it('should change sort to most recent', async () => {
            givenBooksFetched([
                fellowshipOfTheRing({created: 12345}),
                theHobbit({created: 23456})
            ]);
            renderComponent();

            const sortSelect = await getSortSelect();
            userEvent.selectOptions(sortSelect, 'Most recent');

            expect(await getDisplayedBooksTitles()).toEqual(['The Hobbit', 'The Fellowship of the Ring']);
        });

        it('should save sort order to URL', async () => {
            givenBooksFetched([
                fellowshipOfTheRing({created: 345678}),
                theHobbit({created: 12345})
            ]);
            renderComponent();

            const sortSelect = await getSortSelect();
            userEvent.selectOptions(sortSelect, 'Most recent');

            expect(window.location.search).toEqual('?sort=recent');
        });

        it('should restore sort order from URL', async () => {
            givenBooksFetched([
                fellowshipOfTheRing({created: 345678}),
                theHobbit({created: 12345})
            ]);
            renderComponent({ searchString: '?sort=desc' });

            expect(await getDisplayedBooksTitles()).toEqual(['The Hobbit', 'The Fellowship of the Ring']);
        });

    });

    describe('combining filters', () => {
        it('should handle both sort and category filter in url', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit()
            ]);
            renderComponent();

            await clickCategory('Fantasy');
            const sortSelect = await getSortSelect();
            userEvent.selectOptions(sortSelect, 'Most recent');

            expect(window.location.search).toEqual('?category=Fantasy&sort=recent');
        });

        it('should restore all filters from url', async () => {
            givenBooksFetched([
                fellowshipOfTheRing(),
                theHobbit(),
                { id: '3', title: 'Dune', author: 'Frank Herbert', pages: '890', category: 'Sci-Fi' },
            ]);

            renderComponent({searchString: '?category=Fantasy&sort=desc'});

            expect(await getDisplayedBooksTitles()).toEqual(['The Hobbit', 'The Fellowship of the Ring']);
        });
    });

    const renderComponent = ({ searchString = '' } = {}) => {
        window.history.pushState({}, 'Books list', `/books${searchString}`);
        return render(
          <BrowserRouter>
              <BooksList />
          </BrowserRouter>
        );
    };

    const noBooksPlaceholder = async () => screen.findByText('There are no books yet. Change filters or create a new book.');

    const getSortSelect = async () => await screen.findByLabelText('Sort:');

    const getDisplayedBooksTitles = async () => {
        const bookTitles = await screen.findAllByTestId('book-title');
        return bookTitles.map(el => el.textContent);
    };

    const clickCategory = async (category) => {
        const categoriesList = await screen.findByTestId('categories');
        userEvent.click(within(categoriesList).getByText(category));
    };

    const givenBooksFetched = books => {
        nock('http://localhost')
          .get('/api/books')
          .reply(200, books);
    };

    const givenBooksFetchFailed = () => {
        nock('http://localhost')
          .get('/api/books')
          .reply(500, {});
    };

    const fellowshipOfTheRing = (config = {}) => ({ id: '1', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', pages: '423', category: 'Fantasy', created: 12345, ...config });
    const theHobbit = (config = {}) => ({ id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: '310', category: 'Fantasy', created: 23456, ...config });

});
