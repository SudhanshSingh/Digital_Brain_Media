const express=require('express')
const userController=require('../controllers/userController')
const taskController=require("../controllers/taskController")
const {Authenticate, Authorisation} = require('../middleware/middware')
const router=express.Router();

//----------------User Apis --------------------
router.post('/register',userController.register)
router.post('/login',userController.login)
router.get('/user/:userId/profile', Authenticate, Authorisation, userController.getProfile)
router.put('/user/:userId/profile', Authenticate, Authorisation, userController.updateProfile)
router.delete('/user/:userId/profile', Authenticate, Authorisation, userController.deleteUser)
//--------------- Task Apis --------------------

router.post('/tasks',Authenticate,taskController.createTask)
router.get('/tasks',Authenticate,taskController.getTaskList)
router.put('/tasks/:id',Authenticate,Authorisation,taskController.updateTask)
router.delete('/tasks/:id',Authenticate,Authorisation,taskController.deleteTask)

module.exports=router