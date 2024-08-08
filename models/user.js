
import { DB } from "../connection/connection.js"
import nodemailer from "nodemailer";

//check duplicate user
export const checkUser = async (email) => {
   // console.log(email);
    const sql = `SELECT * FROM users WHERE email="${email}";`;
    return new Promise((resolve, reject) => {
        DB.query(sql, (err, result) => {
            if (err) {
              //  console.log("error=", err);
                reject("failed");
            } else {
               // console.log("result", result);
                resolve(result);
            }
        });
    });
};

//insert a new user
export const insertUser=async(name,password,email,profilePic,otp)=>{
    console.log("values=",name,password,email,profilePic,otp);
    
    const sql = `insert into users (name,password,email,profilePic,otp) values ("${name}","${password}","${email}","${profilePic}","${otp}");`
          return new Promise((resolve,reject)=>{
            DB.query(sql,(err,result)=>{
                if (err) { 
                    console.log("error=", err);
                    
                  reject ("failed") 
                }
                console.log("result=",result);
                
                resolve("inserted")
            })
          })
   
}

//update a user field
export const updateOTP=async(email,otp)=>{
    let sql
    if (otp) {
         sql=`UPDATE users SET otp = "${otp}"  WHERE email="${email}";`
    } else {
          sql=`UPDATE users SET otp = NULL  WHERE email="${email}";`
      
    }
    return new Promise((resolve,reject)=>{
        DB.query(sql,(err,result)=>{
            if (err) { 
                console.log("error=", err);
                
              reject ("failed") 
            }
            console.log("result=",result);
            
            resolve("updated")
        })
      })

}

export const updatePassword=async(email,password)=>{
    const sql=`UPDATE users SET password = "${password}"  WHERE email="${email}";`
    return new Promise((resolve,reject)=>{
        DB.query(sql,(err,result)=>{
            if (err) { 
                console.log("error=", err);
                
              reject ("failed") 
            }
            console.log("result=",result);
            
            resolve("password updated")
        })
      })

}


















//email verification
export const verifyEmail = async (email) => {
    // console.log(email);
     const sql = `SELECT otp FROM users WHERE email="${email}";`;
     return new Promise((resolve, reject) => {
         DB.query(sql, (err, result) => {
             if (err) {
                console.log("error=", err);
                 reject("failed");
             } else {
                console.log("result", result);
                 resolve(result[0]);
             }
         });
     });
 };

 //random password/token generater
 export const generatePassword=()=>{
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

//send mail
export const sendMail=(email, subject, text)=>{
    let mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.email,
            pass: process.env.password,
        },
    });

    let mailDetails = {
        from: process.env.email,
        to: email,
        subject: subject,
        text: text,
    };

    mailTransport.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log("Error Occurs");
        } else {
            console.log("Email sent successfully");
        }
    });
}