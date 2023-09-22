import React, { useState, useCallback } from 'react';
import _map from 'lodash/map';
import _find from 'lodash/find';
import _get from 'lodash/get';
import { produce } from 'immer';
import _set from 'lodash/set';
import _noop from 'lodash/noop';
import _filter from 'lodash/filter';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import _every from 'lodash/every';
import _values from 'lodash/values';
import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { FILTER_TYPES, FILTER_TYPE_VS_KEY } from '../../../../constants';

import styles from './catalogHeader.module.scss';


const SORT_BY_MENU_OPTIONS = [{ label: 'Recommended', value: 'recom' }, { label: "What's new", value: 'trending' }, { label: 'Popularity', value: 'popular' }];

const SelectValueRenderer = (value) => {
    const selectedOption = _find(SORT_BY_MENU_OPTIONS, option => option?.value === value);
    return <><span className={styles.sortByText}>Sort by :</span><span className={styles.labelText}>{selectedOption?.label}</span></>;
}

const getOptionRenderer = (label) => {
   return <div className={styles.label}>{label}</div>;
}

const FILTER_KEY_VS_TAG_LABEL_GETTER = {
    [FILTER_TYPES.CATEGORIES]: (filter) => _get(filter, 'name'),
    [FILTER_TYPES.BRANDS]: (filter) =>  _get(filter, 'name'),
    [FILTER_TYPES.PRICE_RANGES]: (filter) => `Rs. ${_get(filter, 'startPrice', 0)} to Rs. ${_get(filter, 'endPrice', 0)}`,
    [FILTER_TYPES.COLORS]: (filter) => _get(filter, 'name'),
    [FILTER_TYPES.DISCOUNTS]: (filter) => `${_get(filter, 'discountRate')}% and above`,
}

const FilterTag = ({ filterTag, setFilterTags, setFilters, setLatestSelectedFilterSectionInfo, filters, setQueryParams }) => {

    const handleFilterTagRemoval = () => {
        const filterKey = FILTER_TYPE_VS_KEY[_get(filterTag, 'filterType')];
        setFilterTags((prevTags) => {
            return _filter(prevTags, tag => _get(tag, 'id') !== filterTag?.id)
        });
        setFilters((prevFilters) => {
            const newFilters = produce(prevFilters, draft => {
                const sectionFilters = _get(draft, filterKey);
                const newSectionFilters = _map(sectionFilters, filterValue => {
                    if(filterValue?.id === filterTag?.id) {
                        return {
                            ...filterValue,
                            selected: false,
                        }
                    }
                    return filterValue;
                });
                _set(draft, filterKey, newSectionFilters);
            });
            return newFilters;
        });

        setLatestSelectedFilterSectionInfo({
            filterType: _get(filterTag, 'filterType'),
            filterData: _cloneDeep(_get(filters, filterKey)),
        });
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                const filterValues = _get(draft, `filterParams.${filterKey}`);
                if(typeof filterValues === 'object') {
                    const filterIndexToRemove = _findIndex(filterValues, value => value === filterTag?.id);
                    if (filterIndexToRemove !== -1) {
                        filterValues.splice(filterIndexToRemove, 1);
                        _set(draft, `filterParams.${filterKey}`, filterValues);
                    }
                } else {
                    const newFilterParams = _omit(_get(draft, 'filterParams'), [filterKey]);
                    _set(draft, 'filterParams', newFilterParams);
                }
            });
            const newFilterParams = _get(newQueryParams, 'filterParams');
            const isEveryValueEmptyInNewFilterParams = _every(_values(newFilterParams), value => _isEmpty(value));
            if(isEveryValueEmptyInNewFilterParams) {
                return { ...newQueryParams, filterParams: {} };
            }
            return newQueryParams;
        });
    }

    const tagLabelGetter = FILTER_KEY_VS_TAG_LABEL_GETTER[filterTag?.filterType] || _noop;
    return (
        <div className={styles.tagContainer}>
            <div className={styles.tagLabel}>{tagLabelGetter(filterTag)}</div>
            <div className={styles.crossIconContainer} onClick={handleFilterTagRemoval}>
               <CloseOutlinedIcon sx={{ fontSize: '1rem', color: '#878A94', marginLeft: '0.2rem' }} />
            </div>
        </div>
    );
}


const CatalogHeader = ({ setQueryParams, queryParams, filterTags, setFilterTags, setFilters, setLatestSelectedFilterSectionInfo, filters }) => {
    const [sortValue, setSortValue] = useState(_get(queryParams, 'sort') || 'recom');

    const handleChange = useCallback((event) => {
        setSortValue(event?.target?.value);
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                _set(draft, 'sort', event?.target?.value);
            });
            return newQueryParams;
        });
    }, [setQueryParams]);

    return (
        <div className={styles.container}>
            <div className={styles.filterTagsContainer}>
                {_map(filterTags, filterTag => {
                    return <FilterTag
                          filterTag={filterTag}
                          key={filterTag?.id}
                          setFilterTags={setFilterTags}
                          setFilters={setFilters}
                          setLatestSelectedFilterSectionInfo={setLatestSelectedFilterSectionInfo}
                          filters={filters}
                          setQueryParams={setQueryParams}
                       />
                })}
            </div>
            <div className={styles.selectContainer}>
                <FormControl className={styles.selectInputBase}>
                    <Select
                        renderValue={SelectValueRenderer}
                        value={sortValue}
                        onChange={handleChange}
                        MenuProps={{
                            autoFocus: false,
                            sx: {
                                "&& .Mui-selected": {
                                    backgroundColor: "white"
                                }
                            }
                        }}
                    >
                        {_map(SORT_BY_MENU_OPTIONS, option => {
                            return <MenuItem key={option?.value} value={option?.value}>{getOptionRenderer(option?.label)}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}


export default CatalogHeader;