const express = require('express');
const app = express();
const { exec } = require('child_process')
const authenticateToken = require("./checkAuthorization");

app.listen(4001, () => {
	console.log("Server started at port", 4001)
});

app.get("/shutdown", authenticateToken, (req, res) => {
    exec("shutdown -s -f -t 1", (err, stdout, stderr) => {
        if (err) res.status(401).json({result: "Une erreur est survenue lors de la commande: " + err });
        else if (stderr) res.status(401).json({result: "Une erreur est survenue lors de la commande: " + err });
        else{
            res.status(200).json({result: "La commande a été effectué avec succès. Le pc va s'éteindre..."});
            console.log(stdout);  
        } 
    });
});

app.get("/hibernate", authenticateToken, (req, res) => {
    exec("shutdown -h", (err, stdout, stderr) => {
        if (err) res.status(401).json({result: "Une erreur est survenue lors de la commande: " + err });
        else if (stderr) res.status(401).json({result: "Une erreur est survenue lors de la commande: " + err });
        else{
            res.status(200).json({result: "La commande a été effectué avec succès. Le pc se met en hibernation..."});
            console.log(stdout);  
        } 
    });

});
