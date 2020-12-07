import styles from './Header.module.css';
import React from 'react';
import PropTypes from 'prop-types';

export const Header = ({children}) => (
    <div className={styles.header}>
        {children}
    </div>
)

Header.propTypes = {
    children: PropTypes.node.isRequired
}
