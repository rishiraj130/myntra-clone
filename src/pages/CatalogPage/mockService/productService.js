import _random from 'lodash/random';
import _map from 'lodash/map';
import randomstring from 'randomstring';

const getFormattedProducts = (dummyProducts) => {
    return _map(dummyProducts, product => {
        return {
            ...product,
            description: randomstring.generate(8),
            title: randomstring.generate(5),
            oldPrice: _random(23, 567),
            newPrice: _random(600, 3000),
            discount: _random(10, 98),
            rating: _random(1.2, 4.9),
            noOfReviews: _random(2, 99),
            id: randomstring.generate(4),
        }
    })
}

export const fetchProductData = async () => {
    const response = await fetch('http://localhost:3001/products');
    const products = await response.json();
    const dummyProducts = new Array(50);

    for(let i=0; i<50; i++) {
        dummyProducts[i] = products[_random(0, 19)];
    }

    return {
        productList: getFormattedProducts(dummyProducts),
        totalCount: 100,
    }
}