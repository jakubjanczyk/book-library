import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageContainer.module.css'

export const PageContainer = ({children}) => {
    return (
      <div className={styles.container}>
          {children}
      </div>
    )
};

PageContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}
