
const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
            }
        }]
    },
    order: {
        order_items: [{
            order_id:{
                type: String,
            },
            status:{
                type:String,
            },
            payment_id:{
                type:String,
            },
            createdAt:{
                type:Date,
            },
            products:[{
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }]

        }]
    },
    forgotPassword:[{
        isActive:{
            type : Boolean,
        },
        createdAt:{
            type : Date,
        }
    }]
});
customerSchema.methods.addToCart = function (product) {
    const { cart: { items } } = this;
    const existingItem = items.find(item => item.productId.equals(product._id));
    if (!existingItem) {
        items.push({
            productId: product._id,
            quantity: 1
        })
    }
    else {
        existingItem.quantity += 1;
    }
    return this.save();
}
customerSchema.methods.increaseFromCart = function (product) {
    const { cart: { items } } = this;
    const existingItem = items.find(item => item.productId.equals(product._id));
    existingItem.quantity += 1;
    return this.save();
}
customerSchema.methods.decreaseFromCart = function (product) {
    const { cart: { items } } = this;
    const existingItem = items.find(item => item.productId.equals(product._id));
    if(existingItem.quantity >1){
        existingItem.quantity -=1;
    }else{
        items.pull(existingItem);
    }
    return this.save();
}
module.exports = mongoose.model('Customer', customerSchema);


