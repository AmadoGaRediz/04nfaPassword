var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middleware").subirArchivo;
var eliminarArchivo=require("../middlewares/middleware").eliminarArchivo;
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario}=require("../bd/usuariosBD");
const Usuario = require("../modelos/Usuario");

ruta.get("/api/mostrarusuarios",async(req, res)=>{
    var usuarios = await mostrarUsuarios()
    if (usuarios.length==0){
        res.status(400).json("no hay usuarios");
    }
    else{
        res.status(200).json(usuarios);
    }  
});

ruta.post("/api/nuevoUsuario",subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    if (error==0){    
        res.status(200).json("usuario registrado correctamente");
    }
    else{
        res.status(400).json("Error al registrar usuario");
    }
});

ruta.get("/api/buscarUsuarioPorId/:id", async(req,res)=>{
    var user= await buscarporID(req.params.id);
    if (user==""){
        res.status(400).json("usuarios no encontrado");
    }
    else{
        res.status(200).json(user);
    }
});

ruta.post("/api/editarusuario",subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await modificarUsuario(req.body);
    if(error == 0){
        res.status(200).json("Usuario actualizado correctamente")
    }
    else{
        res.status(400).json("error al actualizar Usuario  ")
    }
});
/*
ruta.get("/api/borrarUsuario/:id", async(req,res)=>{
    var error = await borrarUsuario(req.params.id);
    if(error==0){
        res.status(200).json("Usuario borrado correctamente");
    }
    else{
        res.status(400).json("Error al borrar usuario");
    }
});*/


ruta.get("/api/borrarUsuario/:id", async(req,res)=>{
    try {
        var usuario = await buscarporID(req.params.id);
        if (!usuario) {
          res.status(400).send("Usuario no encontrado.");
        } else {
          var archivo = usuario.foto;
          await borrarUsuario(req.params.id);
          eliminarArchivo(archivo)(req, res, () => {
            
            res.status(200).json("Usuario borrado correctamente");
          });
        }
      } catch (err) {
        console.log("Error al borrar usuario" + err);
        res.status(400).send("Error al borrar usuario.");
      }
});

module.exports=ruta;