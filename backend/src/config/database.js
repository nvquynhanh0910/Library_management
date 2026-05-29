const { Sequelize } = require('sequelize');
require('dotenv').config(); // Để đọc được các biến từ file .env

const sequelize = new Sequelize(
    process.env.DB_NAME,  // Tên database (QuanLyThuVien)
    process.env.DB_USER,  // Tài khoản (sa)
    process.env.DB_PASS,  // Mật khẩu (123456)
    {
        host: process.env.DB_HOST, // Lập trình trên máy cục bộ (localhost)
        dialect: 'mssql',          // Bắt buộc phải khai báo là mssql khi dùng SQL Server
        logging: false,            // Ẩn các câu lệnh SQL thuần chạy ngầm trong Terminal cho đỡ rối mắt
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true // Dòng này cực kỳ quan trọng để bỏ qua lỗi chứng chỉ bảo mật trên máy cá nhân
            }
        }
    }
);

// Xuất biến kết nối này ra để các file khác (như app.js, các file Models) có thể sử dụng
module.exports = sequelize; 