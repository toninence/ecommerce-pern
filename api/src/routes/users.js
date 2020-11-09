require ( 'dotenv' ).config();
const server = require('express').Router()
const { json } = require('body-parser');
const bodyParser = require('body-parser')
const { User, Order, LineaDeOrden, Product, Image, wishlist } = require('../db.js')
const nodemailer = require ('nodemailer');
const jwt = require('jsonwebtoken');
//Middlewares de checkeo de usuario
const { checkIsAdmin } = require('../utils.js')

server.use(bodyParser.json());


//Ruta para obtener todos los usuarios  /users

server.get('/', checkIsAdmin, function(req,res){
    User.findAll({}).then(response => res.status(200).send(response))
})

//Ruta para crear un usuario    /users    NV.
server.post('/',(req, res) => {
  
    const { email, first_name, last_name, address, phone_number, role, password }= req.body;

    //Checkeo password
    if(password.length < 8) return res.status(400).send({error: 'La contraseña debe tener al menos 8 caracteres'});

    //Checkeo email
    if(email.length < 10) return res.status(400).send({error: 'La dirección de email no es válida'});

    //Checkeo que el email sea un email válido con regex
    const emailCheck = new RegExp(/^([a-zA-Z0-9-.]+)@([a-zA-Z0-9-.]+)\.([a-zA-Z]{2,3})$/);
    if (!emailCheck.test(email)) return res.status(400).send({error: 'La dirección de email no es válida'});
    
    //Checkeo número de teléfono
    if(phone_number.length < 5 || phone_number.length > 25) return res.status(400).send({error: 'El número de teléfono debe tener entre 5 y 25 dígitos'})

    User.create({
        email, 
        first_name, 
        last_name, 
        address, 
        phone_number, 
        role,
        password
    })
    .then((usuario) => {
        res.status(201).send({status: 201, message: usuario})        
    })
    .catch((error) => {
        res.status(400).send({status: 400, message: error, errorMail: 'Esta dirección de mail ya se encuentra registrada'})
    })
})

//Ruta para modificar información de un usuario (que no sea password)     /users/:user_id
server.put('/:user_id', function(req, res){
    const user_id = req.params.user_id;

    //Array con todas las keys que contenga req.body
    const reqBody_props = Object.keys(req.body);

    //Objeto que voy a llenar con las propiedades que estén presentes en req.body que
    //sean relevantes para modificar el usuario
    var newInfo = {};
    reqBody_props.forEach(p => {
        switch(p){
            case 'email':
                newInfo.email = req.body.email;
                break;
            case 'first_name':
                newInfo.first_name = req.body.first_name;
                break;
            case 'last_name':
                newInfo.last_name = req.body.last_name;
                break;
            case 'address':
                newInfo.address = req.body.address;
                break;
            case 'phone_number':
                newInfo.phone_number = req.body.phone_number;
                break;
            case 'role':
                newInfo.role = req.body.role;
                break;
            case 'avatar':
                newInfo.avatar = req.body.avatar;
                break;
        }
    });

    //Actualizo el usuario con el id correcto, pasándole newInfo
    User.update(newInfo, { where: { user_id } })
    .then( () => res.status(200).send(`La información de usuario fue actualizada con éxito!`))
    .catch( err => res.status(400).send(err));
})

//Ruta para cambiar contraseña
server.put('/:user_id/password-reset', (req, res) => {
    const { user_id } = req.params;

    const {newPassword} = req.body;

    User.update({
        password: newPassword
    }, {
        where: {
            user_id
        }
    })
    .then(()=>res.sendStatus(200))
    .catch(err => console.log(err));
})


// users/:id   ruta para eliminar usuario            NV.

server.delete('/:id', checkIsAdmin, (req, res)=>{
    User.destroy({
        where: {
            user_id: req.params.id
        }
    })
    .then(()=>{
        res.status(200).send("User deleted!")
    })
    .catch((error) => {
        res.status(404).send(error)
    })
});

// /users/usersID/email={email} Ruta que trae el id de un usuario en particular pasado por email

server.get('/usersID/',(req,res) => {
    const {email} = req.query;
    
    User.findAll({
        where: {
           email 
        }
    }).then( user =>{
        var obj = {
            id : user[0].dataValues.user_id, 
            name : user[0].dataValues.first_name
        }
        res.status(200).json(obj)
    }).catch(() => res.status(200).json({
        id : "Usuario no encontrado",
        name : "Guest"
    }))
})

// users/:id   ruta para traer un usuario por ID            NV.

server.get('/:id', (req, res)=>{
    User.findOne({
        where: {
            user_id: req.params.id
        }
    })
    .then((user)=>{
        res.status(200).json(user)
    })
    .catch((error) => {
        res.status(404).send(error)
    })
});



//-----------------------CARRITO---------------------------------------------------------------------

//Agregar producto al carrito de un usuario en particular       /users/:user_id/cart
server.post('/:user_id/cart', function(req,res){

    // console.log(req.body);
    const {user_id} = req.params;
    const { product_id, quantity, price } = req.body;

    Order.findOrCreate({
        where:{
            user_id,
            state: 'Carrito'
        }
    })
    .then(ord => {
        //findOrCreate devuelve un array [objeto, booleano]
        //Si el registro ya existía y no se creó nada nuevo, el booleano es false.
        const order_id = ord[0].order_id;
        return LineaDeOrden.create({
            product_id,
            order_id,
            quantity,
            price
        });
    })
    .then((l)=>{
        res.status(200).send(l)
    })

    .catch(err=>{
        res.status(400).send(err)})
    
});

//Traer todos los items del carrito de un usuario en particular         /users/:user_id/cart
server.get('/:user_id/cart', (req, res) => {
    const { user_id } = req.params;

    Order.findOne({
        where: {
            user_id,
            state: 'Carrito'
        },
        include:[{model:Product, as: 'products',include:[{model:Image}]}]
    })
    .then((items) => {
        res.status(200).send(items)
    })
    .catch((error) => {
        res.status(404).send(error)

    })
});

//Cambiar cantidad de un determinado producto(product_id) en el carrito de un determinado usuario(user_id) /users/user_id/cart
server.put('/:user_id/cart', function(req, res){
    //El front tiene que mandar por params el user_id, y por body el product_id y la cantidad deseada
    const { user_id } = req.params;
    const { product_id, quantity } = req.body;

    Order.findOne({
        where:{
            user_id,
            state: 'Carrito'
        }
    })
    .then(order => {
        //Busco la línea de orden relacionada al product_id que recibimos por body y al order_id que recibimos por params
        return LineaDeOrden.findOne({
            where:{
                order_id: order.order_id,
                product_id
            }
        });
    })
    .then(response=>{
        //findOne devuelve una referencia directa al registro que encontró
        //por ende con un .update actualizamos el atributo que queremos, y listo!
        return response.update({
            quantity
        });
    })
    .then(() => {
        res.status(200).json({product_id, quantity});
    })
})

/* Ruta para eliminar un producto del carrito */
server.delete('/:user_id/deletecartproduct', (req, res) => {
    const { user_id } = req.params;
    const { product_id } = req.body;
    
    Order.findOne({        
        where: {
            user_id: user_id,            
            state: 'Carrito'
        }
    })
    .then( orden =>        
        LineaDeOrden.destroy({
            where: {
                order_id: orden.order_id,
                product_id: product_id,
            }
        })
    )
    .then( eliminado =>
        res.send( {eliminado: eliminado, status: 200} )
    )
    .catch((error)=>{
        res.send(error)
    })    
})

//Ruta para vaciar el carrito de determinado usuario pasado por paramas user_id /users/user_id/cart

server.delete('/:user_id/cart', (req, res) => {
    const { user_id } = req.params;
    
    Order.findOne({
        where: {
            user_id: user_id,
            state: 'Carrito'
        }
    })
    .then((orden)=>{
        return LineaDeOrden.findAll({
            where: {
                order_id: orden.order_id
            }
        })
    })
    //  Iteramos sobre la linea de orden y eliminamos 
    .then((relation)=>{
        relation.forEach(element => {
           element.destroy() 
        });
        
    })
    .then(()=>{
        res.send("Eliminado")
    })
    .catch((error)=>{
        res.send(error)
    })
    
})


// Ruta que trae todas las ordenes de un usuario en particular (Por ID (params) )    /users/iduser/orders
server.get('/:user_id/orders', function(req,res){

    const {user_id} = req.params

    Order.findAll({
        where:{
            user_id
        },
        include: [{model: Product, as:'products'}, { model: User}]
    })
    .then(response => res.status(200).send(response))
    .catch(err => res.status(404).send(err))

})


//Ruta para mandar mail (REESTABLECER CONTRASEÑA)


server.post('/forgotpassword',(req,res)=>{
    const {email} = req.body
    
    User.findOne({
        where:{
            email:email
        }
    }).then(response=>{
        if(response == null) return res.send('Este correo electrónico no está registrado!');
        //Encontró el usuario con ese mail
        
        const tokenID = response.dataValues.user_id;

        const passResetToken = jwt.sign({tokenID}, 'process.env.ACCESS_TOKEN_SECRET', {expiresIn: '3m'});

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth:{
                user:"ehenryware@gmail.com",
                pass:"henry10ware",
            }
        });
      
        let mailOptions = {
            from:"ehenryware@gmail.com",
            to: `${email}`,
            subject:"Reestablece tu contraseña!",
            html:`
                <html>
                
                <head>
                <style type="text/css">
                            @font-face {
                              font-family: &#x27;Postmates Std&#x27;;
                              font-weight: 600;
                              font-style: normal;
                              src: local(&#x27;Postmates Std Bold&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-bold.woff) format(&#x27;woff&#x27;);
                            }
                
                            @font-face {
                              font-family: &#x27;Postmates Std&#x27;;
                              font-weight: 500;
                              font-style: normal;
                              src: local(&#x27;Postmates Std Medium&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-medium.woff) format(&#x27;woff&#x27;);
                            }
                
                            @font-face {
                              font-family: &#x27;Postmates Std&#x27;;
                              font-weight: 400;
                              font-style: normal;
                              src: local(&#x27;Postmates Std Regular&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-regular.woff) format(&#x27;woff&#x27;);
                            }
                        </style>
                <style media="screen and (max-width: 680px)">
                            @media screen and (max-width: 680px) {
                                .page-center {
                                  padding-left: 0 !important;
                                  padding-right: 0 !important;
                                }
                                
                                .footer-center {
                                  padding-left: 20px !important;
                                  padding-right: 20px !important;
                                }
                            }
                        </style>
                </head>
                <body style="background-color: #f4f4f5;">
                <table cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
                <tbody><tr>
                <td style="text-align: center;">
                <table align="center" cellpadding="0" cellspacing="0" id="body" style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
                <tbody><tr>
                <td>
                <table align="center" cellpadding="0" cellspacing="0" class="page-center" style="text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;">
                <tbody><tr>
                <td style="padding-top: 24px;text-align:center">
                <img src="https://i.ibb.co/pjgz9WD/LOGO.png" style="width: 100px;margin:0 auto;">
                </td>
                </tr>
                <tr>
                <td colspan="2" style="padding-top: 72px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;text-align:center">Reestablecé tu contraseña</td>
                </tr>
                <tr>
                <td style="padding-top: 48px; padding-bottom: 48px;">
                <table cellpadding="0" cellspacing="0" style="width: 100%">
                <tbody><tr>
                <td style="width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81"></td>
                </tr>
                </tbody></table>
                </td>
                </tr>
                <tr>
                <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;text-align:center">
                                                      Este mail fue enviado porque solicitaste un cambio de contraseña en nuestra página. Si no fuiste vos, ignoralo!
                                                    </td>
                </tr>
                <tr>
                <td style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;text-align:center">
                                                     Toca el siguiente botón y te llevará a nuestra web, donde podrás definir una nueva contraseña
                                                    </td>
                </tr>
                <tr>
                <td>
                <a data-click-track-id="37" href="http://localhost:3000/passwordreset/${tokenID}/${passResetToken}" style="margin:36px auto ;-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: yellow; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: black; border-radius: 28px; display: block; text-align: center; text-transform: uppercase" target="_blank">
                                                        Reestablecer contraseña
                                                      </a>
                </td>
                </tr>
                </tbody></table>
                </td>
                </tr>
                
                </body>

                </html>

            `
            
            }
      
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                res.status(500).send(error.message)
            }else{
                // console.log("Email enviado.")
                res.status(200).json(req.body)
            }
      
        })
      })
});
  
//Agregar producto a la wishlist de un usuario
server.post('/:user_id/wishlist', (req, res) => {
    const { user_id } = req.params;
    const { product_id } = req.body;

    wishlist.create({
        user_id,
        product_id
    })
    //Envío como respuesta la wishlist actualizada
    .then(()=>Product.findAll({
        include: [
            {
                model: User,
                as: 'product_wishlist',
                where: {
                    user_id
                },
                attributes: ['user_id']
            },
            {
                model: Image
            }
        ]
        })
    )
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

//Eliminar producto de la wishlist de un usuario
server.delete('/:user_id/wishlist', (req, res) => {
    const { user_id } = req.params;
    const { product_id } = req.body;

    wishlist.destroy({
        where: {
            user_id,
            product_id
        }
    })
    //Lo elimino y acto seguido envío como respuesta la wishlist actualizada
    .then(() => Product.findAll({
        include: [
            {
                model: User,
                as: 'product_wishlist',
                where: {
                    user_id
                },
                attributes: ['user_id']
            },
            {
                model: Image
            }
        ]
        })
    )
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));

})

//Traer la wishlist de un usuario
server.get('/:user_id/wishlist', (req, res) => {
    const { user_id } = req.params;
    //traemos todos los productos asociados al usuario que nos pasan por params
    Product.findAll({
        include: [
            {
                model: User,
                as: 'product_wishlist',
                where: {
                    user_id
                },
                attributes: ['user_id']
            },
            {
                model: Image
            }
        ]
    })
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
})
    


module.exports = server;