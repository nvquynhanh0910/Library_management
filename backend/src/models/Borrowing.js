const {DataTypes, STRING} = require("sequelize");
const{sequelize} = require("../config/database");

const Borrowing = sequelize.define("Borrowing",{
    MaPhieu:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    MaCuonSach:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    HinhThucMuon:{
        type: DataTypes.STRING(20),
    },
    HanTra:{
        type: DataTypes.DATE,
        allowNull:false,
    },
    NgayTraThucTe:{
        type: DataTypes.DATE,
    },
    TinhTrangKhiTra:{
        type: DataTypes.STRING(50),
    },
    TienTraPhatSinh:{
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0.00,
    }
},{
    tableName: "MuonSach",
    timestamps: false
});

module.exports = Borrowing;