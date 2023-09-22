import React, { useState, useEffect, useCallback } from 'react';
import qs from "qs";
import { useNavigate, useLocation } from 'react-router';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _reduce from 'lodash/reduce';
import _forEach from 'lodash/forEach';
import _invert from 'lodash/invert';
import _isNil from 'lodash/isNil';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import FilterSection from './components/FilterSection';
import CatalogSection from './components/CatalogSection';

import useProductData from './hooks/useProductData';
import useFilterData from './hooks/useFilterData';
import { FILTER_KEYS, FILTER_TYPE_VS_KEY, PRODUCT_DATA_VIEWS } from './constants';
import { ReactComponent as LoadingIcon } from '../../loading.svg';

import styles from './catalogPage.module.scss';

const getInitialQueryParams = (location) => {
    if (_isEmpty(location.search)) {
        return { filterParams: {} };
    }
    const queryString = location?.search?.slice(1);
    const searchParams = qs.parse(queryString);
    const filterParams = _get(searchParams, 'filterParams', {});
    const page = _get(searchParams, 'page');
    const sort = _get(searchParams, 'sort');
    return {
        filterParams: {
            ...filterParams,
        },
        page,
        sort,
    };
};

const CatalogPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [queryParams, setQueryParams] = useState(() => getInitialQueryParams(location));
    const [latestSelectedFilterSectionInfo, setLatestSelectedFilterSectionInfo] = useState({});
    const [filters, setFilters] = useState({});
    const [filterTags, setFilterTags] = useState([]);
    const [dataView, setDataView] = useState(PRODUCT_DATA_VIEWS.GRID);
    const { filterData, isFilterDataError } = useFilterData({ filterParams: _get(queryParams, 'filterParams'), latestSelectedFilterSectionInfo });
    const { productData, isProductDataError } = useProductData({ queryParams });

    useEffect(() => {
        navigate({
            pathname: location.pathname,
            search: qs.stringify(queryParams),
        });
    }, [queryParams]);

    useEffect(() => {
        setFilters(filterData);
        if(!_isEmpty(latestSelectedFilterSectionInfo)) {
            window.localStorage.setItem('filters', JSON.stringify(filterData));
        }
    }, [filterData, latestSelectedFilterSectionInfo]);

    useEffect(() => {
        if(_isEmpty(latestSelectedFilterSectionInfo) && !_isEmpty(filterData)) {
            const newFilterTags = _reduce(filterData, (acc, filterValues, key) => {
                if (key === FILTER_KEYS.PERSONAS) {
                    return acc;
                }
                _forEach(filterValues, filterValue => {
                    if(_get(filterValue, 'selected') === true) {
                        acc.push({ ...filterValue, filterType: _get(_invert(FILTER_TYPE_VS_KEY), key) })
                    }
                });
                return acc;
            }, []);
            setFilterTags(newFilterTags);
        }
    }, [filterData, latestSelectedFilterSectionInfo]);

    const handleDataViewChange = useCallback((_, newValue) => {
        if (newValue !== null) {
            setDataView(newValue);
        }
    }, []);

    if (isFilterDataError || isProductDataError) {
       return <div className={styles.error}>Something Went Wrong!</div>;
    }

    if (_isNil(productData) || _isNil(filterData)) {
        return (
            <div className={styles.loadingContainer}>
                <LoadingIcon />
            </div>
        )
    }


    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerContainer}>
               <div className={styles.headerTitle}>Myntra Fashion Store</div>
               <div className={styles.headerTotalCount}>{`- ${_get(productData, 'totalCount', 0)} items`}</div>
                <div className={styles.viewToggleContainer}>
                    <ToggleButtonGroup
                        className={styles.toggle}
                        value={dataView}
                        exclusive
                        sx={{ height: '2rem' }}
                        onChange={handleDataViewChange}
                    >
                        <ToggleButton disableRipple value={PRODUCT_DATA_VIEWS.GRID}>Grid</ToggleButton>
                        <ToggleButton disableRipple value={PRODUCT_DATA_VIEWS.LIST}>List</ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
            <div className={styles.bodyContainer}>
                <FilterSection filters={filters} setFilters={setFilters} setLatestSelectedFilterSectionInfo={setLatestSelectedFilterSectionInfo} setQueryParams={setQueryParams} setFilterTags={setFilterTags} />
                <CatalogSection
                    setQueryParams={setQueryParams}
                    queryParams={queryParams}
                    filterTags={filterTags}
                    setFilterTags={setFilterTags}
                    setFilters={setFilters}
                    setLatestSelectedFilterSectionInfo={setLatestSelectedFilterSectionInfo}
                    filters={filters}
                    productData={productData}
                    dataView={dataView}
                />
            </div>
        </div>
    );
}


export default CatalogPage;