const taskModel = require("../models/taskModel");
const validator = require("../validators/validations");
const userModel = require("../models/userModel");

const createTask = async function (req, res) {
  try {
    let body = req.body;
    let { title, description, status, userId, alarmDate, dueDate } = body;
    body["alarmDate"] = new Date(alarmDate);
    body["dueDate"] = new Date(dueDate);

    // <-----------reqBody Validations--------------->
    if (!validator.isValidBody(body))
      return res
        .status(404)
        .send({ status: false, message: "plz provide the data in body" });

    // <-----------userId Validations--------------->
    if (!validator.isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: " user id is not valid 😡" });

    let userDoc = await userModel.findById(userId);

    if (!userDoc)
      return res
        .status(404)
        .send({ status: false, message: "No User found with this userId 😡" });

    // <----------title validation----------->
    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "title is required" });
    if (!validator.isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "title should be in correct format" });

    // <----------description validation----------->
    if (!description)
      return res
        .status(400)
        .send({ status: false, message: "description is required" });
    if (!validator.isValid(description))
      return res.status(400).send({
        status: false,
        message: "description should be in correct format",
      });
    // <----------status validation----------->
    if (!status)
      return res
        .status(400)
        .send({ status: false, message: "status is required" });
    if (!validator.isValid(status))
      return res
        .status(400)
        .send({ status: false, message: "status should be in correct format" });

    if (!["New", "Pending", "Completed"].includes(status))
      return res.status(400).send({
        status: false,
        message: `status should be in ${["New", "Pending", "Completed"]}`,
      });

    // <-----------createing task for user--------------->
    let taskData = await taskModel.create(body);
    return res.status(201).send({
      status: true,
      message: "task created successfully",
      data: taskData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getTaskList = async function (req, res) {
  try {
    let queryObj = req.query;
    queryObj["userId"] = req.logInUserId;
    queryObj["isDeleted"] = false;
    console.log("query", queryObj);
    let { status, dueDate, hasAlarm } = queryObj;
    // --------status validation---------------
    if (status){

        if (!validator.isValid(status))
        return res.status(400).send({
            status: false,
            message: "status should be in correct format",
        });
        
        if (!["New", "Pending", "Completed"].includes(status))
        return res.status(400).send({
            status: false,
            message: `status should be in ${["New", "Pending", "Completed"]}`,
        });
    }

    // --------hasAlarm validation---------------
    if (hasAlarm){

        if (!validator.isValid(hasAlarm))
        return res.status(400).send({
            status: false,
            message: "hasAlarm should be in correct format",
        });
        
        if (!["true", "false"].includes(hasAlarm))
        return res
        .status(400)
        .send({ status: false, message: `hasAlarm should be in boolean` });
    }
    let todoData = await taskModel.find(queryObj);
    return res
      .status(200)
      .send({ status: true, message: "users todo list", data: todoData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// -------------------- Api to update task---------------------------------
const updateTask = async function (req, res) {
  try {
    let taskId = req.params.id;
    let body = req.body;
    let { title, description, status, userId, alarmDate, dueDate } = body;
    // <-----------reqBody Validations--------------->
    if (!validator.isValidBody(body))
      return res
        .status(404)
        .send({ status: false, message: "plz provide the data in body" });

    // <-----------userId Validations--------------->
    if (!validator.isValidObjectId(taskId))
      return res
        .status(400)
        .send({ status: false, message: " taskId is not valid 😡" });

    let taskDoc = await taskModel.findById(taskId);

    if (!taskDoc)
      return res
        .status(404)
        .send({ status: false, message: "No User found with this taskId 😡" });
    // <----------title validation----------->
    if (title) {
      if (!validator.isValid(title))
        return res.status(400).send({
          status: false,
          message: "title should be in correct format",
        });
    }

    // <----------description validation----------->
    if (description) {
      if (!validator.isValid(description))
        return res.status(400).send({
          status: false,
          message: "description should be in correct format",
        });
    }

    // <----------status validation----------->
    if (status)
      if (!validator.isValid(status))
        return res.status(400).send({
          status: false,
          message: "status should be in correct format",
        });

    if (!["New", "Pending", "Completed"].includes(status))
      return res.status(400).send({
        status: false,
        message: `status should be in ${["New", "Pending", "Completed"]}`,
      });
    let updatedData = await taskModel.findOneAndUpdate(
      { _id: taskId },
      { $set: body },
      { new: true }
    );
    // console.log(updatedData);
    return res.status(200).send({
      status: true,
      message: "todo list successfully updated",
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//-------------------------Api to delete Task------------------

const deleteTask = async function (req, res) {
  try {
    let taskId = req.params.id;
    console.log("taskId", taskId);
    if (!validator.isValidObjectId(taskId))
      return res
        .status(400)
        .send({ status: false, message: "taskId is not valid" });

    let data = await taskModel.findOne({ _id: taskId, isDeleted: false });
    if (!data)
      return res.status(404).send({
        status: false,
        message: "No such task found or already deleted",
      });
    await taskModel.findOneAndUpdate(
      { _id: taskId },
      { $set: { isDeleted: true } }
    );

    return res
      .status(200)
      .send({ status: true, message: "task deleted successfully " });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



module.exports = { createTask, getTaskList, updateTask, deleteTask };
