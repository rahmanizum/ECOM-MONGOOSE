
const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
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
    forgotPassword:[{
            isActive:{
                type : Boolean,
            },
            createdAt:{
                type : Date,
            }
        }]
});
module.exports = mongoose.model('Admin', adminSchema);

