import express from 'express'
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';

const app = express();
// app.get("/home",(req,res)=>{
//     return res.status(200).json({
//         message:"hello gyus",
//         success:true
//     })
// })
app.use(express.json());
// app.use((req, res, next) => {
//   req.body = req.body || {};
//   next();
// });

app.use(express.urlencoded({ extended:true}));
dotenv.config({});
app.use(cookieParser());
const corsOptions={
    origin : "http://localhost:5173",
    credentials : true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT|| 3000;


//api
app.use('/api/v1/user',userRoute);
app.use('/api/v1/company',companyRoute);
app.use('/api/v1/job',jobRoute);
app.use('/api/v1/application',applicationRoute);
// http://localhost:8000/api/v1/user/register
app.listen(PORT, ()=>{
    connectDB();
    console.log(`server runing at ${PORT}`)
})