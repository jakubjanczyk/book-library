import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import React from 'react';
import PropTypes from 'prop-types';

export const LoadingErrorState = ({ loading, error, errorText }) => {
    return (
      <>
          {loading ? <Spinner animation="border" variant="primary" data-testid={'spinner'} /> : null}
          {error ? <Alert variant={'danger'}>{errorText}</Alert> : null}
      </>
    );
};

LoadingErrorState.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
    errorText: PropTypes.string.isRequired,
}
