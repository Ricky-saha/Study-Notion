const mongoose =require("mongoose");


const courseProgress = new mongoose.Schema({

    courseId :{
        type:mongoose.Schema.ObjectId,
        ref:"Course",
    },
    completedVideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }]
    
})
module.export = mongoose.model("CourseProgress" , courseProgress);