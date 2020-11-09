const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Review', {
    review_id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:1,
            max:5,
        }
    },
    description:{
    type:DataTypes.TEXT,
    allowNull:true,
    }
  });
};
