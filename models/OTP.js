const mongoose = require("mongoose");
const mailSender = require ("../utils/mailSender");
const OTPSchema =new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt :{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});


// a function --> to send email 

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion", otp )
            console.log("email sent successsfully", mailResponse);
        }

    catch(error){
        console.log("error occured while sending mail",error);
        throw error;
    }
}

// we used pre middle ware so that otp should sent first and then data should be saved in the database 
OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

 
module.exports = mongoose.model("OTP", OTPSchema)