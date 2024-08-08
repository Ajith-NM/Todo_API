import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./Router/router.js";

const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/",router)
app.listen(4001,()=>console.log("server running"))