
import { DB } from "../connection/connection.js";

export const fetchAllData = async (id) => {

     const sql = `SELECT * FROM tasks WHERE userId=${id};`;
     return new Promise((resolve, reject) => {
         DB.query(sql, (err, result) => {
             if (err) {
              
                 reject("failed");
             } else {
              
                 resolve(result);
             }
         });
     });
 };

 export const createTask = async (title,desc,status,id) => {

   const sql = `INSERT INTO tasks (title,description,status,userId) VALUES ("${title}","${desc}","${status}",${id});`
    return new Promise((resolve, reject) => {
        DB.query(sql, (err, result) => {
            if (err) {
             
                reject("failed");
            } else {
                if (result.affectedRows) {
                    resolve("created")
                } else {
                    resolve("failed")
                }
            }
        });
    });
};

export const deleteTask=async(id,userId)=>{
    const sql=`DELETE FROM tasks WHERE Id=${id} AND userId=${userId};`
    return new Promise((resolve,reject)=>{
        DB.query(sql,(err,result)=>{
            if (err) {
                reject("failed")
            } else {
               // console.log("deleted=",result);
                if (result. affectedRows) {
                    resolve("deleted")
                } else {
                    resolve("failed")
                }
                
                
            }
        })
    })
}


export const updateTaskStatus=async(id,userId,status)=>{
   
      const sql=`UPDATE tasks SET status = "${status}"  WHERE Id=${id} AND userId=${userId};`
   
    return new Promise((resolve,reject)=>{
        DB.query(sql,(err,result)=>{
            if (err) { 
                console.log("error=", err);
                
              reject ("failed") 
            }
            else{
           
            if (result.changedRows) {
                resolve("updated")
            } else {
                resolve("failed")
            }
            }
        })
      })

}
