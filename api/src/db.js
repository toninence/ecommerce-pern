require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/development`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

sequelize.authenticate()
 .then(() => {
     console.log('Connection is OK.')
 })
 .catch((error) => {
     console.log('Fail to connect to the database.', error);
 });

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product, User, Categories, Order, LineaDeOrden, Image, Review} = sequelize.models;




// Relaciones:

//Producto-Categoría M:M
//product_category es la tabla intermedia
Product.belongsToMany(Categories, {
  through:'product_category',
  as:"categories",
  foreignKey:'product_id'
});
Categories.belongsToMany(Product, {
  through:'product_category',
  as:"products",
  foreignKey:'category_id'
});

//User-Order 1:M
//añade el foreign key user_id al modelo de Order
User.hasMany(Order, {
  foreignKey: 'user_id'
});
Order.belongsTo(User, {
  foreignKey: 'user_id'
});

//Producto-Order M:M
//Utiliza Línea de Orden como tabla intermedia
Product.belongsToMany(Order, {
  through: LineaDeOrden,
  as: 'orders',
  foreignKey:'product_id'
});
Order.belongsToMany(Product, {
  through: LineaDeOrden,
  as: 'products',
  foreignKey:'order_id'
});

//Producto-Imagen 1:M
//añade el foreign key product_id al modelo de Images
Product.hasMany(Image, {
  foreignKey: 'product_id'
});
Image.belongsTo(Product, {
  foreignKey: 'product_id'
});


//Producto-review 1:M
Product.hasMany(Review,{
  foreignKey: 'product_id'
})

Review.belongsTo(Product,{
  foreignKey:'product_id'
})

//User-review 1:M
User.hasMany(Review,{
  foreignKey: 'user_id'
})

Review.belongsTo(User,{
  foreignKey:'user_id'
})

//User-Product M:M
//(WISHLIST)
User.belongsToMany(Product, {
  through: 'wishlist',
  as: 'user',
  foreignKey: 'user_id'
});
Product.belongsToMany(User, {
  through: 'wishlist',
  as: 'product_wishlist',
  foreignKey: 'product_id'
});


module.exports = {
  ...sequelize.models,  // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  };