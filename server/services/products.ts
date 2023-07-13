import models, { sequelize } from "../models";
import { v4 as uuidv4 } from 'uuid';

// Controller function that gets all the members from the database
export const getProducts = async () => {
    const products = await models.product.findAll();

    return products;
}

export const addProduct = async ({ product }: { product: any }) => {
    try {
        const newProduct = await models.product.create({
            product_id: uuidv4(),
            name: product.name,
            price: product.price,
            img_url: product.img_url,
        });
    
        return newProduct; 
    } catch (error) {
        throw error;
    }
}

export const removeProduct = async (product_id: string) => {
    await models.product.destroy({
        where: {
            product_id,
        },
    });
}

export const getGymFavs = async () => {
    const gymFavs = await sequelize.query(`
        SELECT p.name,
            p.product_id,
            p.price,
            p.img_url,
            count(pu.product_id) AS total_purchases
        FROM product p
        JOIN purchase pu ON p.product_id = pu.product_id
        WHERE p.deleted_at IS NULL
        GROUP BY p.name, p.product_id, p.price, p.img_url
        ORDER BY total_purchases DESC
        LIMIT 5;
    `);

    return gymFavs;
}
