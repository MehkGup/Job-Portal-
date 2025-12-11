import mongoose from 'mongoose'
const applicationSchema = new mongoose.Schema({ // application aur job ke beech mai relationship
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
},{timestamps:true});

export const Application = mongoose.model('Application',applicationSchema);