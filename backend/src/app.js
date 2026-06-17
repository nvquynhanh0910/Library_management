const express = require('express');
const app = express();
const { connectDB } = require('./config/database');
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173',  // địa chỉ frontend Vite
    credentials: true
}));
app.use(express.json());

// ===== ROUTES =====
app.use('/api/auth',              require('./routes/auth'));
app.use('/api/authors',           require('./routes/author'));
app.use('/api/publishers',        require('./routes/publisher'));
app.use('/api/categories',        require('./routes/category'));
app.use('/api/members',           require('./routes/member'));
app.use('/api/penalty-rules',     require('./routes/penaltyRule'));
app.use('/api/book-titles',       require('./routes/bookTitle'));
app.use('/api/book-titles',       require('./routes/book'));        // /api/book-titles/:id/copies
app.use('/api/borrowing-slips',   require('./routes/borrowingSlip'));
app.use('/api/borrowings',        require('./routes/borrowing'));
app.use('/api/punishment-slips',  require('./routes/punishmentSlip'));
app.use('/api/dashboard',         require('./routes/dashboard'));
app.use('/api/users',             require('./routes/user'));

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;