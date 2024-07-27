const express = require("express");
const errorHandler = require("./middleware/errorHandler");
// const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const connectDatabase = require('./config/database');

// connectDb()
connectDatabase();

// this applies json to the input from the user
app.use(express.json()); 


app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, ()=> {
    console.log(`server running on ${port}`)
})