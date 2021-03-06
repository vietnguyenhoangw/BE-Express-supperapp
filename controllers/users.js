const { response } = require("express");
const mongoose = require("mongoose");

// functions
var returnFunction = require("../functions/return_form.js");

const indexUser = (_req, res, next) => {
  console.log("run index user method");
  // Retrieve all users from Mongo
  mongoose.model("Users").find({}, (error, users) => {
    if (error) {
      const responseResult = returnFunction.returnRequest(500, null, error);
      res.send(responseResult);
    }
    const responseResult = returnFunction.returnRequest(200, users);
    res.send(responseResult);
  });
};

const storeUser = (req, res) => {
  // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
  const {
    name,
    dob,
    phone,
    email,
    description,
    imageProfile,
    coverImage,
    password
  } = req.body;

  //call the create function for our database
  mongoose.model("Users").create(
    {
      _id: new mongoose.Types.ObjectId(),
      name: name,
      dob: dob,
      phone: phone,
      email: email,
      createAt: new Date(),
      description: description,
      imageProfile: imageProfile,
      coverImage: coverImage,
      password: password
    },
    (error, user) => {
      if (error) {
        const responseResult = returnFunction.returnRequest(500, null, error);
        res.send(responseResult);
      } else {
        const responseResult = returnFunction.returnRequest(200, user);
        res.send(responseResult);
      }
    }
  );
};

const getUser = (req, res, next) => {
  mongoose.model("Users").findById(req.params.id, (error, user) => {
    if (error) {
      return next(error);
    }
    console.log("GET Retrieving ID: " + user._id);
    res.format({
      html: () => {
        res.render("users/view", {
          title: "View of " + user.name,
          user: user,
        });
      },
      json: () => {
        res.json(user);
      },
    });
  });
};

// call to edit user form
const editUser = (req, res) => {
  const id = req.params.id;
  // Search for the user within Mongo
  mongoose.model("Users").findById(id, (error, user) => {
    if (error) {
      const responseResult = returnFunction.returnRequest(500, null, error);
      res.send(responseResult);
    }
    //Return the user
    // console.log('GET Retrieving ID: ' + user._id);
    const responseResult = returnFunction.returnRequest(200, user);
    res.send(responseResult);
  });
};

const updateUser = (req, res) => {
  // Get our REST and form values.
  const id = req.params.id;
  const { name, email } = req.body;

  //find the document by ID
  mongoose.model("Users").findByIdAndUpdate(
    id,
    {
      name: name,
      email: email,
    },
    (error, user) => {
      if (error) {
        const responseResult = returnFunction.returnRequest(500, null, error);
        res.send(responseResult);
      }
      const responseResult = returnFunction.returnRequest(200, user);
      res.send(responseResult);
    }
  );
};

const deleteUser = (req, res, next) => {
  // Find user to delete by ID
  mongoose.model("Users").findById(req.params.id, (error, user) => {
    if (error) {
      const responseResult = returnFunction.returnRequest(500, null, error);
      res.send(responseResult);
    }
    //remove it from Mongo
    user.remove((error, user) => {
      if (error) {
        const responseResult = returnFunction.returnRequest(500, null, error);
        res.send(responseResult);
      }
      const responseResult = returnFunction.returnRequest(200, user);
      res.send(responseResult);
    });
  });
};

module.exports = {
  indexUser,
  getUser,
  editUser,
  updateUser,
  deleteUser,
  storeUser,
};
