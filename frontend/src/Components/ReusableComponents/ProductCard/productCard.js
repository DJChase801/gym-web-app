import React from 'react';
import './productCard.css';

const ProductCard = ({ product, buttonAction, buttonWording, buttonType }) => {
    return (
        <div className='product-card'>
            <div className='img-container'>
                <img className='product-img' src={product.img_url} alt={product.name} />
            </div>
            <div className='product-details'>
                <div>{product.name}</div>
                <div>${product.price}</div>
            </div>
            <button 
                className={`button-action ${buttonType}`}
                id={`delete-btn${product.id}`} 
                onClick={() => buttonAction(product)}
            >
                {buttonWording}
            </button>       
        </div>
    )
}

export const buttonTypes = {
    cartAdder: 'cart-adder',
    cartRemover: 'cart-remover',
    productRemover: 'product-remover',
}

export default ProductCard;