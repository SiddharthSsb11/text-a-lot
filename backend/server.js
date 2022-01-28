const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");



dotenv.config();
connectDB(); 
const app = express();

app.use(express.json()); // to accept json data from req body sent from fe 

app.use("/api/user", userRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);
 
app.get('/', (req, res) => {
    //console.log('hello from server');
    res.send('Api running');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));
