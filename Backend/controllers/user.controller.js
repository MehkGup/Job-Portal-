import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    // console.log(fullname,email,phoneNumber,password,role);
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    let cloudResponse = null;
    if (req.file) {
    const fileUri = getDataUri(req.file);
    cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exist",
        success: false,
      });
    }
    //bcrypt(convert password into hash)
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile:{
        profilePhoto: cloudResponse?.secure_url || "",
      }
    });
    return res.status(200).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server Error register",
      success: false,
    });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(404).json({
        message: "Missing required fields",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    //is match passward

    const isPasswardMatch = await bcrypt.compare(password, user.password);
    if (!isPasswardMatch) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    //role check
    if (user.role !== role) {
      return res.status(400).json({
        message: "Account doesn't exist with current account",
        success: false,
      });
    }
    //tokengenerate
    const tokenData = {
      userId: user._id,
    };
    const token =  jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true, 
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server Error login",
      success: false,
    });
  }
};
//logout

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 ,
      httpOnly:true,
      sameSite: "none",
      secure: true

    }).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server Error logout",
      success: false,
    });
  }
};
//update profile

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    //cloudary upload
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    //updating data

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    //resumes cocmes later here.........
if(cloudResponse){
    user.profile.resume = cloudResponse.secure_url  //save the cloudinary url
    user.profile.resumeOriginalName = file.originalname //save the original file name 
}
    await user.save();
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
