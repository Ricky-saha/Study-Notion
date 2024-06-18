const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail}= require("../mail/templates/courseEnrollmentEmail");


//capture the payment and initate the razorpay order
exports.capturePayment = async (req,res) => {

    //get user id ,and CourseId 
    const {course_id}= req.body;
    const userId = req.user.id;

    //validation 

    //valid courseId
    if(!course_id) {
        return res.json({
            success:false,
            message:"No Course Found with this id "
        })
    }

    //valid courseDetails
    let course ;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"could not find the course"
            })
        }

         //user already pay for the same course 
        const uid = new mongoose.Type.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                succss:false,
                message:'Student is already enrolled'
            })
        }
    }
    catch(error){
        console.error;
        return res.json({
            success:false,
            message:" something went wrong",
        })

    }


   
    //order create
    const amount = course.price;
    const currency = "INR";


    const options ={
        amount : amount *100,
        currency,
        receipt : Math.random(Date.now()).toString(),

        notes:{
            courseId :course_id,
            userId,
        }

      

    };


    try{
        //initate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse)

          //return response
    return res.status(200).json({
        success:true,
        courseName: course.courseName,
        courseDescription:course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency:paymentResponse.currency,
        amount :paymentResponse.amount,
    });

    }
    catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Could not initate the order"
        })
    }
  
} 



// verify signature 
exports.verifySignature = async (req, res)=>{
    const webhookSecret = "12345678"
    //ye jo humne daali hai 

    const signature = req.headers["X-razorpay-signature"];
   // ye jo razorpay ne bheji hai 

   //process for encryption of webhook secret  
    const shasum =  crypto.createHmac("sha256", webhookSecret );

    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");

    if(digest === signature){
        console.log("Payment is authorised")

        // fetching userid and course id from notes 
        const {courseId, userId} =req.body.payload.payment.entity.notes;

        try{
            //fulfill the action 
            // find the course and enroll the student in it 
                const enrolledCourse = await Course.findOneAndUpdate(
                                                                    {_id: courseId},
                                                                    {$push:{studentsEnrolled:userId}},
                                                                    {new:true},
                );
                if (!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:"Course could not be enrolled"
                    })
                }
                console.log(enrolledCourse);

                // find the student and add the course to their list of enrolled courses
                const enrolledStudent = await User.findOneAndUpdate(
                    {_id:userId},
                    {$push:{courses:courseId}},
                    {new:true},
                )
                console.log(enrolledStudent);

                // confirmation Mail 
                const emailResponse = await mailSender(
                                enrolledStudent.email,
                                "Congratulations from CodeHelp",
                                "Congratulations , you are onboard into new codehelp Course",
                );
                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and Course Added"
                })
        }
        catch(error){
            console.log(error);
            returnres.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }


    else{
        return res.status(400).json({
            success:false,
            message:"Invalid Request"
        })
    }


};

//send email

exports.sendPaymentSuccessEmail = async (req, res) => {
    const {amount,paymentId,orderId} = req.body;
    const userId = req.user.id;
    if(!amount || !paymentId) {
        return res.status(400).json({
            success:false,
            message:'Please provide valid payment details',
        });
    }
    try{
        const enrolledStudent =  await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Study Notion Payment successful`,
            paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName),
        );
}
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}