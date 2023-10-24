var ruta=require("express").Router();
var subirArchivo = require("../middlewares/middleware").subirArchivo;
var eliminarArchivo = require("../middlewares/middleware").eliminarArchivo;
var {autorizado} = require ("../middlewares/password");
var {admin} = require("../middlewares/password");
//var login = require ("../middlewares/autentificar").login;
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario,login}=require("../bd/usuariosBD");
const Usuario = require("../modelos/Usuario");

ruta.get("/",autorizado, async(req, res)=>{
    var usuarios = await mostrarUsuarios()
    //console.log(usuarios);
    res.render("usuarios/mostrar", {usuarios})
});

ruta.get("/nuevousuario", (req,res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario",subirArchivo(), async(req,res)=>{
    //console.log(req.file);
    //console.log(req.body);
    req.body.foto=req.file.filename;
    var error=await nuevoUsuario(req.body);
    //res.end();
    res.redirect("/");
});

ruta.get("/editarUsuario/:id", async(req,res)=>{
    console.log(req.params.id);
    buscarporID();
    var user= await buscarporID(req.params.id);
    res.render("usuarios/modificar", {user});
    res.end();
});

ruta.post("/editarusuario", subirArchivo(), async(req,res)=>{
  if (req.file != null){
    req.body.foto = req.file.filename;
  }else{
    req.body.foto = req.body.fotoAnterior;
  }
    //console.log(req.body);
    //req.body.foto=req.file.originalname;
    var error = await modificarUsuario(req.body);
    res.redirect("/");
});


ruta.get("/borrarUsuario/:id", async (req, res) => {
    try {
      var usuario = await buscarporID(req.params.id);
      if (!usuario) {
        res.status(400).send("Usuario no encontrado.");
      } else {
        var archivo = usuario.foto;
        await borrarUsuario(req.params.id);
        eliminarArchivo(archivo)(req, res, () => {
          res.redirect("/");
        });
      }
    } catch (err) {
      console.log("Error al borrar usuario" + err);
      res.status(400).send("Error al borrar usuario.");
    }
  });



  ruta.get("/login", (req, res) => {
    res.render("usuarios/login");
   });

//esto va en usuario
ruta.post("/login", async(req, res) => {
    var user=await login(req.body);
    if (user == undefined) {  
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

  ruta.get("/logout",(req,res)=>{
    req.session=null;
    res.redirect("/login");
  });
  

  ruta.get("/registro", (req,res)=>{
    res.render("usuarios/registro");
});



module.exports=ruta;