const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
const User = (sequelize) => {
  // defino el modelo
  sequelize.define('user', {
    user_id:{
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true,
      unique:true
    },
    email: {
      type: DataTypes.STRING,
      validate: {
          len: {
            args: [4, 70],
            msg: "No es un email valido"
          },
          isEmail: {
            msg: "No es un email valido"
          },
          notNull: {
            msg: 'Email obligatorio'
          }
      },
      unique: true,
      allowNull: false,
      
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: "No es nombre valido"
        },
        notNull: {
          msg: 'Nombre obligatorio'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,      
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          len: {
            args: [5, 25],
            msg: "No es un numero valido"
          },
          isNumeric: true,
          isInt: {
            msg: "No es un numero"
          }
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        validate: {
          len: {
            args: [4, 5],
            msg: "No es un role valido"
          },
        }
    },
   
    avatar : {
      type: DataTypes.TEXT,
      defaultValue : "https://i.ibb.co/x6cBfn9/ASD.png"

    },
    password: {
        type: DataTypes.TEXT,
        allowNull:true,
        set(value){
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        }
    }
  });
};

User.checkPassword = function(password){
  //Retorna una promesa
  return bcrypt.compare(password, this.password);
};

module.exports = User;


























