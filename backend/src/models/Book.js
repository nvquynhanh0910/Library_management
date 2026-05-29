const{DataTypes} = require("sequelize");
const{sequelize} = require("../config/database");

const Book = sequelize.define("Book",{
    MaCuonSach:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    TinhTrang:{
        type: DataTypes.STRING(20),
    },
    MaDauSach:{
        type: DataTypes.STRING(20),
    }
},{
    tableName:"CuonSach",
    timestamps: false
});

module.exports = Book;