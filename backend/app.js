require('dotenv').config(); // phải gọi đầu tiên để đọc file .env
const express = require('express');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();           // kết nối DB trước
  app.listen(PORT, () => {
    console.log(`\n🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📖 API docs: http://localhost:${PORT}/\n`);
  });
};

startServer();