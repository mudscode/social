const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

// Register 
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        }) 

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})


// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        if(!user){
            res.status(404).json("User not found");
        }
        // !user && res.status(404).send("User not found.");   
         
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass){
            res.status(400).json("Password Incorrect."); 
        }

        res.status(200).json(user);
    } catch (error) {  
        res.status(500).json(error);
    }
})

module.exports = router;
