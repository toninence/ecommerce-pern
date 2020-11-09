const server = require('express').Router()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')


const { LineaDeOrden, Order, Product, User,Image} = require('../db.js')
//Middlewares de checkeo de usuario
const { checkIsAdmin } = require('../utils')
server.use(bodyParser.json());


//Ruta que devuelve todas las ordenes y, en caso de tener query string Status, trae todas las ordenes con ése estado  /orders
server.get('/', checkIsAdmin, function(req,res){
    const {status} = req.query    

    if(status){
        if(status !== 'Carrito' && status !== 'Creada' && status !== 'Procesando' && status !== 'Cancelada' && status !== 'Completa'){
            res.status(404).send('No es un estado válido')
        }

        Order.findAll({
            include:[{ model: User}],
            where:{
                state:status
            }
        })
        .then(response =>{ res.status(200).send(response)})
        .catch(err => res.status(404).send(err,'No hay ordenes en éste estado'))

    }else{

        Order.findAll({include:[{ model: User}]})
        .then(response => {res.status(200).send(response)})
        .catch(err => res.status(404).send(err))

    }
});

//Traer una orden en particular según order_id, pasada por params       /orders/:order_id
server.get('/:order_id', function(req, res){
    const { order_id } = req.params;

    Order.findOne({
        where:{
            order_id
        },
        include: [{model: Product, as:'products',include:[{model:Image}]}, { model: User}]
    })
    .then(order => {
        res.status(200).send(order);  
    })
    .catch(error => {
        res.status(400).send(error);
    })
})

// Actualizar el estado de una orden     /orders/order_id
// Front envia orden_id por params y state por body

server.put('/:order_id', (req, res) => {
    const {order_id} = req.params;
    const {state} = req.body;
    // console.log('status', state)
    if(state !== 'Carrito' && state !== 'Creada' && state !== 'Procesando' && state !== 'Cancelada' && state !== 'Completa'){
        res.status(404).send('No es un estado válido')
    }
    Order.update({
        state
    }, {where: {
        order_id
    }})
    .then((response)=>{
        res.status(200).send("Estado actualizado")
    })
    .catch((error)=>{
        res.status(404).send(error)
    })
})

//Traer el precio total de una orden en particular
server.get('/:order_id/totalprice', (req, res) => {
    const { order_id } = req.params;

    LineaDeOrden.findAll({
        where:{
            order_id
        }
    })
    .then(ldo => ldo.reduce((acc, curr)=> acc + curr.price, 0))
    .then(total_price => res.send({total_price}))
    .catch(error => res.status(400).send(error));
});


server.get('/table/:order_id/', checkIsAdmin, function(req, res){
    const { order_id } = req.params;

    Order.findAll({
        where:{
            order_id
        },
        include: [{model: Product, as:'products'}, { model: User}]
    })
    .then(order => {
        res.status(200).send(order);  
    })
    .catch(error => {
        res.status(400).send(error);
    })
})

server.post('/finished',(req,res)=>{

  const {email,order_id,firstName,lastName,address,depto,products,phone,discount,status,noTotal} = req.body

  const PrecioTotal = (products)=>{
    
    let precioFinal = 0

    products.map((product)=>{
        precioFinal += product.price*product.LineaDeOrden.quantity
    })

    if(discount){return precioFinal*0.8}

    return precioFinal
  }


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
      subject:`Su pedido número ${order_id} pasó a estado: ${status?status:'Procesando'}`,
      html:`
      <html>

      <body style="background-color:white;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
        <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px yellow;">
          <thead style="display:flex;justify-content:center;position:relative;left:50%">
          <tr style="margin:auto;display:flex;align-content:center;align-items:center;justify-content:center;position:relative;left:50%">
              <th style="text-align:center; border-bottom: 4px solid black; border-top: 4px solid black;padding:10px;"><img style="max-width: 150px;" src="https://i.ibb.co/pjgz9WD/LOGO.png" alt="bachana tours"></th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td style="height:35px;"></td>
            </tr>
            <tr>
              <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
                <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Estado de tu orden</span><b style="color:green;font-weight:normal;margin:0">${status?status:'Procesando'}</b></p>
                <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">ID de tu orden</span> ${order_id}</p>
                <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">${noTotal!=true?'Precio final':''}</span>${noTotal!==true?'$':''}${
                  noTotal!==true?PrecioTotal(products).toFixed(2):''
                }</p>
              </td>
            </tr>
            <tr>
              <td style="height:35px;"></td>
            </tr>
            <tr>
              <td style="width:50%;padding:20px;vertical-align:top">
                <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">Nombre</span>${firstName}</p>
                <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Correo eletrónico</span>${email}</p>
                
              </td>
              <td style="width:50%;padding:20px;vertical-align:top">
                <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Dirección</span>${address} ${depto?depto:""}</p>
                <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Teléfono de contacto</span>${phone}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Productos</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:15px;">
                  ${products.map((product)=>{

                      return`<div style="display:flex;font-size:14px;padding:10px;border:solid 1px black">
                       
                      <div style="margin:auto 10px">
                        <p style="margin:0;padding:0;font-weight:bold">${product.name}</p>
                        <p style="margin:0;padding:0;font-size:10px">${product.description.substr(0,100)}...</p>
                      </div>
                        
                      <div style="margin:auto 0px auto auto;">
                        <p style="margin:0;padding:0;font-size:13px;font-weight:bold">$${product.price}</p>
                        <p style="text-align:end;margin:0;padding:0;font-size:13px">x${product.LineaDeOrden.quantity}</p>
                      </div>
                      
                    </div>`
                      
                      

                  })}
              </td>
            </tr>
          </tbody>
          <tfooter>
            <tr>
              <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                <strong style="display:block;margin:0 0 10px 0;">Muchas gracias por tu compra</strong>Henryware<br><p style="font-weight:bold">HIGH EARNERS NOT RICH YET</p><br>
                <b>Correo electrónico:</b> ehenryware@gmail.com
              </td>
            </tr>
          </tfooter>
        </table>
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

module.exports = server;