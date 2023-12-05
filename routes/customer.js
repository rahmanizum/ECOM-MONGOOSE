
const express = require('express');

const customerController = require('../controllers/customer');
const authMiddleware = require('../authentication/customer');

const router = express.Router();

router.post('/signup',customerController.customerSignup);
router.post('/signin',customerController.CustomerSignin);
router.get('',customerController.customerHomePage);
router.get('/get-products',authMiddleware.verifyAuthorization,customerController.getProducts);
router.get('/get-product/:productId',authMiddleware.verifyAuthorization,customerController.getProduct);
router.post('/add-to-cart/:productId', authMiddleware.verifyAuthorization, customerController.addToCart);
router.put('/decrease-from-cart/:productId',authMiddleware.verifyAuthorization,customerController.deceaseFromCart);
router.put('/increase-from-cart/:productId',authMiddleware.verifyAuthorization,customerController.increaseFromCart);
router.delete('/delete-from-cart/:productId',authMiddleware.verifyAuthorization,customerController.deleteFromCart);
router.get('/get-orders',authMiddleware.verifyAuthorization,customerController.getOrderHistory);
router.get('/get-cart', authMiddleware.verifyAuthorization, customerController.getShoppingCart);






module.exports = router;

