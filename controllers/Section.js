const Section = require ("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req,res)=>{
    try{

        //data fetch
        const {sectionName, courseId} =req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create section 
        const newSection = await Section.create({sectionName});

        //update in course schema by pushing its object id in the course 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                            courseId,
                                                            {
                                                                $push:{
                                                                    courseContent:newSection._id,
                                                                }
                                                            },
                                                            {new:true},
                                                        )
                                                        //hw:populate how ??



        //return response
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully ",
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating section"
        })
    }
}



exports.updateSection = async (req,res)=>{
    try{
        //data input
        const {sectionName, sectionId} = req.body;

        //data validation
         if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //update data 
        const Section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
       
       
        //return res 
         return res.status(200).json({
            success:true,
            message:" The section has been updated successfully "
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating the section "
        })
    }
}


exports.deleteSection = async (req, res)=>{
    try{
            //get id - assuming that we are sending ID in params 
            const {sectionId} =req.params
        //TODO: do we need to delete it from course schema ?
            // use findbyidandDelete
        await Section.findByIdAndDelete(sectionId);

            //return res 
            return res.status(200).json({
                success:true,
                message:"Section deleted succesfully ",
            })
    }
    catch(error){
            return res.status(500).json({
                success:false,
                message:"Error while deleting section ",
                error:error.message
            })
    }
}