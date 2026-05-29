const express = require('express');
require('dotenv').config();

// Nhúng file kết nối database
const sequelize = require('./src/config/database');

// Khởi tạo ứng dụng Express
const app = express();

// --- MIDDLEWARE CƠ BẢN ---
// Giúp Server đọc được dữ liệu JSON (ví dụ: tài khoản, mật khẩu) mà người dùng gửi lên
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- KIỂM TRA KẾT NỐI DATABASE ---
sequelize.authenticate()
    .then(() => {
        console.log('✅ TUYỆT VỜI! Đã kết nối thành công với SQL Server!');
    })
    .catch((err) => {
        console.error('❌ LỖI KẾT NỐI DATABASE:', err.message);
    });

// --- ROUTES (CÁC API CỦA DỰ ÁN) ---
// Tạo một API thử nghiệm trên web
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với API Hệ thống Quản lý Thư viện!');
});

// (Sau này chúng ta sẽ nhúng các file routes thực tế vào đây)
// app.use('/api/auth', require('./src/routes/auth'));
// app.use('/api/books', require('./src/routes/books'));


// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Node.js đang chạy tại cổng ${PORT}`);
    console.log(`👉 Hãy mở trình duyệt và truy cập vào: http://localhost:${PORT}`);
});