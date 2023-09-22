import React, { useCallback } from 'react';
import { produce } from 'immer';
import _map from 'lodash/map';
import _get from 'lodash/get';
import _invert from 'lodash/invert';
import _forEach from 'lodash/forEach';
import _set from 'lodash/set';
import _values from 'lodash/values';

import RadioFilterSection from './components/RadioFilterSection';
import CheckboxFilterSection from './components/CheckboxFilterSection';
import { FILTER_TYPES, FILTER_TYPE_VS_KEY } from '../../constants';

import styles from './filterSection.module.scss';

const FILTER_TYPE_VS_RENDERER = {
    [FILTER_TYPES.PERSONAS]: RadioFilterSection,
    [FILTER_TYPES.CATEGORIES]: CheckboxFilterSection,
    [FILTER_TYPES.BRANDS]: CheckboxFilterSection,
    [FILTER_TYPES.PRICE_RANGES]: CheckboxFilterSection,
    [FILTER_TYPES.COLORS]: CheckboxFilterSection,
    [FILTER_TYPES.DISCOUNTS]: RadioFilterSection,
};

const FILTER_TYPE_VS_SECTION_TITLE = {
    [FILTER_TYPES.PERSONAS]: null,
    [FILTER_TYPES.CATEGORIES]: 'CATEGORIES',
    [FILTER_TYPES.BRANDS]: 'BRAND',
    [FILTER_TYPES.PRICE_RANGES]: 'PRICE',
    [FILTER_TYPES.COLORS]: 'COLOR',
    [FILTER_TYPES.DISCOUNTS]: 'DISCOUNT RANGE',
}

const getShouldShowClearFilterButton = (filters) => {
    let showShowClearFilterButton = false;
    const filterValues = _values(filters);
    _forEach(filterValues, (filterValue) => {
        _forEach(filterValue, (value) => {
            if (_get(value, 'selected')) {
                showShowClearFilterButton = true;
            }
        })
    });
    return showShowClearFilterButton;
}

const FilterSection = (props) => {
    const { filters, setQueryParams, setLatestSelectedFilterSectionInfo, setFilters, setFilterTags } = props;

    const handleClearAllFilters = useCallback(() => {
        setFilters(prevFilters => {
            const newFilters = produce(prevFilters, draft => {
                _forEach(draft, (filterValues) => {
                    _forEach(filterValues, (value) => {
                        _set(value, 'selected', false);
                    });
                });
            });
            return newFilters;
        });

        setLatestSelectedFilterSectionInfo({
            filterType: undefined,
            filterData: undefined,
        });
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                _set(draft, 'filterParams', {});
            })
            return newQueryParams;
        });
        setFilterTags([]);
    }, [setFilterTags, setQueryParams, setLatestSelectedFilterSectionInfo, setFilters]);


    return (
        <div className={styles.filterSectionContainer}>
            <div className={styles.filterHeader}>
               <div className={styles.filtersText}>FILTERS</div>
                {getShouldShowClearFilterButton(filters) && <div className={styles.clearAllText} onClick={handleClearAllFilters}>CLEAR ALL</div>}
            </div>
            <div className={styles.filterBox}>
                {_map(filters, (value, key) => {
                     const filterType = _get(_invert(FILTER_TYPE_VS_KEY), key);
                     const FilterSectionRenderer = _get(FILTER_TYPE_VS_RENDERER, filterType);
                     return <FilterSectionRenderer
                              data={value}
                              filterType={filterType}
                              filterKey={key}
                              sectionTitle={FILTER_TYPE_VS_SECTION_TITLE[filterType]}
                              key={key}
                              setFilters={setFilters}
                              setQueryParams={setQueryParams}
                              setLatestSelectedFilterSectionInfo={setLatestSelectedFilterSectionInfo}
                              setFilterTags={setFilterTags}
                          />
                })}
            </div>
        </div>
    );

}

export default FilterSection;
