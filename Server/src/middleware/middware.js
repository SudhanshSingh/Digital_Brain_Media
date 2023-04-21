const jwt = require("jsonwebtoken");
const taskModel = require("../models/taskModel")
const Validator = require("../validators/validations")

const Authenticate = function (req, res, next) {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(401).send({ status: false, message: "token must be present in the request header" });
        const newToken = token.split(" ")
        token = newToken[1]

        jwt.verify(token,"todo-app",function(err,decodedToken){
            if(err)  return res.status(401).send({ status: false, message: "token is not valid" });
            else {
                req.logInUserId = decodedToken.userId
                next();
            } 
        });
       
    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })
    }
}


const Authorisation = async function (req, res, next) {
    try {
        let userLoggedIn = req.logInUserId
        let taskId = req.params.id
       console.log("userLoggedIn",userLoggedIn)
       console.log("taskId",taskId)
        if (taskId) {
            // update or delete 
            if(!Validator.isValidObjectId(taskId)) return res.status(400).send({ status: false, message: "taskId is not valid" })
            
            let taskDoc = await taskModel.findOne({ _id: taskId })
            // console.log("taskDoc",taskDoc)
            if(!taskDoc) return res.status(400).send({ status: false, message: 'No taskFound with this taskId' })
            let newAuth = taskDoc.userId
        
            if (newAuth != userLoggedIn) return res.status(403).send({ status: false, message: 'Sorry U are not Authorised !!' })
        }
        next()
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.Authorisation = Authorisation
module.exports.Authenticate = Authenticate
