const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('image', {
        img_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        img_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });
}