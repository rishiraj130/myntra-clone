export const FILTER_TYPES = {
    PERSONAS: 'PERSONAS',
    CATEGORIES: 'CATEGORIES',
    BRANDS: 'BRANDS',
    PRICE_RANGES: 'PRICE_RANGES',
    COLORS: 'COLORS',
    DISCOUNTS: 'DISCOUNTS',
}

export const FILTER_KEYS = {
    PERSONAS: 'personas',
    CATEGORIES: 'categories',
    BRANDS: 'brands',
    PRICE_RANGES: 'priceRanges',
    COLORS: 'colors',
    DISCOUNTS: 'discounts',
};


export const FILTER_TYPE_VS_KEY = {
    [FILTER_TYPES.PERSONAS]: FILTER_KEYS.PERSONAS,
    [FILTER_TYPES.CATEGORIES]: FILTER_KEYS.CATEGORIES,
    [FILTER_TYPES.BRANDS]: FILTER_KEYS.BRANDS,
    [FILTER_TYPES.PRICE_RANGES]: FILTER_KEYS.PRICE_RANGES,
    [FILTER_TYPES.COLORS]: FILTER_KEYS.COLORS,
    [FILTER_TYPES.DISCOUNTS]: FILTER_KEYS.DISCOUNTS,
};

export const PRODUCT_DATA_VIEWS = {
    GRID: 'grid',
    LIST: 'list',
}