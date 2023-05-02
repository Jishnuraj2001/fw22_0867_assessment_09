const express=require("express");
const postRouter=express.Router();

const{authenticator}=require("../middlewares/authenticator.middleware");
const{Postmodel}=require("../models/post.model");


postRouter.post("/posts",authenticator,async(req,res)=>{
    const{userID,text,image,createdAt,likes,comments}=req.body;
    try {
        const post=new Postmodel({user:userID,text,image,createdAt,likes,comments});
        await post.save();
        res.status(201).json({"msg":"new post created successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to post the Post"});
    }
})



postRouter.get("/posts",async(req,res)=>{
    try {
        const posts=await Postmodel.find().populate(["likes"]);
        if(posts.length!=0){
            res.status(200).json({"msg":"got all posts","posts":posts});
        }else{
            res.status(404).json({"msg":"no posts"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to post the Post"});
    }
})

postRouter.get("/posts/:id",async(req,res)=>{
    const postid=req.params.id;
    try {
        const posts=await Postmodel.findOne({_id:postid}).populate(["likes"]);
        if(posts){
            res.status(200).json({"msg":`post with id ${postid}`,"post":posts});
        }else{
            res.status(404).json({"msg":"no post"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to post the Post"});
    }
})

postRouter.patch("/posts/:id",authenticator,async(req,res)=>{
    const {text,image}=req.body;
    const postid=req.params.id;
    const userID=req.body.userID;
    try {
        const post=await Postmodel.findOne({_id:postid});
        if(post){
            let Text=text?text:post.text;
            let Image=image?image:post.image;
            if(userID==post.user){
                await Postmodel.findByIdAndUpdate({_id:postid},{text:Text,image:Image});
                res.status(204).json({"msg":"updated the post successfully"});
            }else{
                res.status(404).json({"msg":"You are not authorized to do updation"});
            }
        }else{
            res.status(404).json({"msg":"Unable to find the the Post"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to update the Post"});
    }
})



postRouter.delete("/posts/:id",authenticator,async(req,res)=>{
    const postid=req.params.id;
    const userID=req.body.userID;
    try {
        const post=await Postmodel.findOne({_id:postid});
        if(post){
            if(userID==post.user){
                await Postmodel.findByIdAndDelete({_id:postid});
                res.status(202).json({"msg":"deleted the post successfully"});
            }else{
                res.status(404).json({"msg":"You are not authorized to do deletion"});
            }
        }else{
            res.status(404).json({"msg":"Unable to find the the Post"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to delete the Post"});
    }
})



postRouter.post("/posts/:id/like",authenticator,async(req,res)=>{
    const userID=req.body.userID;
    const postid=req.params.id;
    try {
        const post=await Postmodel.findOne({_id:postid});
        if(post){
            let likes=post.likes;
            likes.push(userID);
            await Postmodel.findByIdAndUpdate({_id:postid},{likes:likes});
            res.status(201).json({"msg":`Post with id ${postid} is liked by user with id${userID}`});
        }else{
            res.status(404).json({"msg":"Unable to find the Post"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to like the Post"});
    }
})



postRouter.post("/posts/:id/comment",authenticator,async(req,res)=>{
    const userID=req.body.userID;
    const postid=req.params.id;
    const obj=req.body;
    try {
        const post=await Postmodel.findOne({_id:postid});
        if(post){
            let comments=post.comments;
            comments.push({user:userID,...obj});
            await Postmodel.findByIdAndUpdate({_id:postid},{comments:comments});
            res.status(201).json({"msg":`Post with id ${postid} is commented by user with id${userID}`});
        }else{
            res.status(404).json({"msg":"Unable to find the Post"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"Unable to comment on this Post"});
    }
})


module.exports={
    postRouter
}