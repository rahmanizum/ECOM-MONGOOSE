
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    adminId:{
        type: Schema.Types.ObjectId,
        ref:'Admin',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
