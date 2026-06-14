import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const BookManagement = ({ user }) => {
  //CÁC STATE QUẢN LÝ DỮ LIỆU & BỘ LỌC
  const [books, setBooks] = useState(mockData.dausach);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  //CÁC STATE QUẢN LÝ CHỨC NĂNG (MODAL POPUP)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Form thêm mới: Mặc định ban đầu khi tạo đầu sách luôn là 0 cuốn
  const [newBook, setNewBook] = useState({
    TenSach: '', TenTacGia: '', TenTheLoai: '', TenNXB: '', NamXB: new Date().getFullYear()
  });

  // Kiểm tra quyền Admin
  const isAdmin = user?.role === 'admin';

  // delete
  const handleDeleteBook = (maDauSach, tenSach) => {
    const confirmDelete = window.confirm(`Xác nhận xóa đầu sách "${tenSach}" khỏi hệ thống không?`);
    if (confirmDelete) {
      setBooks(books.filter(book => book.MaDauSach !== maDauSach));
      alert("Xóa đầu sách thành công!");
    }
  };

  // edit
  const handleOpenEditModal = (book) => {
    setEditingBook({ ...book });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setBooks(books.map(book =>
        book.MaDauSach === editingBook.MaDauSach ? editingBook : book
    ));
    setIsEditModalOpen(false);
    alert("Cập nhật thông tin đầu sách thành công!");
  };

  //thêm sách
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    const fakeGeneratedId = `DS${String(books.length + 1).padStart(3, '0')}`;
    const bookToAdd = {
      MaDauSach: fakeGeneratedId,
      ...newBook,
      NamXB: parseInt(newBook.NamXB, 10),
      SoLuong: 0 // Sách mới tạo có 0 bản sao, số lượng tự tăng khi nạp cuốn sách
    };

    setBooks([...books, bookToAdd]);
    setIsAddModalOpen(false);
    setNewBook({ TenSach: '', TenTacGia: '', TenTheLoai: '', TenNXB: '', NamXB: new Date().getFullYear() });
    alert(`🎉 Thêm đầu sách mới thành công!`);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch =
        book.MaDauSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.TenSach && book.TenSach.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.TenTacGia && book.TenTacGia.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "" || (book.TenTheLoai && book.TenTheLoai === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(books.map(book => book.TenTheLoai).filter(Boolean))];

  return (
      <div className="book-page" style={{ position: 'relative' }}>

        {/* Tiêu đề trang */}
        <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>📚 Hệ thống Quản lý Đầu sách</h2>
          {isAdmin && (
              <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                + Thêm đầu sách
              </button>
          )}
        </div>

        {/* Thanh bộ lọc */}
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
                      <td>{book.TenTacGia || <em style={{color: '#bbb', fontSize: '13px'}}>Chưa cập nhật</em>}</td>
                      <td>{book.TenTheLoai || <span className="tag-gray">Trống</span>}</td>
                      <td>{book.TenNXB || <em style={{color: '#bbb', fontSize: '13px'}}>Trống</em>}</td>
                      <td>{book.NamXB}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: book.SoLuong === 0 ? '#c62828' : '#333' }}>
                        {book.SoLuong} {book.SoLuong === 0 && '⚠️'}
                      </td>

                      {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <button
                                title="Sửa thông tin"
                                onClick={() => handleOpenEditModal(book)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}
                            >
                              ✏️
                            </button>
                            <button
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

        {isAddModalOpen && isAdmin && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>➕ Thêm đầu sách mới</h3>
                <form onSubmit={handleAddBook}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Tên sách:</label>
                    <input type="text" value={newBook.TenSach} onChange={handleAddInputChange} name="TenSach" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Tác giả:</label>
                    <input type="text" value={newBook.TenTacGia} onChange={handleAddInputChange} name="TenTacGia" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Thể loại:</label>
                    <input type="text" value={newBook.TenTheLoai} onChange={handleAddInputChange} name="TenTheLoai" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Nhà xuất bản:</label>
                      <input type="text" value={newBook.TenNXB} onChange={handleAddInputChange} name="TenNXB" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Năm XB:</label>
                      <input type="number" value={newBook.NamXB} onChange={handleAddInputChange} name="NamXB" style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>* Số lượng ban đầu mặc định là 0. Bạn hãy sang trang Bản Sao để nhập kho.</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                    <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy bỏ</button>
                    <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm mới</button>
                  </div>
                </form>
              </div>
            </div>
        )}

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
                    <input type="text"