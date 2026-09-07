import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';

export type Product = {
  id: number;
  category: string;
  itemId: string;
  name: string;
  fullPrice: number;
  price: number;
  screen: string;
  capacity: string;
  color: string;
  ram: string;
  year: number;
  image: string;
};

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.cardLink}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.card__photo}
        />
        <div className={styles.card__info}>
          <h3 className={styles.card__title}>{product.name}</h3>
          <div className={styles.price}>
            <p className={styles.card__price}>${product.price}</p>
            <p className={styles.card__price__sale}>${product.fullPrice}</p>
          </div>
        </div>
        <div className={styles.card__detailInfo}>
          <div className={styles.card__detailInfoItem}>
            <p className={styles.name}>Screen</p>
            <p className={styles.detail}>{product.screen}</p>
          </div>
          <div className={styles.card__detailInfoItem}>
            <p className={styles.name}>Capacity</p>
            <p className={styles.detail}>{product.capacity}</p>
          </div>
          <div className={styles.card__detailInfoItem}>
            <p className={styles.name}>RAM</p>
            <p className={styles.detail}>{product.ram}</p>
          </div>
        </div>
      </Link>
      <div className={styles.card__buttons}>
        <button className={styles.add}>Add to cart</button>
        <button className={styles.favourite}>
          <img
            src="/img/icons/favourites-icon.svg"
            alt="Favourites icon"
            className={styles.favourite__icon}
          />
        </button>
      </div>
    </div>
  );
};
