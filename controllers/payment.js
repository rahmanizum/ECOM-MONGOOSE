
const Customer = require('../models/customers');
const Razorpay = require('razorpay');
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
const { ObjectId } = require('mongodb');
exports.paymentInitiate = async (request, response, next) => {
    try {
        const {customer} = request;
        const { cart: { items },order:{order_items}} = await customer.populate('cart.items.productId','productPrice');
        let totalAmount = 0;
        items.forEach((product)=>{
            totalAmount += product.productId.productPrice * product.quantity;
        });
        const taxPrice = ((totalAmount * 2.5) / 100);
        const finalAmount = (totalAmount + taxPrice).toFixed(2)
        if (items.length>0) {
            const rzpintance = new Razorpay({
                key_id: key_id,
                key_secret: key_secret
            })
            var options = {
                amount: finalAmount*100,
                currency: "INR",
            };
            const orderDetails = await rzpintance.orders.create(options);
            const { id, status } = orderDetails;
            await order_items.push({
                order_id: id,
                status: status,
            })
            await customer.save();
            const customerData = {
                name: customer.name,
                email: customer.email,
                phoneNumber: customer.phoneNumber,
            }
            return response.status(200).json({ key_id: key_id, orderid: id , customer:customerData});
        } else {
            return response.status(403).json({ message: 'No Products in Cart!'})    
        }

    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Something went wrong try later"})
    }
}
exports.updatetransaction = async (request, response, next) => {
    try {
        const { order_id, payment_id } = request.body;
        const {customer} = request;
        const { order: { order_items } , cart:{items}} = customer;
        const existingOrder = order_items.find(item => item.order_id===order_id);
        existingOrder.payment_id = payment_id;
        existingOrder.status = "Successfull";
        existingOrder.createdAt = new Date();
        existingOrder.products = [...items]
        customer.cart.items = [];
        await customer.save();
        response.status(202).json({ success: true, message: "Payment is successfull and Check Order History for more" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction we will get back to you" });
    }
}