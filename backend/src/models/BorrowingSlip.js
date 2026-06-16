const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const BorrowingSlip = sequelize.define("BorrowingSlip",{
    MaPhieu:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    NgayLapPhieu:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    MaThanhVien:{ // <--- THÊM TRƯỜNG NÀY VÀO
        type: DataTypes.STRING(20),
    },
    MaNhanVienLap:{
        type: DataTypes.STRING(20),
    },
    MaNhanVienThu:{
        type: DataTypes.STRING(20),
    }
},{
    tableName: "PhieuMuon",
    timestamps: false
});

module.exports = BorrowingSlip;