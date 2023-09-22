import React, { useCallback, useMemo } from 'react';
import { produce } from 'immer';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _set from 'lodash/set';
import _find from 'lodash/find';
import _cloneDeep from 'lodash/cloneDeep';
import _filter from 'lodash/filter';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { FILTER_TYPES } from '../../../../constants';
import styles from './radioFilterSection.module.scss';

const FILTER_TYPE_VS_LABEL_GETTER = {
    [FILTER_TYPES.PERSONAS]: (filter) => _get(filter, 'name'),
    [FILTER_TYPES.DISCOUNTS]: (filter) => `${_get(filter, 'discountRate')}% and above`,
}

const FILTER_TYPE_VS_LABEL_CLASSNAMES = {
    [FILTER_TYPES.PERSONAS]: styles.personasLabel,
    [FILTER_TYPES.DISCOUNTS]: styles.discountLabel,
}

const RadioFilterSection = ({ data, filterType, sectionTitle, setFilters, filterKey, setLatestSelectedFilterSectionInfo, setQueryParams, setFilterTags }) => {

    const handleChange = useCallback((event) => {
      const selectedFilterId = event?.target?.value;
      setFilters((prevFilters) => {
          const newFilters = produce(prevFilters, draft => {
              const sectionFilters = _get(draft, filterKey);
              const newSectionFilters = _map(sectionFilters, filter => {
                    if(filter?.id === selectedFilterId) {
                        return {
                            ...filter,
                            selected: true,
                        }
                    }
                    return {
                        ...filter,
                        selected: false,
                    }
              });
              _set(draft, filterKey, newSectionFilters);
          });
          return newFilters;
      });


        if (filterType !== FILTER_TYPES.PERSONAS) {
            const filterData = _find(data, filterValue => _get(filterValue, 'id') === selectedFilterId);
            setFilterTags((prevTags) => {
                const newFilterTags = _filter(prevTags, tag => _get(tag, 'filterType') !== FILTER_TYPES.PRICE_RANGES);
                return [...newFilterTags, { ...filterData, filterType }];
            })
        }

        setLatestSelectedFilterSectionInfo({
            filterType,
            filterData: _cloneDeep(data),
        });
        setQueryParams(prevQueryParams => {
            const newQueryParams = produce(prevQueryParams, draft => {
                _set(draft, `filterParams.${filterKey}`, selectedFilterId);
            });
            return newQueryParams;
        });
    }, [filterKey, setFilters, setLatestSelectedFilterSectionInfo, setQueryParams, filterType, data, setFilterTags]);

    const currentSelectedFilterValue = useMemo(() => {
        const selectedFilter = _find(data, filter => _get(filter, 'selected') === true);
        return _get(selectedFilter, 'id', '');
    }, [data]);

    const getRadios = () => {
        return _map(data, filter => {
            const labelGetter = FILTER_TYPE_VS_LABEL_GETTER[filterType];
            return <FormControlLabel
                     className={FILTER_TYPE_VS_LABEL_CLASSNAMES[filterType]}
                     sx={{ height: '1.64rem' }}
                     key={filter?.id}
                     value={filter?.id}
                     control={<Radio sx={{ color: '#CFCED3', '&.Mui-checked': { color: '#FF406B' } }} size="small" disableRipple />}
                     label={labelGetter(filter)}
                     />
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.containerHeader}>
                {sectionTitle && <div className={styles.containerTitle}>{sectionTitle}</div>}
            </div>
            <div>
                <FormControl>
                    <RadioGroup
                        value={currentSelectedFilterValue}
                        onChange={handleChange}
                    >
                        {getRadios()}
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );

}


export default RadioFilterSection;