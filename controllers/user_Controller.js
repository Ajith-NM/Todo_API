
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { cloudinaryUpload } from "../connection/cloudinary.js";

import { checkUser, generatePassword, sendMail, insertUser, verifyEmail, updateOTP, updatePassword } from "../models/user.js";
//import { response } from "express";

dotenv.config()


export const postSignup = async (req, res) => {

    try {
        const saltRounds = 10;
        let { password, username, email } = req.body;
        let previousUser = await checkUser(email).then((data) => {
            return data
        })
        console.log("user=", previousUser);
        if (previousUser.length == 0) {

            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (hash) {
                    const uploadResult = await cloudinaryUpload.uploader
                        .upload(
                            req.file.path, {
                            public_id: `upload/${req.file.path}`,
                        }
                        ).then((data) => {
                            return data
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    let otp = generatePassword();
                    console.log(uploadResult);
                    let user = await insertUser(username, hash, email, uploadResult.secure_url, otp).then((data) => {
                        return data
                    }).catch((err) => {
                        console.log("error=", err);
                    })
                    console.log("new user=", user);

                    user != "failed" ? sendMail(email, "email verification", otp) : console.log("insertion failed");

                    res.status(200).cookie("email", email).json({ user: user });
                    return
                }

            })


        }
        else {
            res.send("failed to create user/USER already exist")
            return
        }
    } catch (error) {
        res.send("failed")
        console.log("error=", error);
    }


}

export const emailValidation = async (req, res) => {

    try {

        const enterdOTP = req.body.otp;
        const originalOTP = await verifyEmail(req.cookies.email).then((data) => {
            return data
        }).catch((err) => {
            console.log("verification err=", err);
        })
        // console.log(enterdOTP,"==",originalOTP.otp);

        if (enterdOTP === originalOTP.otp) {
            await updateOTP(req.cookies.email)
            res.status(200).json({ result: "email verified successfully" })
            return

        } else {
            res.status(401).json({ result: "please enter correct otp" })
        }

    } catch (error) {
        res.json({ res: error })
    }


}

export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await checkUser(email).then((data) => {
            return data
        }).catch((err) => {
            console.log("err", err);
        })
        if (user.length !== 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign(user[0], process.env.secret, { expiresIn: 8640000 });
                    res.cookie("token", token).status(200).json({ status: "success", user: user[0] }); //.cookie("email", email)
                    return;
                }
                console.log(err);
                return res.status(401).send(" password not match");
            });
        } else {
            res.status(400).json({})
        }

    } catch (error) {
        res.send(error)
    }

}


export const forgetPassword = async (req, res) => {
    try {
        const email = req.body.email
    const newOTP = generatePassword()
   const update= await updateOTP(email, newOTP).then((data) => {
        return data
    }).catch((err) => {
        console.log("err", err);
    })
    console.log(update);
    
    if (update==="updated") {
        sendMail(email, "email verification",newOTP)
        res.status(200).cookie("email", email).json({response:"verify your email by entering the otp"})
    } else {
        res.json({response:"enter a valid email"})
    }
    } catch (error) {
        res.json({error:error})
    }
    
}

export const resetPassword=async(req,res)=>{
    try {
        
        const saltRounds=10
        const password=req.body.password
        const email=req.cookies.email
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (hash) {
                console.log(hash);
                
                const updatedPassword= await updatePassword(email,hash).then((data) => {
                    return data
                }).catch((err) => {
                    console.log("err", err);
                })
                console.log(updatedPassword);
                
              return  res.status(200).json({response:updatedPassword})
            }
            return res.json({response:"reset password failed"})
            
        })


    } catch (error) {
        res.json({error:error})
    }
}


