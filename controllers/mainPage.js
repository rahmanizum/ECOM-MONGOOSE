
const path = require('path');
//CREATE MAIN PAGE CONTROLLERS AND EXPORT

exports.getHomepage = (request,response,next)=>{
    response.sendFile('home.html',{root:'views/main'});
}

exports.getErrorPage = (reuest,response,next)=>{
    //Send response for all requests otherthan specified
    response.status(404).sendFile('notFound.html',{root:'views/main'});
}

