import { useMemo } from 'react';
import { produce } from 'immer';
import _forEach from 'lodash/forEach';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { useQuery } from '@tanstack/react-query';

import { fetchFilterData } from '../mockService/filterService';

const getFormattedFilterData = (filterData, currentFilterParams) => {
    return produce(filterData, draft => {
        _forEach(draft, (value, key) => {
            const filterParamValue = _get(currentFilterParams, key);
            if (typeof filterParamValue !== 'object') {
                const filterToEdit = _find(value, { id: filterParamValue });
                _set(filterToEdit, 'selected', true);
            } else {
                _forEach(filterParamValue, paramValue =>  {
                    const filterToEdit = _find(value, { id: paramValue });
                    _set(filterToEdit, 'selected', true);
                });
            }
        });
    });
}

const useFilterData = ({ filterParams, latestSelectedFilterSectionInfo }) => {
    const filterDataQuery = useQuery({ queryKey: ['filters', filterParams], queryFn: () => fetchFilterData(latestSelectedFilterSectionInfo), staleTime: Infinity, keepPreviousData: true  });

    const formattedFilterData = useMemo(() => {
        return getFormattedFilterData(filterDataQuery.data, filterParams);
    }, [filterDataQuery.data, filterParams]);

    return {
        filterData: formattedFilterData,
        isFilterDataError: filterDataQuery.isError,
    };
}

export default useFilterData;