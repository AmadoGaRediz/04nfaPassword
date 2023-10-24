var ruta = require("express").Router();
var {mostrarProductos,agregarNuevoProducto,buscarProductoPorID,modificarProducto,borrarProducto} = require("../bd/productosBD");
var { subirArchivoProd, eliminarArchivoProd } = require("../middlewares/middleware");

const Producto = require("../modelos/Productos");

ruta.get("/api/mostrarproductos", async (req, res) => {
    var productos = await mostrarProductos();
    if (productos.length==0){
        res.status(400).json("no hay productos");
    }
    else{
        res.status(200).json(productos);
    } 
});

ruta.post("/api/nuevoproducto",subirArchivoProd(), async (req, res) => {
    req.body.foto=req.file.originalname;
    var error = await agregarNuevoProducto(req.body);
    if (error==0){    
        res.status(200).json("producto registrado correctamente");
    }
    else{
        res.status(400).json("Error al registrar producto");
    }
});

ruta.get("/api/editarProducto/:id", async (req, res) => {
    var producto = await buscarProductoPorID(req.params.id);
    if (producto==""){
        res.status(400).json("producto no encontrado");
    }
    else{
        res.status(200).json(producto);
    }
});

ruta.post("/api/editarproducto",subirArchivoProd(), async (req, res) => {
    req.body.foto=req.file.originalname;
    var error = await modificarProducto(req.body);
    if(error == 0){
        res.status(200).json("Producto actualizado correctamente")
    }
    else{
        res.status(400).json("error al actualizar Producto")
    }
});

ruta.get("/api/borrarProducto/:id", async (req, res) => {
    try {
        var producto = await buscarProductoPorID(req.params.id);
        if (!producto) {
          res.status(400).send("producto no encontrado.");
        } else {
          var archivo = producto.foto;
          await borrarProducto(req.params.id);
          eliminarArchivoProd(archivo)(req, res, () => {
            res.status(200).json("Producto borrado correctamente");
          });
        }
      } catch (err) {
        console.log("Error al borrar producto" + err);
        res.status(400).send("Error al borrar producto.");
      }
});

module.exports = ruta;
