const express = require ("express");
const app = express();
// const profileRouter = require('./routes/Profile'); // Assuming Profile.js is in the 'routes' folder
const router = express.Router();
// Correct usage of .get() with a callback function
router.get('/profile', function(req, res) {
  res.send('Profile Page');
});

module.exports = router;

const userRoutes = require ("./routes/User");
const profileRoutes = require ("./routes/Profile");
const paymentRoutes = require ("./routes/Payment");
const courseRoutes =  require ("./routes/Course");
const contactUsRoutes = require ("./routes/ContactUs");

const database = require("./config/database");
const cookieParser = require ("cookie-parser");


const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary")

const fileUpload = require("express-fileupload")
const dotenv = require ("dotenv");


dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// cloudinary connection 
cloudinaryConnect();

//routes mounts
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contactUs", contactUsRoutes);

//default route
app.get("/", (req,res)=> {
    return res.json({
        success:true,
        message:"Your server is up and running... "
    })
})

//starting of server 
app.listen(PORT,() => {
    console.log(`App is running at ${PORT}`)
})

