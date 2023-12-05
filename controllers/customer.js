
const Customer = require('../models/customers');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const { ObjectId } = require('mongodb');

exports.customerHomePage = (request, response, next) => {
    response.sendFile('home.html', { root: 'views/customer' });
}
exports.customerSignup = async (request, response, next) => {
    try {
        const { name, email, phonenumber, password } = request.body;
        let customerExist = await Customer.findOne({ $or: [{ email: email }, { phoneNumber: phonenumber }] });
        if (!customerExist) {
            const hash = await bcrypt.hash(password, 10);
            const customer = new Customer({
                name,
                email,
                phoneNumber: phonenumber,
                password: hash,
                cart: {
                    items: []
                },
                order: {
                    order_items: [],
                }
            })
            const { _id } = await customer.save();
            const customerId = _id.toString();
            const token = jwt.sign({ customerId }, secretKey, { expiresIn: '1h' });
            response.cookie('token', token, { maxAge: 3600000 });
            return response.status(201).json({ message: "Customer Account created successfully" });
        } else {
            return response.status(409).json({ message: 'Email or Phone Number already exist!' })
        }


    } catch (error) {
        console.log(error);
    }
}

exports.CustomerSignin = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        let customerExist = await Customer.findOne({ email });
        if (customerExist) {
            const isPasswordValid = await bcrypt.compare(password, customerExist.password);
            if (isPasswordValid) {
                const customerId = customerExist._id.toString()
                const token = jwt.sign({ customerId }, secretKey, { expiresIn: '1h' });
                response.cookie('token', token, { maxAge: 3600000 });
                return response.status(201).json({ message: "Username and password correct" })
            } else {
                return response.status(401).json({ message: 'Invalid Password!' })
            }
        } else {
            return response.status(409).json({ message: 'Account is not exist!' })
        }

    } catch (error) {
        console.log(error);
    }
}

exports.getProducts = async (request, response, next) => {
    try {
        const pageNo = request.query.pageNo;
        const limit = Number(request.query.noProducts);
        const offset = (pageNo - 1) * limit;
        const products = await Product.find().select('-productDescription -productQuantity').skip(offset).limit(limit);
        return response.status(200).json({
            products,
            newHasMoreProducts: products.length === limit,
            newHasPreviousProducts: pageNo > 1,
            message: "Product  successfully fetched"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal Server Error unable to getproducts' });
    }
}
exports.getProduct = async (request, response, next) => {
    try {
        const { productId } = request.params
        const product = await Product.findById(productId)
        return response.status(201).json({ product, message: "Product fetched successfully" });

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal Server Error unable to getproduct' });
    }
}

exports.addToCart = async (request, response, next) => {
    try {
        const { customer } = request;
        const { productId } = request.params;
        const product = await Product.findById(productId);
        await customer.addToCart(product);
        return response.status(201).json({ message: "Product successfully added to cart" });

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal Server Error unable to add product to cart' });
    }
}

exports.getShoppingCart = async (request, response, next) => {
    try {
        const { customer } = request;
        const { cart: { items } } = await customer.populate('cart.items.productId');
        const products = items.map(item => ({
            id: item.productId._id,
            productName: item.productId.productName,
            productPrice: item.productId.productPrice,
            quantity: item.quantity,
        }));
        return response.status(201).json({ products, message: 'Successfully retrieved shopping Cart' });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'unable to fetch Shopping Cart details' });
    }
}

exports.deceaseFromCart = async (request, response, next) => {
    try {
        const { customer } = request;
        const { productId } = request.params;
        const product = await Product.findById(productId);
        await customer.decreaseFromCart(product);
        return response.status(201).json({ message: "Product Quantity decreased successfully" });

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Internal Server Error unable to decrease product quantity' });
    }
}
exports.increaseFromCart = async (request, response, next) => {
    try {
        const { customer } = request;
        const { productId } = request.params;
        const product = await Product.findById(productId);
        await customer.increaseFromCart(product)
        return response.status(201).json({ message: "Product Quantity updated successfully" });

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Internal Server Error unable to add update product quantity' });
    }
}
exports.deleteFromCart = async (request, response, next) => {
    try {
        const { productId } = request.params;
        const { customer } = request;
        const { cart: { items } } = customer;
        const existingItem = items.find(item => item.productId.equals(new ObjectId(productId)));
        items.pull(existingItem);
        await customer.save();
        return response.status(201).json({ message: "Product removed successfully" });

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Internal Server Error unable to add update product quantity' });
    }
}
exports.getOrderHistory = async (request, response, next) => {
    try {
        const { customer } = request;
        const { order: { order_items } } = await customer.populate('order.order_items.products.productId');
        const orders = order_items.filter((ele => ele.status == "Successfull")).map((order) => {
            const products = order.products.map(product => ({
                productName: product.productId.productName,
                productPrice: product.productId.productPrice,
                quantity: product.quantity
            }));
            return {
                id: order.order_id,
                date: order.createdAt,
                Products: products
            }
        })
        response.status(200).json({ orders, message: "Order history successfully fetched" });

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Internal Server Error unable to get Order History' });
    }
}




