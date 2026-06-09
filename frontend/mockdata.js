export const mockUsers = [
  { username: "nhanvien1", password: "123", role: "admin", name: "Thủ thư: Trang" },
  { username: "docgia1",   password: "123", role: "guest", name: "Độc giả: Tuấn" }
];

export const mockData = {
  dausach: [
    { MaDauSach: "DS001", TenSach: "Lập trình C cho người mới bắt đầu",  TenTheLoai: "Công nghệ thông tin", TenTacGia: "Nguyễn Văn A", TenNXB: "NXB Giáo Dục",          NamXB: 2023, SoLuong: 5 },
    { MaDauSach: "DS002", TenSach: "Cấu trúc dữ liệu và Giải thuật",     TenTheLoai: "Công nghệ thông tin", TenTacGia: "Trần Thị B",   TenNXB: "NXB Khoa Học Kỹ Thuật", NamXB: 2022, SoLuong: 3 },
    { MaDauSach: "DS003", TenSach: "Đắc Nhân Tâm",                       TenTheLoai: "Kỹ năng sống",        TenTacGia: "Dale Carnegie", TenNXB: "NXB Trẻ",               NamXB: 2020, SoLuong: 8 },
    { MaDauSach: "DS004", TenSach: "Cha giàu cha nghèo",                 TenTheLoai: "Kinh tế & Quản lý",   TenTacGia: "R. Kiyosaki",  TenNXB: "NXB Tổng Hợp",         NamXB: 2019, SoLuong: 6 },
    { MaDauSach: "DS005", TenSach: "Lập trình Web với React",            TenTheLoai: "Công nghệ thông tin", TenTacGia: "Trần Thị B",   TenNXB: "NXB Khoa Học Kỹ Thuật", NamXB: 2024, SoLuong: 10 }
  ],
  cuonsach: [
    { MaCuonSach: "CS001_1", MaDauSach: "DS001", TinhTrang: "Mới",  TrangThai: "Đang mượn" },
    { MaCuonSach: "CS001_2", MaDauSach: "DS001", TinhTrang: "Cũ",   TrangThai: "Sẵn sàng" },
    { MaCuonSach: "CS002_1", MaDauSach: "DS002", TinhTrang: "Mới",  TrangThai: "Sẵn sàng" },
    { MaCuonSach: "CS003_1", MaDauSach: "DS003", TinhTrang: "Mới",  TrangThai: "Đang mượn" },
    { MaCuonSach: "CS004_1", MaDauSach: "DS004", TinhTrang: "Cũ",   TrangThai: "Sẵn sàng" },
    { MaCuonSach: "CS005_1", MaDauSach: "DS005", TinhTrang: "Mới",  TrangThai: "Sẵn sàng" }
  ],
  theloai: [
    { MaTheLoai: "TL001", TenTheLoai: "Công nghệ thông tin" },
    { MaTheLoai: "TL002", TenTheLoai: "Kinh tế & Quản lý" },
    { MaTheLoai: "TL003", TenTheLoai: "Văn học & Nghệ thuật" },
    { MaTheLoai: "TL004", TenTheLoai: "Kỹ năng sống" }
  ],
  tacgia: [
    { MaTacGia: "TG001", TenTacGia: "Nguyễn Văn A", QuocTich: "Việt Nam" },
    { MaTacGia: "TG002", TenTacGia: "Trần Thị B",   QuocTich: "Việt Nam" },
    { MaTacGia: "TG003", TenTacGia: "J.K. Rowling",  QuocTich: "Anh Quốc" },
    { MaTacGia: "TG004", TenTacGia: "Dale Carnegie", QuocTich: "Mỹ" }
  ],
  nhaxuatban: [
    { MaNXB: "NXB001", TenNXB: "NXB Giáo Dục",          DiaChi: "81 Trần Hưng Đạo, Hà Nội" },
    { MaNXB: "NXB002", TenNXB: "NXB Khoa Học Kỹ Thuật", DiaChi: "70 Trần Hưng Đạo, Hà Nội" },
    { MaNXB: "NXB003", TenNXB: "NXB Trẻ",               DiaChi: "161B Lý Chính Thắng, TP.HCM" }
  ],
  docgia: [
    { MaThanhVien: "DG001", HoTen: "Nguyễn Minh Tuấn", Email: "tuan.nm@email.com",  SoDienThoai: "0901234567" },
    { MaThanhVien: "DG002", HoTen: "Trần Thị Lan",      Email: "lan.tt@email.com",   SoDienThoai: "0912345678" },
    { MaThanhVien: "DG003", HoTen: "Lê Văn Minh",       Email: "minh.lv@email.com",  SoDienThoai: "0923456789" },
    { MaThanhVien: "DG004", HoTen: "Phạm Thị Hoa",      Email: "hoa.pt@email.com",   SoDienThoai: "0934567890" },
    { MaThanhVien: "DG005", HoTen: "Hoàng Văn Hùng",    Email: "hung.hv@email.com",  SoDienThoai: "0945678901" }
  ],
  nhanvien: [
    { MaNhanVien: "NV001", TenNhanVien: "Nguyễn Thị Trang", ChucVu: "Thủ thư",  Username: "nhanvien1" },
    { MaNhanVien: "NV002", TenNhanVien: "Lê Thị Hoa",       ChucVu: "Nhân viên", Username: "nhanvien2" },
    { MaNhanVien: "NV003", TenNhanVien: "Trần Văn Nam",      ChucVu: "Quản lý",  Username: "quanly1"   }
  ],
  phieumuon: [
    { MaPhieu: "PM001", NgayLapPhieu: "2025-06-01", MaThanhVien: "DG001", HoTenDocGia: "Nguyễn Minh Tuấn", MaNhanVienLap: "NV001", MaNhanVienThu: null,  TrangThai: "Đang mượn" },
    { MaPhieu: "PM002", NgayLapPhieu: "2025-05-20", MaThanhVien: "DG002", HoTenDocGia: "Trần Thị Lan",     MaNhanVienLap: "NV001", MaNhanVienThu: "NV002", TrangThai: "Đã trả"   },
    { MaPhieu: "PM003", NgayLapPhieu: "2025-05-10", MaThanhVien: "DG003", HoTenDocGia: "Lê Văn Minh",      MaNhanVienLap: "NV002", MaNhanVienThu: null,  TrangThai: "Quá hạn"   },
    { MaPhieu: "PM004", NgayLapPhieu: "2025-06-03", MaThanhVien: "DG004", HoTenDocGia: "Phạm Thị Hoa",     MaNhanVienLap: "NV001", MaNhanVienThu: null,  TrangThai: "Đang mượn" }
  ],
  muonsach: [
    { MaPhieu: "PM001", MaCuonSach: "CS001_1", TenSach: "Lập trình C cho người mới bắt đầu", HinhThucMuon: "Tại chỗ",  HanTra: "2025-06-15", NgayTraThucTe: null,         TinhTrangKhiTra: null,  TienPhatPhatSinh: 0     },
    { MaPhieu: "PM001", MaCuonSach: "CS003_1", TenSach: "Đắc Nhân Tâm",                      HinhThucMuon: "Mang về",  HanTra: "2025-06-15", NgayTraThucTe: null,         TinhTrangKhiTra: null,  TienPhatPhatSinh: 0     },
    { MaPhieu: "PM002", MaCuonSach: "CS002_1", TenSach: "Cấu trúc dữ liệu và Giải thuật",    HinhThucMuon: "Mang về",  HanTra: "2025-06-05", NgayTraThucTe: "2025-06-04", TinhTrangKhiTra: "Tốt", TienPhatPhatSinh: 0     },
    { MaPhieu: "PM003", MaCuonSach: "CS004_1", TenSach: "Cha giàu cha nghèo",                 HinhThucMuon: "Mang về",  HanTra: "2025-05-25", NgayTraThucTe: null,         TinhTrangKhiTra: null,  TienPhatPhatSinh: 45000 },
    { MaPhieu: "PM004", MaCuonSach: "CS005_1", TenSach: "Lập trình Web với React",            HinhThucMuon: "Tại chỗ", HanTra: "2025-06-20", NgayTraThucTe: null,         TinhTrangKhiTra: null,  TienPhatPhatSinh: 0     }
  ],
  phieuPhat: [
    { MaPhieuPhat: "PP001", NgayLapPhieu: "2025-06-01", TrangThaiThanhToan: "Chưa thanh toán", TongTienPhat: 45000,  TenHinhPhat: "Phạt quá hạn", MaPhieu: "PM003", MaCuonSach: "CS004_1", HoTenDocGia: "Lê Văn Minh"     },
    { MaPhieuPhat: "PP002", NgayLapPhieu: "2025-05-28", TrangThaiThanhToan: "Đã thanh toán",   TongTienPhat: 15000,  TenHinhPhat: "Phạt quá hạn", MaPhieu: "PM002", MaCuonSach: "CS002_1", HoTenDocGia: "Trần Thị Lan"     },
    { MaPhieuPhat: "PP003", NgayLapPhieu: "2025-06-02", TrangThaiThanhToan: "Chưa thanh toán", TongTienPhat: 100000, TenHinhPhat: "Phạt hư hỏng", MaPhieu: "PM001", MaCuonSach: "CS001_1", HoTenDocGia: "Nguyễn Minh Tuấn" }
  ],
  dashboard: {
    tongDauSach: 5, tongCuonSach: 12, dangMuon: 4, quaHan: 1, tongDocGia: 5, tongNhanVien: 3,
    topSach: [
      { TenSach: "Đắc Nhân Tâm",         SoLanMuon: 12 },
      { TenSach: "Lập trình C",           SoLanMuon: 9  },
      { TenSach: "Lập trình Web React",  SoLanMuon: 7  },
      { TenSach: "Cấu trúc dữ liệu",     SoLanMuon: 6  },
      { TenSach: "Cha giàu cha nghèo",   SoLanMuon: 5  }
    ],
    theoTheLoai: [
      { TenTheLoai: "Công nghệ thông tin", SoLanMuon: 22, color: "#7DA78C" },
      { TenTheLoai: "Kỹ năng sống",        SoLanMuon: 12, color: "#f0ad4e" },
      { TenTheLoai: "Kinh tế & Quản lý",   SoLanMuon: 8,  color: "#5bc0de" },
      { TenTheLoai: "Văn học & Nghệ thuật",SoLanMuon: 5,  color: "#d9534f" }
    ],
    theoThang: [
      { thang: "T1", muon: 18, tra: 15 },
      { thang: "T2", muon: 24, tra: 20 },
      { thang: "T3", muon: 30, tra: 28 },
      { thang: "T4", muon: 22, tra: 25 },
      { thang: "T5", muon: 35, tra: 30 },
      { thang: "T6", muon: 28, tra: 20 }
    ]
  }
};
