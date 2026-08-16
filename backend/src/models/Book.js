const{DataTypes} = require("sequelize");
const{sequelize} = require("../config/database");

const Book = sequelize.define("Book",{
    MaCuonSach:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    TinhTrang: {
        type: DataTypes.STRING(50),
        defaultValue: 'Sẵn sàng'
    },
    ChatLuong: {
        type: DataTypes.STRING(20),
        defaultValue: 'Mới',
        validate: {
            isIn: [['Mới', 'Cũ']]
        }
    },
    MaDauSach:{
        type: DataTypes.STRING(100),
    }
},{
    tableName:"CuonSach",
    timestamps: false
});

module.exports = Book;