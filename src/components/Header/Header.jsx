import styles from './Header.module.css';
import React from 'react';
import PropTypes from 'prop-types';

export const Header = ({children}) => (
    <h1 className={styles.header}>
        {children}
    </h1>
)

Header.propTypes = {
    children: PropTypes.node.isRequired
}
