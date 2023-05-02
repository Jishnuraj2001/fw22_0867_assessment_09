const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.router");
const { postRouter } = require("./routes/post.router");

app.get("/", (req, res) => {
    res.send("Basic API Endpoint for Social Media App");
})
app.use("/", userRouter);
app.use("/", postRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to MongoDB");
        console.log(`Server is running at http://localhost:${process.env.port}`);
    } catch (error) {
        console.log("Connection Failed");
        console.log(error.message);
    }
})