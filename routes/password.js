
const express = require('express');


const passwordController = require('../controllers/password');

const router = express.Router();

router.get('/admin/reset/:forgotId', passwordController.adminResetpasswordform);
router.post('/admin/reset',passwordController.adminResetpassword);
router.post('/admin/forgotpassword',passwordController.adminResetpasswordMail);

router.get('/customer/reset/:forgotId', passwordController.customerResetpasswordform);
router.post('/customer/reset',passwordController.customerResetpassword);
router.post('/customer/forgotpassword',passwordController.customerResetpasswordMail);

module.exports = router;
