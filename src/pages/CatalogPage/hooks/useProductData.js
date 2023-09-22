import { useQuery } from '@tanstack/react-query';

import { fetchProductData } from '../mockService/productService';

const useProductData = ({ queryParams }) => {
    const productDataQuery = useQuery({ queryKey: ['products', queryParams], queryFn: () => fetchProductData(), staleTime: Infinity, keepPreviousData: true  });

    return {
        productData: productDataQuery.data,
        isProductDataError: productDataQuery.isError,
    };
}

export default useProductData;