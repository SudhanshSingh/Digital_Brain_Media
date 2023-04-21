const userModel = require("../models/userModel");
const validator = require("../validators/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const register = async function (req, res) {
  try {
    const body = req.body;
    const { fname, lname, email, phone, password, gender, profession } = body;
    //let password = body.password;

    // <--------reqBody validation----------------->
    if (!validator.isValidBody(body))
      return res
        .status(400)
        .send({ status: false, message: "Provide details inside body" });

    // <---------Fname validation---------------->
    if (!fname)
      return res
        .status(400)
        .send({ status: false, message: "fname is required" });
    if (!/^[A-Za-z]{2,15}$/.test(fname.trim()))
      return res
        .status(400)
        .send({ status: false, message: "fname not valid" });

    // <--------lname validation---------------->
    if (!lname)
      return res
        .status(400)
        .send({ status: false, message: "lname is required" });
    if (!/^[A-Za-z]{2,15}$/.test(lname.trim()))
      return res
        .status(400)
        .send({ status: false, message: "lname not valid" });

    // <--------email validation---------------->
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "please enter email" });
    if (!validator.isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid email" });

    // <--------Check Email is Exist in db or not-------------->
    const uniqueEmail = await userModel.findOne({ email });
    if (uniqueEmail)
      return res
        .status(409)
        .send({ status: false, message: "email is already exist" });

    // <---------Password validation & encrpt that---------->
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    if (!validator.isValidPassword(password))
      return res.status(400).send({
        status: false,
        message: "password is not in the valid formate",
      });
    let encryptPassword = await bcrypt.hash(password, saltRounds);
    // console.log(encryptPassword, "encryptPassword");

    body["password"] = encryptPassword;

    // <----------gender validation----------->
    if (!gender)
      return res
        .status(400)
        .send({ status: false, message: "gender is required" });
    if (!validator.isValid(gender))
      return res
        .status(400)
        .send({ status: false, message: "gender should be in correct format" });

    if (!["Male", "Female", "Custom"].includes(gender))
      return res
        .status(400)
        .send({
          status: false,
          message: `gender should be in ${["Male", "Female", "Custom"]}`,
        });
    // <-----------profession validation----------->
    if (!profession)
      return res
        .status(400)
        .send({ status: false, message: " please enter your profession " });
    if (!validator.isValid(profession))
      return res
        .status(400)
        .send({
          status: false,
          message: " profession should be in correct format",
        });

    // <----------Create a document of user---------->
    const userData = await userModel.create(body);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: userData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <-------------------logIn ------------------------->

const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!validator.isValidBody(req.body))
      return res
        .status(400)
        .send({ status: false, message: "req body is invalid !!" });

    // <--------email validation---------------->
    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    if (!validator.isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Enter valid email" });

    const data = await userModel.findOne({ email });
    // console.log(data);
    if (!data)
      return res
        .status(401)
        .send({ status: false, message: "email id is incorrect !" });
    // <--------password validation---------------->
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    const decryptPassword = await bcrypt.compare(password, data.password);
    if (!decryptPassword)
      return res
        .status(401)
        .send({ status: false, message: "password is incorrect" });

    // <-------generate JWT Token --------------->
    let payload = {
      userId: data._id,
    };
    let token = jwt.sign(payload,"todo-app");
    res.setHeader("x-api-key", token);
    res.status(200).send({
      status: true,
      message: "user logged in successfully",
      data: token,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//------------------------Get User Profile----------------

const getProfile = async function (req, res) {
  try {
    const param = req.params.userId;

    if(!validator.isValidObjectId(param))
      return res.status(400).send({status :false, message:"invalid UserId !!"})

    const data = await userModel.findById(param);
    if (!data)
      return res
        .status(400)
        .send({ status: false, message: "Profile not found" });
    return res
      .status(200)
      .send({ status: true, message: "Success", data: data });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ---------------------Update User Profile ----------------------


const updateProfile = async function (req, res) {
  try {
    const param = req.params.userId;
    const body = req.body;

    if(!validator.isValidBody(body))
      return res.status(400).send({ status :false, message:"Please enter some inputs !!" });

    const { fname, lname, email, phone,profession  } = body;
    let password = body.password;
    const update = {};

    // <--------reqBody validation----------------->
     if (!validator.isValidBody(body)) return res.status(400).send({ status: false, message: "Provide details incide body" })

    // <---------Fname validation---------------->
    if (fname) {
      if (!/^[A-Za-z]{2,15}$/.test(fname.trim()))
        return res
          .status(400)
          .send({ status: false, message: "fname not valid" });
      update["fname"] = fname;
    }

    // <--------lname validation---------------->
    if (lname) {
      if (!/^[A-Za-z]{2,15}$/.test(lname.trim()))
        return res
          .status(400)
          .send({ status: false, message: "lname not valid" });
      update["lname"] = lname;
    }

    // <--------email validation---------------->
    if (email) {
      if (!validator.isValidEmail(email))
        return res
          .status(400)
          .send({ status: false, message: "Enter valid email" });
      // <--------Check Email is Exist in db or not-------------->
      const uniqueEmail = await userModel.findOne({ email });
      console.log(uniqueEmail)
      if (uniqueEmail)
        return res
          .status(409)
          .send({ status: false, message: "email is already exist" });
      update["email"] = email;
    }

    // <----------Phone validation-------------->
    if (phone) {
      if (!validator.isValidMobile(phone))
        return res
          .status(400)
          .send({
            status: false,
            message: "phone is not in the valid formate",
          });
      // <-----------Check phone number is exist in db or not-------------->
      const uniquePhone = await userModel.findOne({ phone });
      if (uniquePhone)
        return res
          .status(409)
          .send({ status: false, message: "phone is already exist" });
      update["phone"] = phone;
    }

    // <---------Password validation & encrpt that---------->
    if (password) {
      if (!validator.isValidPassword(password))
        return res
          .status(400)
          .send({
            status: false,
            message: "password is not in the valid formate",
          });
      let encryptPassword = await bcrypt.hash(password, saltRounds);

      update["password"] = encryptPassword;
    }

    // <-------profession body validation----------->
   
        if (profession) {
          if (!validator.isValid(profession))
            return res
              .status(400)
              .send({ status: false, message: "profession  is required" });
          update["profession"] = profession;
        }

       

    const updatedData = await userModel.findOneAndUpdate(
      { _id: param },
      update,
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "Success", data: updatedData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


//-----------------Delete Profile Api--------------------------

const deleteUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    if (!validator.isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "userId is not valid" });

    let data = await userModel.findOne({ _id: userId, isDeleted: false });
    if (!data)
      return res
        .status(404)
        .send({
          status: false,
          message: "No such user found or already deleted",
        });

    await userModel.findOneAndUpdate(
      { _id: userId },
      { isDeleted: true, deletedAt: new Date() }
    );
    return res
      .status(200)
      .send({ status: true, message: "Successfully deleted the User Profile" });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

module.exports = { register, login ,getProfile,updateProfile,deleteUser};
