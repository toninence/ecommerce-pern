require ( 'dotenv' ).config()
const axios = require('axios')

const server = require('express').Router()
const { json } = require('body-parser');
const bodyParser = require('body-parser')
const { User } = require('../db.js')
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken")
const superagent = require('superagent');
//Middlewares de checkeo de usuario
const { checkIsAdmin } = require('../utils.js')

const checkPassword = async(user,password) => {
	const comparacion = await bcrypt.compare(password, user.password)
	
	return comparacion
};

server.get('/githublogin/:code', ( req, res ) => {
	const { code } = req.params;
	axios.post(`https://github.com/login/oauth/access_token`, {
		accept: 'aplication/json',
		client_id: '658de51c3bbf0db736fc',
		client_secret: 'df08e0012f3cc6343730c2aa176960403b0f44e8',
		code,
	})
	.then( response => {	
		//console.log(response)
		access_token = response.data.split('&');
		access_token = access_token[0].split('=');
		access_token = access_token[1];		
		return access_token;
	})
	.then( token => {
		superagent
		.get('https://api.github.com/user')
		.set('Authorization', 'token ' + token)
		.set('user-agent', 'node.js')
		.then( result => {
			const user = result.body;
			superagent
			.get('https://api.github.com/user/emails')
			.set('Authorization', 'token ' + token)
			.set('user-agent', 'node.js')
			.then( mail => {
				const userMail = mail.body;
				/* console.log('user', user)
				console.log('usermail', userMail) */
				superagent
				.post('http://localhost:3001/auth/externalLogin')
				.send({ email: userMail[0].email, first_name: user.login, last_name: '' }) // sends a JSON post body
				.set('accept', 'json')
				.then( response => res.status(200).send(response.body))
				//return res.status(200).json({ user, userMail });
			})
			
		})
		.catch( err => console.log(err))
	})
	.catch( err => res.status(400).send(err))
})

server.post('/externalLogin',(req,res) =>{
	const { external } = req.query
	const { email, first_name, last_name } = req.body
	console.log('external')
	User.findOrCreate({
		where:{ email },
		defaults: {
			first_name,
			last_name
		}
	})
	.then( result => {
		//findOrCreate devuelve un array, el primer elemento es el usuario. El segundo es un booleano
		const user = result[0];
		const userData = { 
			user: {
				user_id : user.user_id,
				first_name : user.first_name,
				last_name : user.last_name,
				role : user.role,
				email : email
			}
		}
		//Creamos el token pasándole la información del usuario y el ACCESS_TOKEN_SECRET declarado en .env
		const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '90m' });
		return res.status(200).json({
				accessToken , 
				user : {
					user_id : user.user_id,
					first_name : user.first_name,					
					last_name : user.last_name,
					role : user.role,
					email : email }
				})
	})
	.catch(err => console.log('error en /auth/externalLogin:', err));

})


server.post("/login",( req, res, next ) => {

	//authenticate with email
	const email = req.body.email
	const password = req.body.password
	
	//buscamos usuario con ese email
	User.findOne({
		where:{ email }
	})
	.then(user => {
		//si no encontramos el email devolvemos error
		if(!user) return res.json({error: 'Esta dirección de correo no se encuentra registrada'})
		// si lo encontramos, controlamos que la contraseñas sean iguales
		checkPassword(user,password)
		.then( match => {
			if(match){//si lo son, devolvemos token
				//No guardamos la password en el token
				const userData = { user: {
					user_id : user.user_id,
					first_name : user.first_name,
					last_name : user.last_name,
					role : user.role,
					email : email
				} }
				//Creamos el token pasándole la información del usuario y el ACCESS_TOKEN_SECRET declarado en .env
				const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '90m' });

				//Mandamos al front la info del usuario y el token
				return res.status(200).json({accessToken , user : {
					user_id : user.user_id,
					first_name : user.first_name,					
					last_name : user.last_name,
					role : user.role,
					email : email
				}})
			}else{
				//si no, mandamos error
				res.json({accessToken : null, error: 'Contraseña incorrecta'})
			}
		})

		

	})
	.catch((err) => res.status(400).json({error:"ERROR!!!!!!!!!!!!!!"}))
	

});

server.post('/logout', ()=>{});



function authenticateToken(req,res,next){
	//console.log(req.headers)
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if ( token == null) return res.sendStatus(401)
	jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, user) =>{
		if(err) return res.sendStatus(403);
		res.send(user);
	})
	

}

//		/auth/me
//Devuelve el usuario que está logeado
server.get('/me', authenticateToken)

//Promover un usuario a admin
server.post('/promote/:user_id', checkIsAdmin, (req, res) => {
	const { user_id } = req.params;

	User.update({
		role: 'admin'
	}, {
		where: {
			user_id
		}
	})
	.then(() => res.send('Este usuario ahora es admin!'))
	.catch(err => res.send(err));
});

module.exports = server;