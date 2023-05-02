const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { Usermodel } = require("../models/user.model");
const { authenticator } = require("../middlewares/authenticator.middleware");

userRouter.post("/register", async (req, res) => {
    const { name, email, password, dob, bio, posts, friends, friendRequests } = req.body;
    try {
        const checker = await Usermodel.findOne({ email });
        if (checker) {
            res.status(201).json({ "msg": "this email is already registered, Please use another or Login to existing one" });
        } else {
            bcrypt.hash(password, 7, async (err, hash) => {
                if (hash) {
                    const user = new Usermodel({ name, email, password: hash, dob, bio, posts, friends, friendRequests });
                    await user.save();
                    res.status(201).json({ "msg": "registration successful." });
                } else {
                    console.log(err.message);
                    res.status(404).json({ "msg": "Unable to regiter the user,hash", "err": err.message });
                }
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ "msg": "Unable to regiter the user", "err": error.message });
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usermodel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result == true) {
                    const token = jwt.sign({ userID: user._id }, process.env.key);
                    res.status(201).json({ "msg": "Login successful", "token": token });
                } else {
                    res.status(404).json({ "msg": "wrong credentials,Please provide vaild password" });
                }
            });
        } else {
            res.status(404).json({ "msg": "wrong credentials,Please provide vaild email id" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ "msg": "Unable to login the user", "err": error.message });
    }
})


userRouter.get("/users", async (req, res) => {
    try {
        const users = await Usermodel.find();
        if (users.length != 0) {
            res.status(200).json({ "msg": "all registrated users data", "data": users });
        } else {
            res.status(404).json({ "msg": "no user present" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ "msg": "Unable to get the user data", "err": error.message });
    }
})


userRouter.get("/users/:id/friends", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await Usermodel.findOne({ _id: id });
        if (user) {
            const friends = user.friends;
            if (friends.length != 0) {
                res.status(200).json({ "msg": `friends of user with id :${id}`, "friends": friends });
            } else {
                res.status(404).json({ "msg": `friends list of user with id ${id} is empty` });
            }
        } else {
            res.status(404).json({ "msg": "user not present" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ "msg": "Unable to get the friends data", "err": error.message });
    }
})




 userRouter.post("/users/:id/friends",authenticator,async (req, res) => {
     const id = req.params.id;
     const userID=req.body.userID;
     try {
         const user = await Usermodel.findOne({ _id: id });
         if (user) {
             let friendRequests = user.friendRequests;
             friendRequests.push(userID);
             await Usermodel.findByIdAndUpdate({_id:id},{"friendRequests":friendRequests});
             res.status(201).json({ "msg": `friend request sended successfully.`});
         } else {
             res.status(404).json({ "msg": "user not present" });
         }
     } catch (error) {
         console.log(error.message);
         res.status(404).json({ "msg": "Unable to send friend request", "err": error.message });
     }
 })



 userRouter.patch("/users/:id/friends/:friendId",authenticator,async(req,res)=>{
    id=req.params.id;
    friendId=req.params.friendId;
    const status=req.body.status;
    try {
        res.send("Accepted");
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ "msg": "Unable to accept/reject friend request", "err": error.message });
    }
 })




module.exports = {
    userRouter
}