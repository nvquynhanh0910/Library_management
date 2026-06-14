const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    MaTheLoai: { type: DataTypes.STRING(20), primaryKey: true },
    TenTheLoai: { type: DataTypes.STRING(100), allowNull: false }
}, {
    tableName: 'TheLoai',
    timestamps: false
});

module.exports = Category;