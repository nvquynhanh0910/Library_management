const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
    MaTacGia: { type: DataTypes.STRING(20), primaryKey: true },
    TenTacGia: { type: DataTypes.STRING(100), allowNull: false },
    QuocTich: { type: DataTypes.STRING(50) }
}, {
    tableName: 'TacGia', // Tên bảng trong CSDL
    timestamps: false
});

module.exports = Author;