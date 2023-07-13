import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Tabs } from 'antd';
import ProductCard, { buttonTypes } from '../../Components/ReusableComponents/ProductCard/productCard';
import './admin.css';

function Admin() {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [products, setProducts] = useState([]);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [stagedProductName, setStagedProductName] = useState('');
    const [stagedProductPrice, setStagedProductPrice] = useState('');
    const [stagedProductImage, setStagedProductImage] = useState('');
    const [members, setMembers] = useState([]);

    useEffect(() => {
        setAllData();
    }, []);

    const lastChargeDate = '12/12/2020';

    const setAllData = async () => {

        await axios.get('http://localhost:5000/api/get-all-products').then((res) => {
            if (res.data.products) {
                setProducts(res.data.products);
            }
        });
        // send the start date end end date as a query param
        await axios.get(`http://localhost:5000/api/get-all-purchases?startDate=${lastChargeDate}`).then((res) => {
            if (res.data.purchases) {
                const tablePurchases = res.data.purchases.map((purchase) => {
                    const total_amount = `$${purchase.total_amount}`
                    return {
                        key: purchase.member_id,
                        member_name: purchase.full_name,
                        products: purchase.products.join(', '),
                        total_amount,
                        total_items: purchase.total_items,
                    }
                });
                setPurchases(tablePurchases);
                setFilteredPurchases(tablePurchases);
            }
        });

        await axios.get('http://localhost:5000/api/get-all-members').then((res) => {
            if (res.data.data.members) {
                const membersList = res.data.data.members.map((member) => {
                    return {
                        member_name: member.full_name,
                        member_id: member.member_id,
                        key: member.member_id,
                        remove: <button onClick={() => removeMember(member)}>Remove</button>,
                    }
                });
                setMembers(membersList);
            }
        });
    }

    const filterPurchaseForDate = async () => {
        if (startDate) {
            const formatStartDate = new Date(startDate).toLocaleDateString() + ' 00:00:00.000-06'; // minus 6 hours because mountain time
            const formatEndDate = new Date(endDate).toLocaleDateString() + ' 00:00:00.000-06';
            // get request that sends the start date and end date as query params
            await axios.get(`http://localhost:5000/api/get-all-purchases?startDate=${formatStartDate}&endDate=${formatEndDate}`).then((res) => {
                if (res.data.purchases) {
                    const tablePurchases = res.data.purchases.map((purchase) => {
                        const total_amount = `$${purchase.total_amount}`
                        return {
                            key: purchase.member_id,
                            member_name: purchase.full_name,
                            products: purchase.products.join(', '),
                            total_amount,
                            total_items: purchase.total_items,
                        }
                    });
                    setFilteredPurchases(tablePurchases);
                }
        });
        } else {
            // give all the purchases if one date isn't selected.
            setFilteredPurchases(purchases);
        }
    }

    const setDateTimes = ({ startVal, endVal }) => {
        if (startVal) {
            setStartDate(new Date(startVal + 'T00:00:00'));
        }
        if (endVal) {
            const date = new Date(endVal + 'T00:00:00');
            date.setDate(date.getDate() + 1);
            setEndDate(date);
        }
    }

    const showAddProductModalSetter = (show) => {
        setShowAddProductModal(show);
    }

    const addStagedProductName = (name) => {
        setStagedProductName(name);
    }

    const addStagedProductPrice = (price) => {
        setStagedProductPrice(price);
    }

    const addStagedProductImage = (image) => {
        setStagedProductImage(image);
    }

    const addStagedProduct = () => {
        axios.post('http://localhost:5000/api/add-product', {
            product: {
                name: stagedProductName,
                price: stagedProductPrice,
                img_url: stagedProductImage,
            }
        }).then((res) => {
            if (res.data.success) {
                setProducts([...products, res.data.newProduct]);
                setShowAddProductModal(false);
                setStagedProductName('');
                setStagedProductPrice('');
                setStagedProductImage('');
            }
        });
    }

    const removeProduct = (product) => {
        axios.delete('http://localhost:5000/api/remove-product', {
            data: {
                product_id: product.product_id,
            }
        }).then((res) => {
            if (res.data.success) {
                setProducts([...products.filter(p => p.product_id !== product.product_id)]);
            }
        });
    }

    const removeMember = async (member) => {
        await axios.delete('http://localhost:5000/api/remove-member', {
            data: {
                member_id: member.member_id,
            }
        }).then(async (res) => {
            if (res.data.success) {
                await axios.get('http://localhost:5000/api/get-all-members').then((res) => {
                    if (res.data.data.members) {
                        const membersList = res.data.data.members.map((member) => {
                            return {
                                member_name: member.full_name,
                                member_id: member.member_id,
                                key: member.member_id,
                                remove: <button onClick={() => removeMember(member)}>Remove</button>,
                            }
                        });
                        setMembers(membersList);
                    }
                });
            }
        });
    }

    return (
        <div className={'admin-view'}>
            <div className={'tab-pane-container'}>
                <Tabs defaultActiveKey="1">
                    <div className={'purchases'} tab="Purchases" key="1">
                        <div>
                            <h1>Purchases:</h1>
                        </div>
                        <div className={'last-charge-when'}>
                            <h4>Last Charge: {lastChargeDate}</h4>
                            <button>Set New Charge Date</button>
                        </div>
                        <div className={'purchase-header'}>
                            <h4>start date:</h4>
                            <input
                                type="date"
                                onChange={(e) => {
                                    setDateTimes({ startVal: e.target.value, endVal: null });
                                }}
                            />
                            <h4>end date:</h4>
                            <input
                                type="date"
                                onChange={(e) => {
                                    setDateTimes({ endVal: e.target.value, startVal: null });
                                }}
                            />
                            <button onClick={() => filterPurchaseForDate()}>
                                Filter Table
                            </button>
                        </div>
                        <Table
                            pagination={{ pageSize: 100 }}
                            scroll={{ y: 400 }}
                            className={'table'}
                            dataSource={filteredPurchases}
                            columns={[
                                {
                                    title: 'Member ID',
                                    dataIndex: 'key',
                                    key: 'key',
                                    width: '425px'

                                },
                                {
                                    title: 'Member Name',
                                    dataIndex: 'member_name',
                                    key: 'full_name',
                                },
                                {
                                    title: 'Products',
                                    dataIndex: 'products',
                                    key: 'products',
                                },
                                {
                                    title: 'Total Items',
                                    dataIndex: 'total_items',
                                    key: 'total_items',
                                    width: '150px'
                                },
                                {
                                    title: 'Total Amount',
                                    dataIndex: 'total_amount',
                                    key: 'total_amount',
                                    width: '150px'
                                },
                            ]}
                        />
                    </div>
                    <div className={'config-column'} tab="Products" key="2">
                        <div className={'config-title'}>
                            <h1>Products:</h1>
                            <button
                                onClick={() => showAddProductModalSetter(true)}
                            >
                                Add Product
                            </button>
                        </div>
                        <div className={'product-list'}>
                            <div className={'content'}>
                                {products.map((product) => {
                                    return (
                                        <ProductCard
                                            key={product.product_id}
                                            product={product}
                                            buttonWording={'Remove'}
                                            buttonType={buttonTypes.productRemover}
                                            buttonAction={removeProduct}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className={'config-column'} tab="Members" key="3">
                        <div className={'config-title'}>
                            <h1>Members:</h1>
                        </div>
                        <Table
                            pagination={{ pageSize: 100 }}
                            scroll={{ y: 340 }}
                            className={'table'}
                            dataSource={members}
                            columns={[
                                {
                                    title: 'Member ID',
                                    dataIndex: 'member_id',
                                    key: 'member_id',
                                    align: 'left',
                                },
                                {
                                    title: 'Member Name',
                                    dataIndex: 'member_name',
                                    key: 'full_name',
                                    align: 'left',
                                },
                                {
                                    title: 'Remove',
                                    dataIndex: 'remove',
                                    key: 'remove',
                                    align: 'center',
                                }
                            ]}
                        />
                    </div>
                </Tabs>
            </div>
            <div className={'config-shelf'}>
                <Modal
                    title="Add Product"
                    onCancel={() => {
                        setShowAddProductModal(false)
                        setStagedProductName('');
                        setStagedProductPrice('');
                        setStagedProductImage('');
                    }}
                    onOk={() => addStagedProduct()}
                    open={showAddProductModal}
                >
                    <h4>Product Name:</h4>
                    <input
                        className={'modal-input'}
                        type="text"
                        value={stagedProductName}
                        onChange={(e) => {
                            addStagedProductName(e.target.value);
                        }}
                    />
                    <h4>Product Price:</h4>
                    <input
                        className={'modal-input'}
                        type="text"
                        value={stagedProductPrice}
                        onChange={(e) => {
                            addStagedProductPrice(e.target.value);
                        }}
                    />
                    <h4>Product Image:</h4>
                    <input
                        className={'modal-input'}
                        value={stagedProductImage}
                        type="text"
                        onChange={(e) => {
                            addStagedProductImage(e.target.value);
                        }}
                    />
                </Modal>
            </div>
        </div>
    );
}

export default Admin;