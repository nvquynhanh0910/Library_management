const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const BookTitle = sequelize.define("BookTitle",{
    MaDauSach:{
        type: DataTypes.STRING(100),
        primaryKey:true,
    },
    TenSach:{
        type: DataTypes.STRING(100),
        allowNull:false,
    },
    NamXB:{
        type: DataTypes.INTEGER,
    },
    NoiDung:{
        type: DataTypes.TEXT,
    },
    MaTheLoai:{
        type: DataTypes.STRING(20),
    },
    MaNXB:{
        type: DataTypes.STRING(20),
    }
},{
        tableName:"DauSach",
        timestamps: false
});

module.exports = BookTitle;