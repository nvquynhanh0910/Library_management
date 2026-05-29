const sequelize = require('../config/database');

const Category = require('./Category');
const Author = require('./Author');
const Publisher = require('./Publisher');
const Member = require('./Member');
const User = require('./User');
const PenaltyRule = require('./PenaltyRule');
const Book = require('./Book');
const BookAuthor = require('./BookAuthor');
const BookCopy = require('./BookCopy');
const Borrowing = require('./Borrowing');
const BorrowingDetail = require('./BorrowingDetail');
const PenaltyTicket = require('./PenaltyTicket');

// --- THIẾT LẬP QUAN HỆ (FOREIGN KEYS) ---

// 1. Thể loại, NXB -> Đầu sách (1-N)
Category.hasMany(Book, { foreignKey: 'MaTheLoai' });
Book.belongsTo(Category, { foreignKey: 'MaTheLoai' });

Publisher.hasMany(Book, { foreignKey: 'MaNXB' });
Book.belongsTo(Publisher, { foreignKey: 'MaNXB' });

// 2. Tác giả <-> Đầu sách (N-N qua bảng VietSach)
Author.belongsToMany(Book, { through: BookAuthor, foreignKey: 'MaTacGia' });
Book.belongsToMany(Author, { through: BookAuthor, foreignKey: 'MaDauSach' });

// 3. Đầu sách -> Cuốn sách (1-N)
Book.hasMany(BookCopy, { foreignKey: 'MaDauSach' });
BookCopy.belongsTo(Book, { foreignKey: 'MaDauSach' });

// 4. Độc giả -> Phiếu mượn (1-N)
Member.hasMany(Borrowing, { foreignKey: 'MaThanhVien' });
Borrowing.belongsTo(Member, { foreignKey: 'MaThanhVien' });

// 5. Nhân viên -> Phiếu mượn (1-N)
User.hasMany(Borrowing, { foreignKey: 'MaNhanVienLap', as: 'NguoiLap' });
Borrowing.belongsTo(User, { foreignKey: 'MaNhanVienLap', as: 'NguoiLap' });

User.hasMany(Borrowing, { foreignKey: 'MaNhanVienThu', as: 'NguoiThu' });
Borrowing.belongsTo(User, { foreignKey: 'MaNhanVienThu', as: 'NguoiThu' });

// 6. Phiếu mượn <-> Cuốn sách (N-N qua bảng MuonSach)
Borrowing.belongsToMany(BookCopy, { through: BorrowingDetail, foreignKey: 'MaPhieu' });
BookCopy.belongsToMany(Borrowing, { through: BorrowingDetail, foreignKey: 'MaCuonSach' });

// 7. Phiếu mượn -> Phiếu phạt (1-N)
Borrowing.hasMany(PenaltyTicket, { foreignKey: 'MaPhieu' });
PenaltyTicket.belongsTo(Borrowing, { foreignKey: 'MaPhieu' });

// 8. Hình phạt -> Phiếu phạt (1-N)
PenaltyRule.hasMany(PenaltyTicket, { foreignKey: 'TenHinhPhat' });
PenaltyTicket.belongsTo(PenaltyRule, { foreignKey: 'TenHinhPhat' });

module.exports = {
    sequelize, Category, Author, Publisher, Member, User, PenaltyRule, 
    Book, BookAuthor, BookCopy, Borrowing, BorrowingDetail, PenaltyTicket
};