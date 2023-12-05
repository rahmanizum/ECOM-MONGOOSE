const Admin = require('../models/admins');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

exports.authorization = async(request,response,next)=>{
    try {
        const token = request.cookies.token;
        const {adminId} = jwt.verify(token,secretKey);
        const admin = await Admin.findById(adminId);
        if(admin){
            request.admin = admin
            next(); 
        }else{
            response.status(401).send({message:"Unauthorized"});
        }
      
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            response.status(401).json({ message: 'Time out please sign in again' });
        } else {
            response.status(500).json({ message: 'Something went wrong  - please sign again' });
        }
    }
}