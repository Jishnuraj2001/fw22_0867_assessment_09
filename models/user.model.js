const { ObjectId } = require("bson");
const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
        name: String,
        email: String,
        password: String,
        dob: Date,
        bio: String,
        posts: [{ type: ObjectId, ref: 'Post' }],
        friends: [{ type: ObjectId, ref: 'User' }],
        friendRequests: [{ type: ObjectId, ref: 'User' }]
})

const Usermodel=mongoose.model("User",userSchema);

module.exports={
    Usermodel
}