import mongoose from 'mongoose'
const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String,
        
    },
    description:{
        type:String,
        
    },
    website:{
        type:String,
        
    },
    logo:{
        type:String // url for logo
    },
    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

},{timestamps:true});

export const Company = mongoose.model('Company',companySchema);