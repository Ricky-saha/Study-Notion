const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
//restPasswordToken
exports.resetPasswordToken = async (req, res) =>{

try{
       //get email from the body 
       const email = req.body.email

       //check user for this email , email Validation
       const user = await User.findOne({email:email});
       if(!user){
           return res.status(200).json({
               success:false,
               message:"Your Email is not registered Wiht us "
           })
       }

       //generate token
       const token = crypto.randomUUID();

       // update user by adding token and expiration time 
       const updatedDetails = await User.findOneAndUpdate(
           {email:email}, // aadhar , what to change, update the new details
           {
               token:token,
               resetPasswordExpires: Date.now()+ 5*60*1000,
           },
           {new:true}
       );
   
       //create url
       const url = `http://localhost:3000/update-password/${token}`

       //send mail containg the url 
       await mailSender(email,"Password Reset Link" ,`Password Reset Link${url}`)

       //return response 
       return res.json({
           success:true,
           message:'Email sent Succesfully , please check email and change pwd'
       })
   
    }
    catch(error){
    console.log(error);
    return res.status(500),json({
        success:false,
        message:"something went wrong"
    })
}
 
    
}

    //resetPassword

    exports.resetPassword = async(req,res)=>{
        try{
        // fetch data
        const {resetPassword, confirmPassword, token} = req.body;

        //validate 
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        }
        //get userDetailsfrom db using token 
        const userDetails = await User.findOne({token: token });

        //if no entry  -- invalid token 
        if(!userDetails){
            return res,json({
                success:false,
                message:"token invalid",
            });
        }

        //token time check 
        if( userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message:"Token is expired , please regenerate your token"
            })
        }
        
        //hash pwd 
        const hashedPassword =await bcrypt.hash(password, 10);

        //update pwd in db
        await User.findOneAndUpdate(
            {token:token},// kiske aadhar pe dhundhu ?
            {password:hashedPassword},// kya update krna hai 
            {new:true}// taaki aage iski updated value hi milen 
        )
        //res return
       return res.status(200).json({
        success:true,
        message:"Password Reset Succesfully"
       })
    }
    catch(error){
        console.error;
        return res.status(500).json({
            success:true,
            message:"something went wrong"
        })
    }
}