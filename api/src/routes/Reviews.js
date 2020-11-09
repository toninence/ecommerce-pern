const server = require('express').Router()
const bodyParser = require('body-parser')
const { Review, Product, User } = require('../db.js')

server.use(bodyParser.json());


//Ruta que devuelve todas las Reviews
server.get('/:product_id',function( req, res ){
    const { product_id } = req.params
    Review.findAll({
        
        where: {
            product_id
        },
        include: [{model:User}]
    })
    .then( response => {res.status(200).json(response)})
    .catch(err => res.status(404).json(err))
});

//Cargar un rating y descripcion a un producto
server.post('/:product_id',(req, res) => {

    const { product_id } = req.params;
    const { rating, description, user_id } = req.body;

    // console.log(req.body)
    
    Review.create({
        rating,
        description,
        user_id,
        product_id,
    })
    .then((rating) => {
        res.status(201).send({status: 201, message: {
            user_id: rating.user_id,
            product_id: rating.product_id,
            review_id: rating.review_id,
            rating: rating.rating,
            description: rating.description,
        }})        
    })
    .catch((error) => {
        res.status(400).json({status: 400, message: error})
    })
})

//Editar una Review
server.put('/:review_id', (req, res) => {
    const {review_id} = req.params;

    const {rating,description} = req.body

    Review.update({
        rating:rating,
        description:description
    },{
        where:{
            review_id:review_id
        }
    }).then(res.status(200).send('Review modificado')).catch(err => res.status(400).send(err))
    
})

//Eliminar una Review

server.delete('/:review_id',(req,res)=>{
    const {review_id} = req.params

    Review.destroy({
        where:{
            review_id:review_id
        }
    }).then(res.status(200).send('review eliminado')).catch(err=>res.status(400).send(err))
})


module.exports = server;