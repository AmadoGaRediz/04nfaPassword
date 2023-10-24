var { conexionUs, conexionProd } = require("./conexion");
var Producto = require("../modelos/Productos");

async function mostrarProductos() {
    var productos = [];
    try {
        var productosBD = await conexionProd.get();
        productosBD.forEach((producto) => {
            var producto1 = new Producto(producto.id, producto.data());
            if (producto1.bandera == 0) {
                productos.push(producto1.obtenerProducto);
            }
        });
    } catch (err) {
        console.log("Error al obtener los productos de firebase: " + err);
        productos.push(null);
    }
    return productos;
}

async function buscarProductoPorID(id) {
    var producto;
    try {
        var productoBD = await conexionProd.doc(id).get();
        var productoObjeto = new Producto(productoBD.id, productoBD.data());
        if (productoObjeto.bandera == 0) {
            producto = productoObjeto;
        }
    } catch (err) {
        console.log("Error al buscar el producto: " + err);
        producto = null;
    }
    return producto;
}

async function agregarNuevoProducto(datos) {
    var producto = new Producto(null, datos);
    var error = 1;
    console.log(producto.obtenerProducto);
    if (producto.bandera == 0) {
        try {
            await conexionProd.doc().set(producto.obtenerProducto);
            console.log("Producto registrado correctamente");
            error = 0;
        } catch (err) {
            console.log("Error al registrar el producto: " + err);
        }
    }
    return error;
}

async function modificarProducto(datos) {
    var producto = new Producto(datos.id, datos);
    var error = 1;
    if (producto!=undefined){
        var producto = new Producto(datos.id, datos)
        if (producto.bandera == 0) {
            try {
                await conexionProd.doc(producto.id).set(producto.obtenerProducto);
                console.log("Producto actualizado");
                error = 0;
            } catch (err) {
                console.log("Error al modificar el producto: " + err);
            }
        } else {
            console.log("Los datos del producto no son correctos");
        }
    }    
    return error;
}

async function borrarProducto(id) {
    var error = 1;
    var producto = await buscarProductoPorID(id);
    if(producto!=undefined){
        try {
            await conexionProd.doc(id).delete();
            console.log("Producto eliminado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar el producto: " + err);
        }
    }
    return error;
}

module.exports = {
    mostrarProductos,
    buscarProductoPorID,
    agregarNuevoProducto,
    modificarProducto,
    borrarProducto
};
