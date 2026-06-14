const express = require('express');
const app = express();
const { connectDB } = require('./config/database');
require('dotenv').config();

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

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;