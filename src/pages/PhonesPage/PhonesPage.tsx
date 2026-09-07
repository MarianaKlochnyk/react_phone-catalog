/* eslint-disable @typescript-eslint/indent */
import styles from './PhonesPage.module.scss';
import { type Product } from '../../components/ProductCardSale';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { ProductList } from '../../components/ProductList';
import { Link, useSearchParams } from 'react-router-dom';

export const PhonesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [phones, setPhones] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(
    Number(searchParams.get('perPage')) || 'all',
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );
  const [typePerPage, setTypePerPage] = useState(
    searchParams.get('sort') || 'age',
  );

  const sortedPhones = [...phones];

  const getYear = (product: Product) => {
    const match = product.name.match(/\((\d{4})\)/);

    return match ? Number(match[1]) : 0;
  };

  if (typePerPage === 'age') {
    sortedPhones.sort((a, b) => getYear(b) - getYear(a));
  }

  if (typePerPage === 'title') {
    sortedPhones.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (typePerPage === 'price') {
    sortedPhones.sort((a, b) => a.priceDiscount - b.priceDiscount);
  }

  const totalPages =
    itemsPerPage === 'all' ? 1 : Math.ceil(sortedPhones.length / itemsPerPage);

  const visiblePhones =
    itemsPerPage === 'all'
      ? sortedPhones
      : sortedPhones.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage,
        );

  useEffect(() => {
    fetch('/api/phones.json')
      .then(response => response.json())
      .then(data => {
        setPhones(data);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (hasError) {
    return (
      <>
        <p>Something went wrong</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </>
    );
  }

  if (phones.length === 0) {
    return <p>There are no phones yet</p>;
  }

  const changePage = (page: number) => {
    setCurrentPage(page);

    const newParams = new URLSearchParams(searchParams);

    if (page === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', String(page));
    }

    setSearchParams(newParams);
  };

  return (
    <>
      <Header />
      <div className={styles.phones}>
        <div className={styles.phones__header}>
          <Link to={'/'}>
            <img
              src="img/icons/home.svg"
              alt="Home icon"
              className={styles.phones__homeIcon}
            />
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={styles.phones__arrowIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          <p className={styles.phones__headerText}>Phones</p>
        </div>

        <div className={styles.phones__info}>
          <h1 className={styles.phones__title}>Mobile phones</h1>
          <p className={styles.phones__amount}>{phones.length} models</p>
        </div>

        <div className={styles.phones__controls}>
          <div className={styles.phones__controlsItem}>
            <p className={styles.phones__nameOption}>Sort by</p>
            <label className={styles.visuallyHidden} htmlFor="typePerPage">
              Sort by
            </label>
            <select
              id="typePerPage"
              value={typePerPage}
              className={`${styles.phones__select} ${styles.phones__selectTypePerPage}`}
              onChange={event => {
                const value = event.target.value;

                setTypePerPage(value);
                setCurrentPage(1);

                const newParams = new URLSearchParams(searchParams);

                newParams.set('sort', value);
                newParams.delete('page');

                setSearchParams(newParams);
              }}
            >
              <option value={'age'}>Newest</option>
              <option value={'title'}>Alphabetically</option>
              <option value={'price'}>Cheapest</option>
            </select>
          </div>
          <div className={styles.phones__controlsItem}>
            <p className={styles.phones__nameOption}>Items on page</p>
            <label className={styles.visuallyHidden} htmlFor="itemsPerPage">
              Items on page
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              className={styles.phones__select}
              onChange={event => {
                const value = event.target.value;

                setItemsPerPage(value === 'all' ? 'all' : Number(value));
                setCurrentPage(1);

                const newParams = new URLSearchParams(searchParams);

                if (value === 'all') {
                  newParams.delete('perPage');
                } else {
                  newParams.set('perPage', value);
                  newParams.delete('page');
                }

                setSearchParams(newParams);
              }}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={'all'}>all</option>
            </select>
          </div>
        </div>

        <div className={styles.phones__products}>
          <ProductList products={visiblePhones} />
        </div>
        {totalPages > 1 && (
          <div className={styles.phones__buttons}>
            <button
              className={styles.phones__button}
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={styles.phones__icon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <div className={styles.phones__pagination}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  className={
                    currentPage === index + 1
                      ? styles['pagination__button--active']
                      : styles.pagination__button
                  }
                  key={index}
                  onClick={() => changePage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              className={styles.phones__button}
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={styles.phones__icon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
