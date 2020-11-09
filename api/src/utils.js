require('dotenv').config();
const jwt = require("jsonwebtoken");


const checkIsAdmin = (req, res, next) => {
    //Siempre que desde el front se haga llamado a una ruta protegida, tiene que mandar por header el token de usuario admin
    //Saco el token del header
	const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //Si no hay token, devuelvo 401 Unauthorized
    if ( token == null) return res.sendStatus(401);
    //Desencripto el token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, response) => {
        if (err) return console.log(err);
        //Si el rol del usuario contenido en el token es admin, dejamos pasar
        if(response.user.role === 'admin') return next();
        //Sino, mandamos Unauthorized
        res.sendStatus(401);
    });
}

const checkIsLoggedIn = (req, res, next) => {
    //Saco el token del header
	const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //Si no hay token, devuelvo 401 Unauthorized
    if ( token == null) return res.sendStatus(401);
    // Si el token no es null, lo dejo pasar
    next();
}

module.exports = {
    checkIsAdmin,
    checkIsLoggedIn
};