import styles from './Header.module.css';
import React from 'react';
import PropTypes from 'prop-types';

export const Header = ({children, renderSubHeader}) => (
    <div className={styles.header}>
        <h1>
            {children}
        </h1>
        {renderSubHeader ? renderSubHeader() : null}
    </div>
)

Header.propTypes = {
    children: PropTypes.node.isRequired,
    renderSubHeader: PropTypes.func
}
