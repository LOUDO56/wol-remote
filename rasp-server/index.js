const { exec } = require("child_process");
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authenticateToken = require("./checkAuthorization")
app.use(cookieParser());

app.listen(4001, () => {
	console.log("Server started at port", 4001)
});

app.use(cors());


app.get('/wakeup', authenticateToken, (req, res) => {
    const cmd = "wakeonlan " + process.env.MAC_ADDRESS;
    exec(cmd, (err, stdout, stderr) => {
        if (err) res.status(401).json({result: "Une erreur est survenue lors de la commande: " + err });
        else if (stderr) res.status(401).json({result: "Une erreur est survenue lors de la commande: " + err });
        else{
            res.status(200).json({result: "La commande a été effectué avec succès. Le pc se lance..."});
            console.log(stdout);  
        } 
    });
});

app.post("/login", (req, res) => {
    let link;
    if(req.hostname == "192.168.1.41")
        link = "http://192.168.1.41:82/wakeonlan";
    else
        link = "https://fannywiicollec.ddns.net/wakeonlan";
    const password = req.body.passwd;
    if(password != process.env.PASSWORD) return res.redirect(link);
    const token = jwt.sign({"password": password}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30d" });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    })
    return res.redirect(link);
});

app.get("/getToken", (req, res) => {
    res.json(req.cookies)
});

