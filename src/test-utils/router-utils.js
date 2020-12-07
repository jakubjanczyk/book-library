export const pathToBeChangedTo = newPath => () => new Promise((resolve, reject) => window.location.pathname === newPath ? resolve() : reject());
