const bcrypt = require('bcryptjs');
const { 
  sequelize, 
  Category, 
  Author, 
  Publisher, 
  Member, 
  User, 
  PenaltyRule, 
  Book, 
  WritingBook, 
  BookTitle 
} = require('./src/models');

async function seed() {
  try {
    console.log('Bắt đầu dọn dẹp dữ liệu cũ (để tránh trùng lặp)...');

    // Xóa theo thứ tự đảo ngược của ràng buộc khóa ngoại
    await WritingBook.destroy({ where: {} });
    await Book.destroy({ where: {} });
    await BookTitle.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await Author.destroy({ where: {} });
    await Publisher.destroy({ where: {} });
    await PenaltyRule.destroy({ where: {} });
    await Member.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('Đã dọn dẹp xong. Bắt đầu chèn dữ liệu seed mới...');

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash('123', 10);

    // 1. NhanVien (User)
    await User.bulkCreate([
      { MaNhanVien: 'NV001', TenNhanVien: 'Nguyễn Thị Trang', ChucVu: 'Thủ thư', Username: 'nhanvien1', Password: hashedPassword },
      { MaNhanVien: 'NV002', TenNhanVien: 'Lê Thị Hoa', ChucVu: 'Nhân viên', Username: 'nhanvien2', Password: hashedPassword },
      { MaNhanVien: 'NV003', TenNhanVien: 'Trần Văn Nam', ChucVu: 'Quản lý', Username: 'quanly1', Password: hashedPassword }
    ]);
    console.log('Seed NhanVien thành công.');

    // 2. DocGia (Member)
    await Member.bulkCreate([
      { MaThanhVien: 'DG001', HoTen: 'Nguyễn Minh Tuấn', Email: 'docgia1@email.com', SoDienThoai: '0901234567', MatKhau: hashedPassword },
      { MaThanhVien: 'DG002', HoTen: 'Trần Thị Lan', Email: 'lan.tt@email.com', SoDienThoai: '0912345678', MatKhau: hashedPassword }
    ]);
    console.log('Seed DocGia thành công.');

    // 3. TheLoai (Category)
    await Category.bulkCreate([
      { MaTheLoai: 'TL001', TenTheLoai: 'Công nghệ thông tin' },
      { MaTheLoai: 'TL002', TenTheLoai: 'Kinh tế & Quản lý' },
      { MaTheLoai: 'TL003', TenTheLoai: 'Văn học & Nghệ thuật' },
      { MaTheLoai: 'TL004', TenTheLoai: 'Kỹ năng sống' }
    ]);
    console.log('Seed TheLoai thành công.');

    // 4. TacGia (Author)
    await Author.bulkCreate([
      { MaTacGia: 'TG001', TenTacGia: 'Nguyễn Văn A', QuocTich: 'Việt Nam' },
      { MaTacGia: 'TG002', TenTacGia: 'Trần Thị B', QuocTich: 'Việt Nam' },
      { MaTacGia: 'TG003', TenTacGia: 'J.K. Rowling', QuocTich: 'Anh Quốc' },
      { MaTacGia: 'TG004', TenTacGia: 'Dale Carnegie', QuocTich: 'Mỹ' }
    ]);
    console.log('Seed TacGia thành công.');

    // 5. NhaXuatBan (Publisher)
    await Publisher.bulkCreate([
      { MaNXB: 'NXB001', TenNXB: 'NXB Giáo Dục', DiaChi: '81 Trần Hưng Đạo, Hà Nội', SoDienThoai: '024123456' },
      { MaNXB: 'NXB002', TenNXB: 'NXB Khoa Học Kỹ Thuật', DiaChi: '70 Trần Hưng Đạo, Hà Nội', SoDienThoai: '024654321' },
      { MaNXB: 'NXB003', TenNXB: 'NXB Trẻ', DiaChi: '161B Lý Chính Thắng, TP.HCM', SoDienThoai: '028123456' }
    ]);
    console.log('Seed NhaXuatBan thành công.');

    // 6. HinhPhat (PenaltyRule)
    await PenaltyRule.bulkCreate([
      { TenHinhPhat: 'Phạt quá hạn', MucPhat: 5000 },
      { TenHinhPhat: 'Phạt hư hỏng', MucPhat: 50000 },
      { TenHinhPhat: 'Phạt làm mất', MucPhat: 100000 }
    ]);
    console.log('Seed HinhPhat thành công.');

    // 7. DauSach (BookTitle)
    await BookTitle.bulkCreate([
      { MaDauSach: 'DS001', TenSach: 'Lập trình C cho người mới bắt đầu', NamXB: 2023, SoLuong: 2, MaTheLoai: 'TL001', MaNXB: 'NXB001' },
      { MaDauSach: 'DS002', TenSach: 'Cấu trúc dữ liệu và Giải thuật', NamXB: 2022, SoLuong: 1, MaTheLoai: 'TL001', MaNXB: 'NXB002' },
      { MaDauSach: 'DS003', TenSach: 'Đắc Nhân Tâm', NamXB: 2020, SoLuong: 1, MaTheLoai: 'TL004', MaNXB: 'NXB003' }
    ]);
    console.log('Seed DauSach thành công.');

    // 8. VietSach (WritingBook)
    await WritingBook.bulkCreate([
      { MaDauSach: 'DS001', MaTacGia: 'TG001' },
      { MaDauSach: 'DS002', MaTacGia: 'TG002' },
      { MaDauSach: 'DS003', MaTacGia: 'TG004' }
    ]);
    console.log('Seed VietSach thành công.');

    // 9. CuonSach (Book)
    await Book.bulkCreate([
      { MaCuonSach: 'CS001_1', TinhTrang: 'Sẵn sàng', ChatLuong: 'Mới', MaDauSach: 'DS001' },
      { MaCuonSach: 'CS001_2', TinhTrang: 'Sẵn sàng', ChatLuong: 'Cũ', MaDauSach: 'DS001' },
      { MaCuonSach: 'CS002_1', TinhTrang: 'Sẵn sàng', ChatLuong: 'Mới', MaDauSach: 'DS002' },
      { MaCuonSach: 'CS003_1', TinhTrang: 'Sẵn sàng', ChatLuong: 'Mới', MaDauSach: 'DS003' }
    ]);
    console.log('Seed CuonSach thành công.');

    console.log('Hoàn tất seed dữ liệu thành công!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

// Chờ kết nối DB trước khi seed
sequelize.authenticate().then(async () => {
  await sequelize.sync({ force: true });
  seed();
});
