const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userData = require("./model/userdetails")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware=require("./middleware");




const app = express();
const port = 3042;

const mongooseURI = "mongodb+srv://anurag:anurag7093@cluster0.a4roxmm.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.use(cors({ origin: "*" }))

mongoose.connect(mongooseURI)
    .then(() => console.log("TAgilindi"))
    .catch((e) => console.log(e.message))


app.get("/", (req, res) => {
    res.send("Randi ra randi ")


})

// Data into the data base 


app.post("/register", async (req, res) => {
    try {
        const { fullname, email, mobile, skills, password, confirmPassword } = req.body



     const isUserExit=await userData.findOne({email: email});
        if (isUserExit) {
            return res.send("Vadu Mogad ra Bujji")
        }

        if (password !== confirmPassword) {
            return res.send("Edo Theda ga undi a thisey")
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        let newUser = new userData({
            fullname,
            email,
            mobile,
            skills,
            password: hashedpassword,
            confirmPassword: hashedpassword

        })
        newUser.save();
        res.send("Oka jwala puttindi sir");
    }

    catch (e) {
        console.log(e.message);
        res.send("Lopta server Nilichipoindi")
    }


})


app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const isUserExit= await userData.findOne({email})

    console.log("loginoo");

    if (isUserExit) {
        const ispaswordmatched = await bcrypt.compare(password, isUserExit.password)
        if (ispaswordmatched) {
            let payload = {
                user: isUserExit.id
            }
           jwt.sign(payload,'jwtpassword',{expiresIn:4600000000},
           (err,token)=>{
            if(err) throw err
            return res.json({token})

           })
        }
        else{
            return res.send("password not matched")
        }
    }
})

app.get("/alldevelopers", middleware,async(req,res)=>{
    const alldevelopers=await userData.find({});
    return res.json(alldevelopers);
})

app.get("/individualProfile/:id", middleware,async(req,res)=>{
    const {id}=req.params;
    const individualUser=await userData.findById({_id: id});
    if(!individualUser){
        return res.send("Echuta evaru leru ")
    }
    return res.send(individualUser);
})

app.listen(port, () => {
    console.log(`Nadustundi server ${port}`);
})

