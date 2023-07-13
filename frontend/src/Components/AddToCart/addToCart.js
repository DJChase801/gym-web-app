import React from 'react';
import ProductCard, { buttonTypes } from '../ReusableComponents/ProductCard/productCard'
import './addToCart.css';

const AddToCart = ({ addToCart, products }) => {

    const Store = () => {
        return (
            <div className='store'>
                {products.map(product => {
                    return (
                        <ProductCard 
                            product={product} 
                            key={product.product_id}
                            buttonAction={addToCart} 
                            buttonWording='Add To Cart'
                            buttonType={buttonTypes.cartAdder}
                        />
                    )
                })}
            </div>
        )
    }

	return (
        <div>
            <h4>All Products:</h4>
            <Store />
        </div>
	);
}

export default AddToCart