const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Member = sequelize.define('Member', {
    MaThanhVien: { type: DataTypes.STRING(20), primaryKey: true },
    HoTen: { type: DataTypes.STRING(100), allowNull: false },
    Email: { type: DataTypes.STRING(100) },
    SoDienThoai: { type: DataTypes.STRING(15) },
    MatKhau: { type: DataTypes.STRING(255), allowNull:false}
}, {
    tableName: 'DocGia',
    timestamps: false
});

module.exports = Member;