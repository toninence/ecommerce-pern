const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // modelo categories
  sequelize.define('categories', {
    category_id :{
      allowNull : false,
      autoIncrement : true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    }
    
  });
};
