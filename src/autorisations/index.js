const jwt = require('jsonwebtoken');





exports.loginAuthorisation = (req, res, next) => {

    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    }else{
        res.status(400).json({
            message:"Autorisation requise",
            status:res.statusCode     
        })
    }
    next();
    
}

