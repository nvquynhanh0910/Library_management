const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST,
    port:    parseInt(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Kết nối SQL Server thành công!')
    await sequelize.sync({ alter: true })
    console.log('Đồng bộ bảng hoàn tất!')
  } catch (error) {
    console.error('Kết nối thất bại:', error.message)
    process.exit(1)
  }
}

connectDB();
module.exports = { sequelize, connectDB }