import models, { sequelize } from "../models";
import { v4 as uuidv4 } from 'uuid';

const { QueryTypes } = require('sequelize');

// Controller function that gets all the members from the database
export const getAllPurchasesController = () => {
    const purchases = models.purchase.findAll();
    return purchases;
}

export const processPurchase = async (
    { 
        member, 
        products, 
        cartTotal 
    } : { 
        member: any, 
        products: any, 
        cartTotal: any
    }) => {
    if (!member.member_id) {
        const memberData = await models.member.create({
            member_id: uuidv4(),
            first_name: member.first_name,
            last_name: member.last_name,
            full_name: member.full_name,
        })
        member.member_id = memberData.member_id;
    }
    products.map(async (product: any) => {
        const purchase = await models.purchase.create({
            purchase_id: uuidv4(),
            member_id: member.member_id,
            product_id: product.product_id,
            quantity: 1,
            total_price: cartTotal,
        });
    });
}

interface Purchase {
    member_id: string;
    full_name: string;
    product: string;
    item_count: number;
}


export const getAllPurchases = async (startDate: any, endDate: any) => {
    // member id to confirm duplicates
    // get name 
    // get product
    // get count 
    // where between start and end date
    const [purchase] = await sequelize.query(`
        SELECT m.member_id,
            m.full_name,
            p.name as product, 
            COUNT(p.product_id) AS item_count
        FROM purchase pu
        LEFT JOIN member m ON pu.member_id = m.member_id
        LEFT JOIN product p ON pu.product_id = p.product_id
        WHERE pu.deleted_at IS NULL
        and p.deleted_at IS NULL
        and m.deleted_at IS NULL
        ${(startDate && !endDate) ? `AND pu.created_at >= '${startDate}'` : ''}
        ${(startDate && endDate) ? `AND pu.created_at BETWEEN '${startDate}' AND '${endDate}'` : ''}
        GROUP BY m.full_name, m.member_id, p.name
        ORDER BY m.full_name ASC;
    `) as Purchase[][];

    return purchase;
}
