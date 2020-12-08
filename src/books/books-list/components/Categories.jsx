import styles from '../BooksList.module.css';
import { categories } from '../../../static/categories';
import classNames from 'classnames';
import React from 'react';
import * as PropTypes from 'prop-types';

export const Categories = ({ currentCategory, onCategoryClick }) => {
    const allCategories = [...categories(), 'Unassigned'];
    return (
      <div data-testid={'categories'} className={styles.categories}>
          <h3 className={styles.categoriesHeader}>Select category</h3>
          <ul className={styles.categoriesList}>
              {allCategories.map((category) => (
                <li
                  className={classNames(styles.category, { [styles.categorySelected]: currentCategory === category })}
                  key={category}
                  onClick={onCategoryClick(category)}
                >
                    {category}
                </li>
              ))}
          </ul>
      </div>
    );
};

Categories.propTypes = {
    currentCategory: PropTypes.string,
    onCategoryClick: PropTypes.func.isRequired
};
