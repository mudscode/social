const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const postRoute = require("./routes/post.js");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/social", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log(`> Connected with mongodb successfully.`))
  .catch((err) =>
    console.log(
      `> Error while connecting to mongoDB : ${err.message}`
    )
  );

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Routes
app.use("/api/auth", authRoute);    
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
