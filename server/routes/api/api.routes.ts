import express, { Request, Response } from "express";
import { getMembers, removeMember } from '../../services/members';
import { getProducts, addProduct, removeProduct, getGymFavs } from '../../services/products';
import { processPurchase, getAllPurchases } from '../../services/purchases';

const router = express.Router();

// Route to get all the members from the database
router.route('/get-all-members')
    .get(getAllMembersController); // call the controller function

router.route('/get-all-products')
    .get(getAllProductsController); // call the controller function

router.route('/accept-purchase')
    .post(acceptPurchaseController); // call the controller function

router.route('/get-all-purchases')
    .get(getAllPurchasesController); // call the controller function

router.route('/add-product')
    .post(addProductController); // call the controller function

router.route('/remove-product')
    .delete(removeProductController); // call the controller function

router.route('/remove-member')
    .delete(removeMemberController); // call the controller function

router.route('/get-gym-favs')
    .get(getGymFavsController); // call the controller function

async function getGymFavsController(req: Request, res: Response) {
    const gymFavsData = await getGymFavs(); 
    const gymFavs = gymFavsData[0];

    res.send({ success: true, message: 'Successfully fetched gym favs', gymFavs });
}

async function removeMemberController(req: Request, res: Response) {
    const { member_id } = req.body;
    const members = await removeMember(member_id); // call the service function

    res.send({ success: true, message: 'Successfully removed member', members });
}

async function removeProductController(req: Request, res: Response) {
    const { product_id } = req.body;
    await removeProduct(product_id); // call the service function

    res.send({ success: true, message: 'Successfully removed product' });
}

async function addProductController(req: Request, res: Response) {
    const { product} = req.body;
    const newProduct = await addProduct({ product }); // call the service function

    res.send({ success: true, message: 'Successfully added product', newProduct });
}

async function getAllPurchasesController(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const purchases = await getAllPurchases(startDate, endDate); // call the service function

    res.send({ success: true, message: 'Successfully fetched all purchases', purchases });
}

async function acceptPurchaseController(req: Request, res: Response) { 
    const {
        member,
        products,
        cartTotal,
    } = req.body;
    
    await processPurchase({ member, products, cartTotal }); // call the service function

    res.send({ success: true, message: 'Successfully processed purchase' });
}

async function getAllMembersController(req: Request, res: Response) {
    const members = await getMembers(); // call the service function

    res.send({ success: true, message: 'Successfully fetched all members', data: { members } });
}

async function getAllProductsController(req: Request, res: Response) {
    const products = await getProducts(); // call the service function
    
    res.send({ success: true, message: 'Successfully fetched all products', products });
}

// export the router
export default router;
