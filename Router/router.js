import express from "express";
const router = express.Router()
import multer from "multer";
import { body,query } from "express-validator";
import { validator } from "./middlewares/dataValidator.js";
import { userAuthentication } from "./middlewares/Authentication.js";
import { postSignup, emailValidation, postLogin,forgetPassword,resetPassword } from "../controllers/user_Controller.js";
import { deleteATask, getHome, postCreate, statusUpdate } from "../controllers/task_Controller.js";


const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage })

// users
router.post(
  "/postSignup", upload.single("image"),
  body("email").isEmail().withMessage("enter correct email"),
  body("username").not().isEmpty().withMessage("enter username"),
  body("password").not().isEmpty().withMessage("enter password"),
  validator,
  postSignup)

router.post("/emailVerification",
  body("otp").isLength({min: 8,max:8}).withMessage("OTP must be 8 character"),
  validator,
  emailValidation)

router.post("/postLogin",
  body("email").isEmail().withMessage("enter correct email"),
  body("password").not().isEmpty().withMessage("enter password"),
  validator,
  postLogin)

router.post("/forgetPassword",
  body("email").isEmail().withMessage("enter correct email"),
  validator,
  forgetPassword)

  router.put("/resetPassword",
    body("password").not().isEmpty().withMessage("enter password"),
    validator,
    resetPassword)



 // tasks
  router.get("/home",userAuthentication,getHome)

  router.post("/create",
    body("title").not().isEmpty().withMessage("enter title"),
    body("description").not().isEmpty().withMessage("enter a short description"),
    validator,
    userAuthentication,
    postCreate)

  router.put("/statusUpdate",
    body("status").not().isEmpty().withMessage("enter the status"),
    body("id").not().isEmpty().withMessage("enter  id of the task"),
    validator,
    userAuthentication,
    statusUpdate)

  router.delete("/deleteTask",
   query("id").not().isEmpty().withMessage("enter  id of the task"),
   validator,
    userAuthentication,
    deleteATask)

export default router