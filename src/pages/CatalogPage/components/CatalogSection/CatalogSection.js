import React, { useCallback } from 'react';
import { produce } from 'immer';

import _get from 'lodash/get';
import _set from 'lodash/set';
import _toNumber from 'lodash/toNumber';
import _toString from 'lodash/toString';

import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

import CatalogHeader from './components/CatalogHeader';
import CatalogBody from './components/CatalogBody';

import styles from './catalogSection.module.scss';

const getPaginationButtonStyles = () => {
    return {
        textTransform: 'none',
        border: '1px solid #D4D5D9',
        '&:hover': {
            border: '1px solid black',
         }
     }
}

const CatalogSection = ({ setQueryParams, queryParams, filterTags, setFilterTags, setFilters, setLatestSelectedFilterSectionInfo, filters, productData, dataView }) => {

    const numberOfPages = Math.ceil(_get(productData, 'totalCount', 0) / 50);
    const currentPage = _toNumber(_get(queryParams, 'page', 1));

    const handlePageChange = useCallback((event, value) => {
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                _set(draft, 'page', _toString(value));
            })
            return newQueryParams;
        })
    }, [setQueryParams]);

    const handlePreviousButtonClick = useCallback(() => {
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                const currentPage = _toNumber(_get(draft, 'page'));
                _set(draft, 'page', _toString(currentPage-1));
            })
            return newQueryParams;
        })
    }, [setQueryParams]);

    const handleNextButtonClick = useCallback(() => {
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                const currentPage = _toNumber(_get(draft, 'page', 1));
                _set(draft, 'page', _toString(currentPage+1));
            })
            return newQueryParams;
        })
    }, [setQueryParams]);

    return (
        <div className={styles.container}>
             <CatalogHeader
                 setQueryParams={setQueryParams}
                 queryParams={queryParams}
                 filterTags={filterTags}
                 setFilterTags={setFilterTags}
                 setFilters={setFilters}
                 setLatestSelectedFilterSectionInfo={setLatestSelectedFilterSectionInfo}
                 filters={filters}
              />
             <CatalogBody productData={productData} dataView={dataView} />
             {numberOfPages > 1 && (<div className={styles.paginationContainer}>
                 <div className={styles.pageInfo}>{`Page ${currentPage} of ${numberOfPages}`}</div>
                    <div style={{ minWidth: '6.6rem' }}>
                         {currentPage !== 1 && (<Button sx={getPaginationButtonStyles()} variant="outlined" onClick={handlePreviousButtonClick}>
                             <div className={styles.paginationButton}>
                                 <ArrowBackIosNewOutlinedIcon sx={{ fontSize: '0.8rem', paddingRight: '0.2rem' }} />
                                 <div>Previous</div>
                             </div>
                         </Button>
                         )}
                     </div>
                  <Pagination className={styles.paginationElement} sx={{ padding: '0 4rem' }} count={numberOfPages} page={currentPage} onChange={handlePageChange} shape="rounded" hidePrevButton hideNextButton />
                 <div style={{ minWidth: '6.6rem' }}>
                     {currentPage !== numberOfPages && (<Button sx={getPaginationButtonStyles()} variant="outlined" onClick={handleNextButtonClick}>
                             <div className={styles.paginationButton}>
                                 <div>Next</div>
                                 <NavigateNextOutlinedIcon sx={{ fontSize: '1.3rem' }} />
                             </div>
                         </Button>
                     )}
                 </div>
             </div>
            )}

        </div>
    );
}


export default CatalogSection;