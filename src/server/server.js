const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userData = require("./model/userdetails")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const app = express();
const port = 3040;

const mongooseURI = "mongodb+srv://anurag:anurag7093@cluster0.a4roxmm.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.use(cors({ origin: "*" }))

mongoose.connect(mongooseURI)
    .then(() => console.log("TAgilindi"))
    .catch((e) => console.log(e.message))


app.get("/", (req, res) => {
    res.send("Randi ra randi ")


})


app.post("/register", async (req, res) => {
    try{
    const { fullname, email, mobile, skills, password, confirmPassword } = req.body



    const isUserExit = await userData.findone({ email: email });
    if (isUserExit) {
        return res.send("Vadu Mogad ra Bujji")
    }

    if (password!== confirmPassword) {
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

    catch(e){
     console.log(e.message);
     res.send("Lopta server Nilichipoindi")
    }


})

// jkdhvhdg
// czv


app.listen(port, () => {
    console.log(`Nadustundi server ${port}`);
})

