const express = require('express');

const paymentController = require('../controllers/payment');
const authMiddleware = require('../authentication/customer');

const router = express.Router();

router.post('/create-order',authMiddleware.verifyAuthorization,paymentController.paymentInitiate);
router.put('/update-transaction',authMiddleware.verifyAuthorization,paymentController.updatetransaction);
module.exports = router;