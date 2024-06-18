// const bcrypt = require("bcrypt");
// const User = require("../models/User");
// const OTP = require("../models/OTP");
// const jwt = require("jsonwebtoken");
// const otpGenerator = require("otp-generator");
// const mailSender = require("../utils/mailSender");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
// const Profile = require("../models/Profile");
// require("dotenv").config();


// //send OTP
// exports.sendOTP = async (req,res)=> {

// try{
    

//     //fetch email from req body 
//     const {email} = req.body;

//     // check if user already exist 
//     const checkUserPresent = await User.findOne({email});

//     // if user exist , then return a res 
//     if(checkUserPresent) {
//         return res.status(401).json({
//             success:false,
//             message:"User already registered"
//         })
//     }


//     //generate otp

//     var otp = otpGenerator.generate(6,{ // here 6 is the length of the otp
//         upperCaseAlphabets:false,
//         lowerCaseAlphabets:false,
//         specialChars:false,
//     });
//     console.log("OTP is : ",otp)


//     //check unique otp or not 
//     const result = await OTP.findOne({otp: otp});

//     while(result){
//         otp = otpGenerator(6,{
//             upperCaseAlphabets:false,
//             lowerCaseAlphabets:false,
//             specialChars:false,
//         })
//     const result = await OTP.findOne({otp: otp});
//     }




//     //send mail to user with otp
//     const otpPayload = {email,otp};// we didnt enter 3rd parameter of created at in this because we have already mention it in schema as a default value 

//     // create an entry for Otp 
//     const otpBody = await OTP.create(otpPayload);
//     console.log(otpBody)

//     //return response successful 
//     res.status(200).json({
//         success:true,
//         message:'OTP Sent Successfully',
//         otp,
//     })


// }


//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }


// }


// //sign up
// exports.signUp = async(req,res)=>{


//     try{ 
//          //data fetch from request ki body 
//         const {
//             firstName,
//             lastName,
//             email,
//             password,
//             confirmPassword,
//             accountType,
//             contactNumber,
//             otp
//             } = req.body
    
//         //validate krlo 
//         if(!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp){
//             return res.status(403).json({
//                 success:false,
//                 message:"All field are required ",
//             })
//         }
    
//         //2 password match krlo 
//         if(password !== confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"Password and Confirm Password should be same "
//             })
//         }
    
//         //check user already exist or not 
//         const existingUser = await User.findOne({email});
//         if(existingUser){
//             return res.status(400).json({
//                 success:false,
//                 message:"User already registered"
//         });
//          }
    
//         //find most recent OTP stored for the user 
//         const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
//          console.log(RecentOtp);

//          //1.sort({createdAt:-1})...
//             // This chain of methods calls applies sorting to the query results.
//             // .sort({createdAt:-1}) sorts the documents based on the createdAt field.

//         // 2. The -1 after the field name indicates descending order, 
//                 //meaning the most recently created document will be at the beginning of the results.

//         // 3..limit(1);
//             // This method further refines the results.
//             // .limit(1) limits the number of documents returned to just one.
    
//         // validate OTP 
//         if(recentOtp.length == 0){
//             //OTP not found 
//             return res.status(400).json({
//                 success:false,
//                 message:'OTP not Found'
//             })
//         }else if(otp !== recentOtp.otp){
//                 //Invalid Otp 
//                 return res.status(400).json({
//                     success:false,
//                     message:"Invalid otp"
//                 })
//         }
//         //hash Password 
//         const hashedPassword = await bcrypt.hash(password,10);
    
//         //create entry in db 
//         const profileDetails = await Profile.create({
//             gender:null,
//             dateOfBirth:null,
//             about:null,
//             contactNumber:null
//         })

//         const user = await User.create({
//         firstName,
//         lastName,
//         email,
//         password:hashedPassword,
//         accountType,
//         contactNumber,
//         additionalDetails:profileDetails._id,
//         image:`https://api.dicebear.com/8.x/initials/svg?seed=${firstName}${lastName}`
    
//     })
//         //return res 
//         return res.status(200).json({
//             success:true,
//             message:"USER IS REGISTERED Successfully",
//             user,
//         })
    
    
//     }
//     catch(error){

//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"User can't be registred try again",
//         })

        
        
//     }}


//     // //login
//     // exports.login = async(req,res)=>{
//     //     try{

//     //         //get data from req body
//     //         const {email, password} = req.body;

//     //         //validation data
//     //         if(!email || !password) {
//     //             return res.status(403).json({
//     //                 success:false,
//     //                 message:'All fields are required , please try again',

//     //             })
//     //         }

//     //         //user check exist or not 
//     //         const user = await User.findOne({email}).populate("additionalDetails")
//     //         if(!user) {
//     //             return res.status(401).json({
//     //                 success:false,
//     //                 message:"User is not registered, please signup first",
//     //             })
//     //         }
//     //         // generated JWT Token, after password matching
//     //             if(await bcrypt.compare(password, user.password)){
//     //                 const payload= {
//     //                     email: user.email,
//     //                     id:user.id,
//     //                     role:user.role
//     //                 }
//     //                 const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     //                     expiresIn:"2h"
//     //                 })
//     //                 user.token = token;
//     //                 user.password = undefined;

//     //             }
//     //         //create cookie and send response
//     //         const option = {
//     //             expires: new Date.now() + 3*24*60*60*1000,
//     //             httpOnly:true
//     //         }
//     //         res.cookie("token , token, options").status(200).json({
//     //             success:true,
//     //             token,
//     //             user,
//     //             message:"Logged in successfully"
//     //         });
        
//     //         else{
//     //             return res.status(401).json({
//     //                 success:false,
//     //                 message:"Invalid credentials, please try again",
//     //             })
//     //     }
           
      
        
//     //     catch(error){

//     //     }
//     // }


//     //login
// exports.login = async (req, res) => {
//     try {
//         //get data from req body
//         const { email, password } = req.body;

//         //validation data
//         if (!email || !password) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'All fields are required, please try again',
//             });
//         }

//         //user check exist or not
//         const user = await User.findOne({ email }).populate('additionalDetails');
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User is not registered, please signup first',
//             });
//         }

//         // generated JWT Token, after password matching
//         if (await bcrypt.compare(password, user.password)) {
//             const payload = {
//                 email: user.email,
//                 id: user.id,
//                 accountType: user.accountType,
//             };
//             const token = jwt.sign(payload, process.env.JWT_SECRET, {
//                 expiresIn: '2h',
//             });
//             user.token = token;
//             user.password = undefined;
//         } else {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials, please try again',
//             });
//         }

//         //create cookie and send response
//         const options = {
//             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         };
//         res.cookie('token', token, options).status(200).json({
//             success: true,
//             token,
//             user,
//             message: 'Logged in successfully',
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: 'Login failure please try again',
//         });
//     }
// };


// // change password --> Homework
// exports.changePassword = async(req,res)=>{
//   try{
//     //get the data from req.user
//     const userDetails = await User.findById(req.user.id);

//     //get old password newpassword and confirm password from req ki body 
//     const {oldPassword, newPassword, confirmNewPassword}= req.body;

//     //Validate old Password 
//     const ispasswordMatch = await bcrypt.compare(
//         oldPassword,
//         userDetails.password
//     );
//     if(oldPassword === newPassword){
//         return res.status(400).json({
//             success:false,
//             message:"Old password and new password should not be same"
//         })
//     }
//     if(!ispasswordMatch){
//         return res.status(400).json({
//             success:false,
//             message:"Old password is incorrect"
//         })
//     }
//     // Match the new passsword with confirm password 
//     if(newPassword !== confirmNewPassword ){
//         return res.status(400).json({
//             success:false,
//             message:" The password and confirmpassword does not match"
//         });
//     }
//     //update password 
//     const encryptedPassword = await bcrypt.hash(newPassword, 10);
//     const updatedUserDetails = await User.findByIdAndUpdate(
//         req.user.id,
//         {password: encryptedPassword},
//         {new: true}
//     );


//     //send notification email 
//     try {
//         const emailResponse = await mailSender(
//             updatedUserDetails.email,
//             "Study Notion - Password Updated",
//             `password updated for ${updatedUserDetails.firstName} ${updatedUserDetails}`
//         );
// 			console.log("Email sent successfully:", emailResponse.response);

//     }
//     catch(error){
//         console.error("Error occurred while sending email:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error occurred while sending email",
//             error: error.message,
//         })

//     }
//     return res.status(200).json({
//         success:true,
//         message:" Password updated and email sent"
//     })
//   }
//   catch(error){
//     return res.status(200).json({
//         success:false,
//         message:"Error while updating password ",
//         error: error.message 
//     });

//   }

// }


const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// Signup Controller for Registering USers

exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;
		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		// Create the Additional Profile For User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});
		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};

// Login controller for authenticating users
exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email }).populate("additionalDetails");

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};
// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);

		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};





// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if(oldPassword === newPassword){
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}
		
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				"Study Notion - Password Updated",
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};