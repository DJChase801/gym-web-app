import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddToCart from '../../Components/AddToCart/addToCart';
import GymFavs from '../../Components/AddToCart/gymFavs';
import NameList from '../../Components/ReusableComponents/NameSearch/nameSearch';
import Cart from '../../Components/Cart/cart'
import './buy.css'

function Buy() {
    const [products, setProducts] = useState([]);
    const [favProducts, setFavProducts] = useState([]);
    const [viewableProducts, setViewableProducts] = useState([]);
    const [listOptions, setListOptions] = useState([]);
    const [crossfitter, setSearchText] = useState('');
    const [showList, setShowList] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [searchProdText, setProdSearchText] = useState('');
    const [thanksVisible, setThanksVisible] = useState(false);
    const [fixSomething, setFixSomething] = useState(false);
    const [cartTotal, setCartTotal] = useState(0.00)

    useEffect(() => {
        axios.get('http://34.226.247.19:5000/api/get-all-members').then((res) => {
            if (res.data.data.members) {
                setListOptions(res.data.data.members);
            }
        });

        axios.get('http://34.226.247.19:5000/api/get-gym-favs').then((res) => {
            if (res.data.gymFavs) {
                setFavProducts(res.data.gymFavs);
            }
        });

        axios.get('http://34.226.247.19:5000/api/get-all-products').then((res) => {
            if (res.data.products) {
                setProducts(res.data.products);
                setViewableProducts(res.data.products);
            }
        });
    }, []);

    const madeSelection = (selection, name) => {
        setSearchText(name);
        setShowList(false);
    };

    function generateRandomId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    const addToCart = (product) => {
        setCartProducts([...cartProducts, { ...product, specialId: generateRandomId(10) }]);
        setCartTotal((parseFloat(cartTotal) + parseFloat(product.price)).toFixed(2));
    }

    const removeFromCart = (product) => {
        setCartProducts([...cartProducts.filter(p => p.specialId !== product.specialId)]);
        setCartTotal((parseFloat(cartTotal) - parseFloat(product.price)).toFixed(2));
    }

    const clearPage = () => {
        setSearchText('');
        setCartProducts([]);
        setProdSearchText('');
        searching('');
        setCartTotal(0);
    }

    const acceptPurchase = async () => {
        if (crossfitter.split(' ').length > 1 && cartProducts) {
            let member = listOptions.find((option) => {
                return option.full_name === crossfitter;
            });

            if (!member) {
                member = {
                    first_name: crossfitter.split(' ')[0],
                    last_name: crossfitter.split(' ')[1],
                    full_name: crossfitter,
                }
            }

            if (member) {
                await axios.post('http://34.226.247.19:5000/api/accept-purchase', {
                    member,
                    products: cartProducts,
                    cartTotal,
                }).then((res) => {
                    if (res.data.success) {
                        setThanksVisible(true);
                        setTimeout(() => {
                            setThanksVisible(false);
                            clearPage();
                        }, 1500)
                    }
                })

                await axios.get('http://34.226.247.19:5000/api/get-all-members').then((res) => {
                    if (res.data.data.members) {
                        setListOptions(res.data.data.members);
                    }
                });

                await axios.get('http://34.226.247.19:5000/api/get-gym-favs').then((res) => {
                    if (res.data.gymFavs) {
                        setFavProducts(res.data.gymFavs);
                    }
                });
            }
        } else {
            setFixSomething(true);
            setTimeout(() => {
                setFixSomething(false);
            }, 4000)
        }
    }

    const searching = (value) => {
        const lowerInput = value.toLowerCase();
        setProdSearchText(value);
        setViewableProducts(products.filter(product => product.name.toLowerCase().includes(lowerInput)))
    }

    const handleNameBlur = (e) => {
        const focusedElement = e.relatedTarget;
        setShowList(false);
        if (focusedElement || focusedElement?.nodeName === 'BUTTON') {
            focusedElement.click();
        }
    }

    return (
        <div className={'buy-view'}>
            <div className={'select-parent'}>
                <h4>Your Name:</h4>
                <input
                    className={'name-input'}
                    tabIndex='1'
                    value={crossfitter}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                    onFocus={() => setShowList(true)}
                    onBlur={handleNameBlur}
                    placeholder={'First and last name'}
                    type="text"
                />
                <NameList
                    listOptions={listOptions}
                    setListOptions={setListOptions}
                    searchText={crossfitter}
                    showList={showList}
                    madeSelection={madeSelection}
                />
                <h4>Search For A Product:</h4>
                <input 
                    className={'name-input'}
                    tabIndex='2'
                    value={searchProdText}
                    onChange={(e) => searching(e.target.value)}
                    placeholder={'Product name'}
                    type="text"
                />
                <GymFavs
                    addToCart={addToCart}
                    products={favProducts}
                />
            </div>
            <div className={'store-container'}>
                <AddToCart
                    addToCart={addToCart}
                    products={viewableProducts}
                />
            </div>
            <div className={'checkout'}>
                <h4>Cart: </h4>
                <Cart
                    products={cartProducts}
                    removeFromCart={removeFromCart}
                />
                <div>
                    {`Total: $${cartTotal}`}
                </div>
                <button
                    onClick={clearPage}
                    className='button clear'
                >
                    {'Clear'}
                </button>
                <button
                    className='button accept'
                    onClick={acceptPurchase}
                >
                    {'Accept'}
                </button>
            </div>
            {thanksVisible &&
                <div className='overlay popup'>
                    <div className='thanks-stuff'>
                        {`Thanks ${crossfitter.split(' ')[0]}!!`}
                        <div>
                            <img className='thanks-img' src='https://utecrossfit.com/wp-content/uploads/2020/09/The-Perkins.jpg' alt='thanks' />
                        </div>
                    </div>
                </div>
            }
            {fixSomething &&
                <div className='overlay popup'>
                    <div className='thanks-stuff'>
                        {`First AND last name required, make sure something is in the cart`}
                        <div>
                            <img className='thanks-img' src='https://profilepicsbucket.crossfit.com/2e8d6-P504074_1-184.jpg' alt='thanks' />
                        </div>

                    </div>
                </div>
            }
        </div>
    );
}

export default Buy;