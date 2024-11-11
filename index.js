const express = require("express");
const App = express();

require('dotenv').config();


const PORT = process.env.PORT || 4000;



// cookie-parser - what is this and why we need this?
const cookieParser = require("cookie-parser");
App.use(cookieParser());

App.use(express.json());

require("./config/database").connect();

// route import and mount
const user = require("./routes/user");
App.use("/api/v1", user);

// Activate server
App.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});

console.log("MongoDB URL:", process.env.MONGODB_URL);
console.log("JWT Secret:", process.env.JWT_SECRET);

