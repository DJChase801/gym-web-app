import React from "react";
import ProductCard, { buttonTypes } from '../ReusableComponents/ProductCard/productCard';

const Cart = ({ products, removeFromCart }) => {
    
    return (
        <div className='cart'>
            {
                products.map(product => {
                    return (
                        <ProductCard 
                            product={product}
                            buttonAction={removeFromCart}
                            buttonWording={'Remove'}
                            buttonType={buttonTypes.cartRemover}
                        />
                    )
                })
            }
        </div>
    )
}

export default Cart;