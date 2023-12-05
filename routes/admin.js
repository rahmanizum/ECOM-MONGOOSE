
const express = require('express');

const adminController = require('../controllers/admin');
const authController = require('../authentication/admin');


const router = express.Router();

router.post('/signup',adminController.adminSignup)
router.post('/signin',adminController.adminSignin)
router.get('',adminController.adminHomePage);
router.post('/add-product',authController.authorization,adminController.addproduct);
router.put('/update-product/:productId',authController.authorization,adminController.updateProduct)
router.get('/get-products',authController.authorization,adminController.getProducts);
router.get('/edit/:productId',authController.authorization,adminController.getProduct);
router.delete('/delete/:productId',authController.authorization,adminController.deleteProduct)

module.exports = router;