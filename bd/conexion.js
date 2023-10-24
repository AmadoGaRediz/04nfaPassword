var admin = require("firebase-admin");
var keys = require("../madobd.json");

admin.initializeApp({
    credential: admin.credential.cert(keys)
});

var db = admin.firestore();
var conexionUs = db.collection("usuariosbd"); // Cambiando el nombre de la variable
var conexionProd = db.collection("productosbd");

module.exports = {
    conexionUs, // Actualizando el nombre aquí
    conexionProd
};
