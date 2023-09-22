import { produce } from 'immer';
import _sampleSize from 'lodash/sampleSize';
import _random from 'lodash/random';
import _isNil from 'lodash/isNil';
import _forEach from 'lodash/forEach';
import _set from 'lodash/set';

import { FILTER_TYPES, FILTER_TYPE_VS_KEY } from '../constants';


export const fetchFilterDataByFilterKey = async (filterKey) => {
    const res = await fetch(`http://localhost:3001/${filterKey}`);
    const data = await res.json();
    return data;
}

export const getRandomSampleData = (data) => _sampleSize(data, _random(data?.length-1, data?.length));

const getFormattedSavedFilterData = (savedFilterData) => {
   return produce(savedFilterData, draft => {
       _forEach(draft, (filterValues) => {
           _forEach(filterValues, (value) => {
               _set(value, 'selected', false);
           });
       });
   });
}

const getFormattedLastSelectedData = (lastSelectedFilterSectionData) => {
    return produce(lastSelectedFilterSectionData, draft => {
            _forEach(draft, (value) => {
                _set(value, 'selected', false);
            });
    });
}

export const fetchFilterData = async (latestSelectedFilterSectionInfo) => {
    const {
        filterType: lastSelectedFilterType,
        filterData: lastSelectedFilterSectionData
    } = latestSelectedFilterSectionInfo || {};

    const [personas, categories, brands, priceRanges, colors, discounts] = await Promise.all([
        fetchFilterDataByFilterKey(FILTER_TYPE_VS_KEY[FILTER_TYPES.PERSONAS]),
        fetchFilterDataByFilterKey(FILTER_TYPE_VS_KEY[FILTER_TYPES.CATEGORIES]),
        fetchFilterDataByFilterKey(FILTER_TYPE_VS_KEY[FILTER_TYPES.BRANDS]),
        fetchFilterDataByFilterKey(FILTER_TYPE_VS_KEY[FILTER_TYPES.PRICE_RANGES]),
        fetchFilterDataByFilterKey(FILTER_TYPE_VS_KEY[FILTER_TYPES.COLORS]),
        fetchFilterDataByFilterKey(FILTER_TYPE_VS_KEY[FILTER_TYPES.DISCOUNTS]),
    ]);

    if (_isNil(lastSelectedFilterType)) {
        const savedFilterData = window.localStorage.getItem('filters');
        if (_isNil(savedFilterData) || savedFilterData === 'undefined') {
            return {
                personas,
                categories,
                brands,
                priceRanges,
                colors,
                discounts,
            };
        }
        const formattedSavedFilterData = getFormattedSavedFilterData(JSON.parse(savedFilterData));
        return formattedSavedFilterData;
    }

    return {
        personas: lastSelectedFilterType === FILTER_TYPES.PERSONAS ? getFormattedLastSelectedData(lastSelectedFilterSectionData) : getRandomSampleData(personas),
        categories: lastSelectedFilterType === FILTER_TYPES.CATEGORIES ? getFormattedLastSelectedData(lastSelectedFilterSectionData) : getRandomSampleData(categories),
        brands:  lastSelectedFilterType === FILTER_TYPES.BRANDS ? getFormattedLastSelectedData(lastSelectedFilterSectionData) : getRandomSampleData(brands),
        priceRanges: lastSelectedFilterType === FILTER_TYPES.PRICE_RANGES ? getFormattedLastSelectedData(lastSelectedFilterSectionData) : getRandomSampleData(priceRanges),
        colors: lastSelectedFilterType === FILTER_TYPES.COLORS ? getFormattedLastSelectedData(lastSelectedFilterSectionData) : getRandomSampleData(colors),
        discounts: lastSelectedFilterType === FILTER_TYPES.DISCOUNTS ? getFormattedLastSelectedData(lastSelectedFilterSectionData) : getRandomSampleData(discounts),
    };
}