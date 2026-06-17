const {sequelize} = require('../config/database');

const Category = require('./Category');
const Author = require('./Author');
const Publisher = require('./Publisher');
const Member = require('./Member');
const User = require('./User');
const PenaltyRule = require('./PenaltyRule');
const Book = require('./Book');
const BookTitle = require('./BookTitle');
const WritingBook = require('./WritingBook');
const Borrowing = require('./Borrowing');
const BorrowingSlip = require('./BorrowingSlip');
const PunishmentSlip = require('./PunishmentSlip');

// --- THIẾT LẬP QUAN HỆ (FOREIGN KEYS) ---

//Tac gia - Viet sach (n-n)
Author.hasMany(WritingBook,{ foreignKey: 'MaTacGia'});
WritingBook.belongsTo(Author,{ foreignKey: 'MaTacGia'});

BookTitle.hasMany(WritingBook,{ foreignKey: 'MaDauSach'});
WritingBook.belongsTo(BookTitle,{ foreignKey: 'MaDauSach'});

BookTitle.hasMany(Book,{foreignKey:'MaDauSach'});
Book.belongsTo(BookTitle,{foreignKey:'MaDauSach'});

Publisher.hasMany(BookTitle,{foreignKey:'MaNXB'});
BookTitle.belongsTo(Publisher,{foreignKey:'MaNXB'});

Category.hasMany(BookTitle, { foreignKey: 'MaTheLoai' });
BookTitle.belongsTo(Category, { foreignKey: 'MaTheLoai' });

BorrowingSlip.hasMany(Borrowing, { foreignKey: 'MaPhieu' });
Borrowing.belongsTo(BorrowingSlip, { foreignKey: 'MaPhieu' });

Book.hasMany(Borrowing, { foreignKey: 'MaCuonSach' });
Borrowing.belongsTo(Book, { foreignKey: 'MaCuonSach' });

Member.hasMany(BorrowingSlip,{foreignKey:'MaThanhVien'});
BorrowingSlip.belongsTo(Member,{foreignKey:'MaThanhVien'});

User.hasMany(BorrowingSlip, { foreignKey: 'MaNhanVienLap', as: 'NguoiLap' });
BorrowingSlip.belongsTo(User, { foreignKey: 'MaNhanVienLap', as: 'NguoiLap' });

User.hasMany(BorrowingSlip, { foreignKey: 'MaNhanVienThu', as: 'NguoiThu' });
BorrowingSlip.belongsTo(User, { foreignKey: 'MaNhanVienThu', as: 'NguoiThu' });

PenaltyRule.hasMany(PunishmentSlip, { foreignKey: 'TenHinhPhat' });
PunishmentSlip.belongsTo(PenaltyRule, { foreignKey: 'TenHinhPhat' });

BorrowingSlip.hasMany(PunishmentSlip, { foreignKey: 'MaPhieu' });
PunishmentSlip.belongsTo(BorrowingSlip, { foreignKey: 'MaPhieu' });

module.exports = {
    sequelize, Category, Author, Publisher, Member, User, PenaltyRule, 
    Book, WritingBook, BookTitle, Borrowing, BorrowingSlip, PunishmentSlip
};