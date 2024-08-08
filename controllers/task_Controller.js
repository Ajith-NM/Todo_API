import { createTask, deleteTask, fetchAllData, updateTaskStatus } from "../models/task.js";


export const getHome = async (req, res) => {
    try {

        // console.log("user=", req.userId);
        let response
        const allTasks = await fetchAllData(req.userId).then((data) => {
            return data
        }).catch((err) => { console.log("error=", err) })

        if (allTasks.length == 0) {
           
                response= "please create a new task"
        } else {
            response=allTasks
        }
        res.status(200).json({
            tasks: response
        })

    } catch (error) {
        res.json({ error: error })
    }
}

export const postCreate = async (req, res) => {
    try {
        const { title, description } = req.body
        const userId = req.userId
        let response
        const newTask = await createTask(title, description, "pending", userId).then((data) => {
            return data
        }).catch((err) => { console.log("error=", err) })


        if (newTask === "failed") {
                response="failed to create new task"

        } else {
                response="new task added"
        }

        res.status(200).json({
            response: response
        })

    } catch (error) {
        res.json({ error: error })
    }
}

export const statusUpdate = async (req, res) => {
    try {
        const { status, id } = req.body
        const userId = req.userId
        let response
        const statusUpdate = await updateTaskStatus(id, userId, status).then((data) => {
            return data
        }).catch((err) => { console.log("error=", err) })


        if (statusUpdate == "failed") {
            response = "failed to update status"

        } else {
            response = "task updated"

        }
        res.status(200).json({
            response: response
        })

    } catch (error) {
        res.json({ error: error })
    }
}

export const deleteATask = async (req, res) => {
    try {
        const id = req.query.id
        const userId = req.userId
        console.log(id);
        let response
        const taskDelete = await deleteTask(id, userId).then((data) => {
            return data
        }).catch((err) => { console.log("error=", err) })

        if (taskDelete == "failed") {

            response = "failed to delete task"
        } else {
            response = "task deleted"
        }
        res.status(200).json({
            response: response
        })

    } catch (error) {
        res.json({ error: error })
    }
}
