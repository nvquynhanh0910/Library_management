const {DataTypes} = require("sequelize");
const { sequelize } = require("../config/database");

const WritingBook = sequelize.define("WritingBook",{
    MaDauSach:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    MaTacGia:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    }
},{
    tableName:"VietSach",
    timestamps: false
});

module.exports = WritingBook;