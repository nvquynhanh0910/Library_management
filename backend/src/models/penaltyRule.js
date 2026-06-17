const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PenaltyRule = sequelize.define('PenaltyRule', {
    TenHinhPhat: { type: DataTypes.STRING(100), primaryKey: true },
    MucPhat: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'HinhPhat',
    timestamps: false
});

module.exports = PenaltyRule;