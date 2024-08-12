import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()


export const DB = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.sqlPassword,
    database: process.env.dbName
})
DB.connect((err) => {
    if (err) {
        console.log("not connected",err);
    }
    else{
        console.log("DB connected");
    }
})


