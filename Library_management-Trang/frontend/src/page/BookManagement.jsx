import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const BookManagement = ({ user }) => {
  // --- 1. CÁC STATE QUẢN LÝ DỮ LIỆU & BỘ LỌC ---
  const [books, setBooks] = useState(mockData.dausach);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --- 2. CÁC STATE QUẢN LÝ CHỨC NĂNG SỬA (EDIT MODAL) ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Kiểm tra quyền Admin
  const isAdmin = user?.role === 'admin';

  // --- 3. LOGIC XỬ LÝ CHỨC NĂNG XÓA (DELETE) ---
  const handleDeleteBook = (maDauSach, tenSach) => {
    const confirmDelete = window.confirm(`Xác nhận xóa đầu sách "${tenSach}" khỏi hệ thống không?`);
    if (confirmDelete) {
      // Lọc bỏ cuốn sách được chọn ra khỏi mảng State
      const updatedBooks = books.filter(book => book.MaDauSach !== maDauSach);
      setBooks(updatedBooks);
      alert("Xóa đầu sách thành công!");
    }
  };

  // --- 4. LOGIC XỬ LÝ CHỨC NĂNG SỬA (EDIT) ---
  // Mở modal và nạp dữ liệu cũ của cuốn sách vào form
  const handleOpenEditModal = (book) => {
    setEditingBook({ ...book }); // Tạo bản sao để tránh sửa trực tiếp vào data gốc khi chưa bấm Lưu
    setIsEditModalOpen(true);
  };

  // Cập nhật giá trị khi người dùng gõ vào ô Input trong Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Lưu lại dữ liệu sau khi sửa
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedBooks = books.map(book =>
        book.MaDauSach === editingBook.MaDauSach ? editingBook : book
    );
    setBooks(updatedBooks);
    setIsEditModalOpen(false);
    alert("Cập nhật thông tin đầu sách thành công!");
  };


  // --- 5. LOGIC TÌM KIẾM & LỌC (ĐÃ CẬP NHẬT TÌM THEO MÃ SÁCH) ---
  const filteredBooks = books.filter(book => {
    const matchesSearch =
        book.MaDauSach.toLowerCase().includes(searchTerm.toLowerCase()) || // THÊM DÒNG NÀY: Tìm theo mã sách
        book.TenSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.TenTacGia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || book.TenTheLoai === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(books.map(book => book.TenTheLoai))];

  return (
      <div className="book-page" style={{ position: 'relative' }}>

        {/* Tiêu đề trang */}
        <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>📚 Hệ thống Quản lý Đầu sách</h2>
          {isAdmin && (
              <button className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                + Thêm đầu sách
              </button>
          )}
        </div>

        {/* Thanh bộ lọc (Filter Bar) */}
        <div className="filter-bar" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <input
              type="text"
              placeholder="Tìm mã sách, tên sách hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}
          >
            <option value="">Tất cả Thể loại</option>
            {uniqueCategories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Bảng dữ liệu đầu sách */}
        <div className="table-container">
          <table>
            <thead>
            <tr>
              <th>Mã DS</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>NXB</th>
              <th>Năm XB</th>
              <th style={{ textAlign: 'center' }}>Số lượng</th>
              {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
            </tr>
            </thead>
            <tbody>
            {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                    <tr key={book.MaDauSach}>
                      <td><code>{book.MaDauSach}</code></td>
                      <td><strong>{book.TenSach}</strong></td>
                      <td>{book.TenTacGia}</td>
                      <td><span className="tag-blue">{book.TenTheLoai}</span></td>
                      <td>{book.TenNXB}</td>
                      <td>{book.NamXB}</td>
                      <td style={{ textAlign: 'center' }}>{book.SoLuong}</td>

                      {/* CỘT THAO TÁC CỦA ADMIN */}
                      {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <button
                                className="btn-icon"
                                title="Sửa thông tin"
                                onClick={() => handleOpenEditModal(book)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
                            >
                              ✏️
                            </button>
                            <button
                                className="btn-icon delete"
                                title="Xóa đầu sách"
                                onClick={() => handleDeleteBook(book.MaDauSach, book.TenSach)}
                                style={{ marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
                            >
                              🗑️
                            </button>
                          </td>
                      )}
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    ❌ Không tìm thấy đầu sách phù hợp với từ khóa!
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* --- 6. GIAO DIỆN MODAL CHỈNH SỬA ĐẦU SÁCH (CHỈ MỞ KHI CLICK VÀO ✏️) --- */}
        {isEditModalOpen && editingBook && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>
                  ✏️ Chỉnh sửa đầu sách: {editingBook.MaDauSach}
                </h3>

                <form onSubmit={handleSaveEdit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Tên sách:</label>
                    <input type="text" name="TenSach" value={editingBook.TenSach} onChange={handleInputChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Tác giả:</label>
                    <input type="text" name="TenTacGia" value={editingBook.TenTacGia} onChange={handleInputChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Thể loại:</label>
                    <input type="text" name="TenTheLoai" value={editingBook.TenTheLoai} onChange={handleInputChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Nhà xuất bản:</label>
                    <input type="text" name="TenNXB" value={editingBook.TenNXB} onChange={handleInputChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Năm XB:</label>
                      <input type="number" name="NamXB" value={editingBook.NamXB} onChange={handleInputChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Số lượng:</label>
                      <input type="number" name="SoLuong" value={editingBook.SoLuong} onChange={handleInputChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                    </div>
                  </div>

                  {/* Nhóm nút điều khiển */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Hủy bỏ
                    </button>
                    <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

      </div>
  );
};

export default BookManagement;