import {Application} from '../models/application.model.js';
import { Job } from '../models/job.model.js';


export const applyJob = async(req,res)=>{
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"job Id is required",
                success:false
            })
        };
        //if the user already applid for the job 
        const existingApplication = await Application.findOne({job:jobId,applicant:userId});
        if(existingApplication){
             return res.status(400).json({
                message:"you  have already applied for this job",
                success:false
            });
        }
         //check if jobs exist 
        const job = await Job.findById(jobId);
       if(!job) {
            return res.status(400).json({
                message:"job not found",
                success:false
            });
        }
        // create a new application
        const newApplication = await Application.create({
            applicant:userId,
            job:jobId
        });
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
                message:"job applied successfully",
                success:true
            })
    }catch(error){
        console.error()
    };
}
//appliedJob(user ne kis job mai apply kiya hai)
export const getAppliedJobs = async(req,res)=>{
try {
        const userId = req.id;
        const application = await Application
        .find({applicant: userId})
        .sort({createdAt:-1})
        .populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    }catch(error){
        console.log(error)
    }
}
//kitne user ne apply kiya es admin ki applied job par

export const getApplicants = async(req,res)=>{
    try{
      const jobId = req.params.id;
      const job = await Job.findById(jobId)
      .populate({
        path:'applications',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
      });
      if(!job){
        return res.status(404).json({
                message:"Job not found",
                success:false
            })
      };
      return res.status(200).json({
        job,
        success:true
      });
    }catch(error){
        console.log(error);
    }
}
//update status(user select huya ki nahi )

export const updateStatus = async(req,res)=>{
     try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };//find application by application id
         const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };
      //update stsus
       application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    }catch(error){
        console.log(error);
    }
}

