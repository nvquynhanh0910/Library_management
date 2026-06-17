const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    MaNhanVien: { type: DataTypes.STRING(20), primaryKey: true },
    TenNhanVien: { type: DataTypes.STRING(100), allowNull: false },
    ChucVu: { type: DataTypes.STRING(50) },
    Username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    Password: { type: DataTypes.STRING(255), allowNull: false }
}, {
    tableName: 'NhanVien',
    timestamps: false
});

module.exports = User;