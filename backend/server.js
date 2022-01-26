const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");

dotenv.config();
connectDB(); 
const app = express();


app.get('/', (req, res) => {
    console.log('hello from server');
    res.send('Api running');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));
