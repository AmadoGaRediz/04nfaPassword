/*
var express = require("express");
var ruta = express.Router();
var login = require ("../middlewares/autentificar").login;
//esto va en usuario

ruta.get("/login", (req, res) => {
    res.render("usuarios/login");
});


ruta.post("/login", async(req, res) => {
    var user=await login(req.body);
    if (usuario == undefined) {  
        res.redirect("/login");
    } else {
        if (user.admin){
            console.log("Administrador");
            req.session.admin=req.body.usuario;
            res.redirect("/nuevoProducto");
        }
        else{
            console.log("usuario");
            req.session.usuario=req.body.usuario;
            res.redirect("/");
        }
    }
});

ruta.get("/logout",(res,req)=>{
    req.session=null;
    res.redirect("/login");
});


module.exports = ruta;
*/