const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publisher = sequelize.define('Publisher', {
    MaNXB: { type: DataTypes.STRING(20), primaryKey: true },
    TenNXB: { type: DataTypes.STRING(100), allowNull: false },
    DiaChi: { type: DataTypes.STRING(255) },
    SoDienThoai: { type: DataTypes.STRING(15) }
}, {
    tableName: 'NhaXuatBan',
    timestamps: false
});

module.exports = Publisher;