import {Job} from '../models/job.model.js'

//Admin post karega job
export const postJob = async(req,res)=>{
    try{
        const{title , description , location, salary, requirements, jobType, position, companyId , experience} = req.body;
        const userId = req.id;

        if(!title || !description || ! location || !salary || ! requirements || !jobType || ! experience || !position || !companyId){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };
    //     //handle string a/arrayy for split
    //     let requirementsArray = [];
    // if (typeof requirements === "string") {
    //   requirementsArray = requirements.split(",").map((r) => r.trim());
    // } else if (Array.isArray(requirements)) {
    //   requirementsArray = requirements;
    // }

    const job = await Job.create({
            title,
            description,
            salary:Number(salary),
            requirements: requirements.split(","),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message:"New job created successfully",
            job,
            success:true
        });
    }
    catch(error){
        console.log(error);
    }
}

//getalljob(student)

export const getAllJob = async(req,res)=>{
    try{
     const keyword = req.query.keyword || "";
     const query={
        $or:[
            {title:{$regex:keyword,$options:"i"}},//small character or bigger but it will be case sensitive(i)
            {description:{$regex:keyword,$options:"i"}},

        ]
     };
     const jobs = await Job
     .find(query)
     .populate({path:"company"})
     .sort({createdAt:-1});
     if(!jobs){
        return res.status(404).json({
            message:"jobs not found",
            success:false
        });
     };
     return res.status(200).json({
        jobs,
        success:true
     });
    }catch(error){
        console.log(error);
    }
}

//getjob byId(student)

export const getJobById = async(req,res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
             return res.status(404).json({
            message:"jobs not found",
            success:false
        });
        }
        return res.status(200).json({job,success:true});
    }catch(error){
        console.log(error);
    }
}
//admin kitne job create kare hai abhi taak
export const getAdminJobs = async(req,res)=>{
    try{
      const adminId = req.id;
      const jobs = await Job.find({created_by: adminId}).populate({
        path:'company',
        createdAt:-1
      });
    
      if(!jobs){
        return res.status(404).json({
            message:"jobs not found",
            success:false
        })
      };
      return res.status(200).json({
        jobs,
        success:true
      });
    }catch(error){
        console.log(error);
    }
}