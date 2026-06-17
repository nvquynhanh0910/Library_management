const{DataTypes} = require("sequelize");
const{sequelize} = require("../config/database");

const PunishmentSlip = sequelize.define("PunishmentSlip",{
    MaPhieuPhat:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    NgayLapPhieu:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    TrangThaiThanhToan:{
        type: DataTypes.STRING(50),
    },
    TongTienPhat:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    TenHinhPhat:{
        type: DataTypes.STRING(100),
    },
    MaPhieu:{
        type: DataTypes.STRING(20),
    },
    MaCuonSach:{
        type: DataTypes.STRING(20),
    }
},{
    tableName:"PhieuPhat",
    timestamps: false
});

module.exports = PunishmentSlip;