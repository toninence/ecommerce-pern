const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('product', {
    product_id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    description:{
      type:DataTypes.TEXT,
      allowNull:false,
    },
    rating:{
      type:DataTypes.INTEGER,
      allowNull:true,
      validate:{
        min:1,
        max:5,
      }
    },
    warranty:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    stock:{
      type:DataTypes.INTEGER,
      allowNull:false,
    }
  });
};
