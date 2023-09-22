import React from 'react';
import _map from 'lodash/map';
import _get from 'lodash/get';
import _round from 'lodash/round';

import StarIcon from '@mui/icons-material/Star';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import CatalogTable from './CatalogTable';
import { PRODUCT_DATA_VIEWS } from '../../../../constants';

import styles from './catalogBody.module.scss';

const ProductCard = ({ product }) => {

    return <div className={styles.productCardContainer}>
              <div className={styles.imageContainer}>
                  <LazyLoadImage width={200} height={200} src={_get(product, 'image')} alt="Product Image" />
                  <div className={styles.rating}>
                     <div style={{ paddingLeft: '0.4rem' }}>{_round(_get(product, 'rating'), 1)}</div>
                      <StarIcon sx={{ padding: '0rem 0.2rem', fontSize: '0.8rem', color:'#13958E' }} />
                      <div style={{ paddingRight: '0.2rem' }}>|</div>
                      <div style={{ paddingRight: '0.4rem' }}>{_get(product, 'noOfReviews')}</div>
                  </div>
              </div>
              <div className={styles.productDetails}>
                  <div className={styles.productTitle}>{_get(product, 'title')}</div>
                  <div className={styles.productDescription}>{_get(product, 'description')}</div>
                  <div className={styles.priceDetails}>
                      <div className={styles.newPrice}>{`Rs. ${_get(product, 'newPrice')}`}</div>
                      <div className={styles.oldPrice}>{`Rs. ${_get(product, 'oldPrice')}`}</div>
                      <div className={styles.discount}>{`(${_get(product, 'discount')}% OFF)`}</div>
                  </div>
              </div>
         </div>

}

const CatalogBody = ({ productData, dataView }) => {
    const products = _get(productData, 'productList', []);

    if (dataView === PRODUCT_DATA_VIEWS.GRID) {
        return (
            <div className={styles.container}>
                {_map(products, product => {
                  return <ProductCard key={product?.id} product={product} />
                })}
            </div>
        );
    }

    return <CatalogTable productList={products} />;
}


export default CatalogBody;