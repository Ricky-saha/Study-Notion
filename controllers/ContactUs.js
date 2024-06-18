const mailSender = require("../utils/mailSender")

exports.contactUs = async (req,res) => {


    //data fetched
    const {firstName, lastName, email, message, phoneNo} = req.body;

    //validation 
    if(!firstName || !email || !message || !phoneNo) {
        return res.status(401),json({
            success:false,
            message:"ALL fields are required "
        })
    }
    try {
        const data = {
            firstName,
            lastName: `${lastName ? lastName : "null"}`,
            email,
            message,
            phoneNo
        }
        const mailed = await mailSender(
            process.env.CONTACTUS_MAIl,
            "Enquery",
            `<html>
            <body>${object.keys(data).map((key)=>{
                return `<p>${key}: ${data[key]}</p>`
            })}</body></html>`
        );
        if(mailed){
            return res.stauts(200).json({
                success:true,
                message:" Your message has been sent succesfully "
            })
        }else{
            return res.status(403).send({
                success: false,
                message: "Something went wrong",
            })
        }
        
    } 
    catch (error) {
        return res.status(403).send({
            success: false,
            message: "Something went wrong "
        })

    }
};