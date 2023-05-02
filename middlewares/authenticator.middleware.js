const jwt=require("jsonwebtoken");
require("dotenv").config();

function authenticator(req,res,next){
    const token=req.headers.authorization;
    try {
        if(token){
            jwt.verify(token, process.env.key,(err, decoded)=>{
                if(decoded){
                    req.body.userID=decoded.userID;
                    next();
                }else{
                    res.status(404).json({"msg":"Something went Wrong,unable to decode"});
                }
              });
        }else{
            res.status(404).json({"msg":"Please login first!"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to authenticate user,please try again","err":error.message});
    }
}

module.exports={
    authenticator
}