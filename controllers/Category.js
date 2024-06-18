const Category = require ("../models/Category");


//create Category ka handler function 
exports.createCategory = async (req,res) => {
    try{

        // get name , description from req.body
        const {name, description}= req.body;

        //Validation
        if(!name || !description){
            return res.status(200).json({
                success:false,
                message:"All fields are required",
            })
        }

        // create entry in DB
        const categoryDetails = await Category.create({
            name:name,// name wale model mei name ki value daal do jo uinput mei aayi hai 
            description:description,
        });
        console.log(CategoryDetails);


        //return response 
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
        })

    }   
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server Error"
        })
    }
}



// getAllCategory hanlder function
exports.showAllCategory = async (req,res) => {
    try{
        const allCategory = await Category.find({},{name:true, description:true});
        res.status(200).json({
            success:true,
            message:"All Category returned successfully",
            allCategory,
        })
    }
    catch(error){
        console.error;
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//Category page details 
exports.categoryPageDetails = async (req, res)=>{
    try{

        //get categoryId
        const {categoryId} =req.body;

        // get courses for specified CategoryId
        const selectedCatgory = await Category.findBy(categoryId)
                                                .populate("courses")
                                                .exec();

                                                
        //validation
        if(!selectedCatgory){
            return res.status(200).json({
                success:false,
                message:"Category not found",
            })
        }

        //get courses for different Categories
        const differentCategories = await Category.find({
                                                        _id:{$ne:categoryId},
                                                    })
                                                    .populate("courses")
                                                    .exec();


        //get top selling courses
        //HW: top selling courses

        //return response 
        return res.status(200).json({
            success:true,
            message:"Category details returned successfully",
            data: {
                selectedCatgory,
                differentCategories,
            }
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// add course to category handler function
exports.addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	// console.log("category id", categoryId);
	try {
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if(category.courses.includes(courseId)){
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.courses.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}