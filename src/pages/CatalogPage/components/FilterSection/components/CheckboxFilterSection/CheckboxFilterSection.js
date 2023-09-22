import React, { useCallback } from 'react';
import { produce } from 'immer';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _set from 'lodash/set';
import _findIndex from 'lodash/findIndex';
import _every from 'lodash/every';
import _values from 'lodash/values';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


import { FILTER_TYPES } from '../../../../constants';

import styles from './checkboxFilterSection.module.scss';
import _find from "lodash/find";
import _filter from "lodash/filter";

const getLabel = ({ filterName, resultsCount }) =>  (<><span className={styles.filterName}>{filterName}</span><span className={styles.resultsCount}>{`(${resultsCount})`}</span></>);

const getColorLabel = ({ filterName, resultsCount, filterColor }) => (<><span style={{ backgroundColor: filterColor }} className={styles.filterColor}></span><span className={styles.filterName}>{filterName}</span><span className={styles.resultsCount}>{`(${resultsCount})`}</span></>);

const FILTER_TYPE_VS_LABEL_GETTER = {
    [FILTER_TYPES.CATEGORIES]: (filter) => getLabel({ filterName: _get(filter, 'name'), resultsCount: _get(filter, 'count') }),
    [FILTER_TYPES.BRANDS]: (filter) => getLabel({ filterName: _get(filter, 'name'), resultsCount: _get(filter, 'count') }),
    [FILTER_TYPES.PRICE_RANGES]: (filter) => getLabel({ filterName: `Rs. ${_get(filter, 'startPrice', 0)} to Rs. ${_get(filter, 'endPrice', 0)}`, resultsCount: _get(filter, 'count') }),
    [FILTER_TYPES.COLORS]: (filter) => getColorLabel({ filterName: _get(filter, 'name'), resultsCount: _get(filter, 'count'), filterColor: _get(filter, 'id') }),
}

const FILTER_TYPE_VS_LABEL_CLASSNAMES = {
    [FILTER_TYPES.COLORS]: styles.checkboxLabel,
}

const CheckboxFilterSection = ({ data, filterType, sectionTitle, filterKey, setFilters, setLatestSelectedFilterSectionInfo, setQueryParams, setFilterTags  }) => {

    const handleChange = useCallback((event) => {
        setFilters((prevFilters) => {
            const newFilters = produce(prevFilters, draft => {
                const sectionFilters = _get(draft, filterKey);
                const newSectionFilters = _map(sectionFilters, filter => {
                    if(filter?.id === event?.target?.name) {
                        return {
                            ...filter,
                            selected: event.target.checked,
                        }
                    }
                    return filter;
                });
                _set(draft, filterKey, newSectionFilters);
            });
            return newFilters;
        });

        const filterData = _find(data, filterValue => _get(filterValue, 'id') === event?.target?.name);
        setFilterTags((prevTags) => {
            if (event.target.checked) {
                return [...prevTags, { ...filterData, filterType: filterType  }];
            } else {
                const newFilterTags = _filter(prevTags, tag => _get(tag, 'id') !== event?.target?.name);
                return newFilterTags;
            }
        });


        setLatestSelectedFilterSectionInfo({
            filterType,
            filterData: _cloneDeep(data),
        });
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                const filterValues = _get(draft, `filterParams.${filterKey}`, []);
                if(event?.target?.checked) {
                    filterValues.push(event?.target?.name);
                } else {
                    const filterIndexToRemove = _findIndex(filterValues, value => value === event?.target?.name);
                    if(filterIndexToRemove !== -1) {
                        filterValues.splice(filterIndexToRemove, 1);
                    }
                }
                _set(draft, `filterParams.${filterKey}`, filterValues);
            });
            const newFilterParams = _get(newQueryParams, 'filterParams');
            const isEveryValueEmptyInNewFilterParams = _every(_values(newFilterParams), value => _isEmpty(value));
            if(isEveryValueEmptyInNewFilterParams) {
                return { ...newQueryParams, filterParams: {} };
            }
            return newQueryParams;
        });
    }, [filterKey, setFilters, setLatestSelectedFilterSectionInfo, filterType, setQueryParams, data, setFilterTags]);

    const getCheckBoxes = () => {
        const filtersDisplayedUpFront = data?.slice(0, 8);
        return _map(filtersDisplayedUpFront, filter => {
            const labelGetter = FILTER_TYPE_VS_LABEL_GETTER[filterType];
            return <FormControlLabel
                      key={filter?.id}
                      control={<Checkbox sx={{ color: '#CFCED3', '&.Mui-checked': { color: '#FF406B' } }} checked={_get(filter, 'selected')} onChange={handleChange} name={filter?.id} size="small" disableRipple />}
                      label={labelGetter(filter)}
                      sx={{ height: '1.64rem' }}
                      className={FILTER_TYPE_VS_LABEL_CLASSNAMES[filterType]}
                   />
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerHeader}>
              {sectionTitle && <div className={styles.containerTitle}>{sectionTitle}</div>}
              <div className={styles.searchIconContainer}>
                  <SearchOutlinedIcon fontSize="small" style={{ color: '#717287' }} />
              </div>
            </div>
            <div>
                <FormControl>
                    <FormGroup>
                        {getCheckBoxes()}
                     </FormGroup>
                </FormControl>
            </div>
            {data?.length - 8 > 0 && <div className={styles.sectionFooter}>+ {data?.length - 8} more</div>}
        </div>
    );

}


export default CheckboxFilterSection;