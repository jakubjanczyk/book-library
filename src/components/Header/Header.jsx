import styles from './Header.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import { BackToLibrary } from '../BackToLibrary/BackToLibrary';

export const Header = ({children, backToLibrary}) => (
    <div className={styles.header}>
        <h1>
            {children}
        </h1>
        {backToLibrary ? <BackToLibrary /> : null}
    </div>
)

Header.propTypes = {
    children: PropTypes.node.isRequired,
    backToLibrary: PropTypes.bool
}
