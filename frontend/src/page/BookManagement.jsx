import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const BookManagement = ({ user }) => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [newBook, setNewBook] = useState({
        TenSach: '', TenTacGia: '', TenTheLoai: '', TenNXB: '', NamXB: new Date().getFullYear()
    });

    const isAdmin = user?.role === 'admin';

    // Lấy danh sách đầu sách
    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/book-titles');
            setBooks(res.data);
        } catch (err) {
            setError('Không thể tải danh sách đầu sách: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    // Xóa đầu sách
    const handleDeleteBook = async (maDauSach, tenSach) => {
        if (!window.confirm(`Xác nhận xóa đầu sách "${tenSach}" khỏi hệ thống không?`)) return;
        try {
            await api.delete(`/book-titles/${maDauSach}`);
            alert('Xóa đầu sách thành công!');
            fetchBooks();
        } catch (err) {
            alert('❌ ' + (err.response?.data?.message || 'Xóa thất bại!'));
        }
    };

    // Mở modal sửa - cần flatten dữ liệu từ include
    const handleOpenEditModal = (book) => {
        setEditingBook({
            MaDauSach: book.MaDauSach,
            TenSach: book.TenSach,
            NamXB: book.NamXB,
            SoLuong: book.SoLuong,
            TenTheLoai: book.Category?.TenTheLoai || '',
            TenNXB: book.Publisher?.TenNXB || '',
            TenTacGia: book.WritingBooks?.[0]?.Author?.TenTacGia || ''
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingBook(prev => ({ ...prev, [name]: value }));
    };

    // Lưu chỉnh sửa
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/book-titles/${editingBook.MaDauSach}`, {
                TenSach: editingBook.TenSach,
                NamXB: editingBook.NamXB,
                TenTheLoai: editingBook.TenTheLoai,
                TenNXB: editingBook.TenNXB,
                TacGia: editingBook.TenTacGia ? [{ TenTacGia: editingBook.TenTacGia }] : []
            });
            alert('Cập nhật thông tin đầu sách thành công!');
            setIsEditModalOpen(false);
            fetchBooks();
        } catch (err) {
            alert('❌ ' + (err.response?.data?.message || 'Cập nhật thất bại!'));
        }
    };

    // Thêm đầu sách mới
    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/book-titles', {
                TenSach: newBook.TenSach,
                TenTacGia: newBook.TenTacGia,
                TenTheLoai: newBook.TenTheLoai,
                TenNXB: newBook.TenNXB,
                NamXB: parseInt(newBook.NamXB, 10)
            });
            alert('🎉 Thêm đầu sách mới thành công!');
            setIsAddModalOpen(false);
            setNewBook({ TenSach: '', TenTacGia: '', TenTheLoai: '', TenNXB: '', NamXB: new Date().getFullYear() });
            fetchBooks();
        } catch (err) {
            alert('❌ ' + (err.response?.data?.message || 'Thêm thất bại!'));
        }
    };

    // Filter
    const filteredBooks = books.filter(book => {
        const tenTacGia = book.WritingBooks?.[0]?.Author?.TenTacGia || '';
        const tenTheLoai = book.Category?.TenTheLoai || '';
        const matchesSearch =
            book.MaDauSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.TenSach && book.TenSach.toLowerCase().includes(searchTerm.toLowerCase())) ||
            tenTacGia.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "" || tenTheLoai === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const uniqueCategories = [...new Set(books.map(b => b.Category?.TenTheLoai).filter(Boolean))];

    return (
        <div className="book-page" style={{ position: 'relative' }}>
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>📚 Hệ thống Quản lý Đầu sách</h2>
                {isAdmin && (
                    <button onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                        + Thêm đầu sách
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Tìm mã sách, tên sách hoặc tác giả..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}>
                    <option value="">Tất cả Thể loại</option>
                    {uniqueCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#888' }}>⏳ Đang tải dữ liệu...</p>}
            {error   && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={th}>Mã DS</th>
                                <th style={th}>Tên sách</th>
                                <th style={th}>Tác giả</th>
                                <th style={th}>Thể loại</th>
                                <th style={th}>NXB</th>
                                <th style={th}>Năm XB</th>
                                <th style={{ ...th, textAlign: 'center' }}>Số lượng</th>
                                {isAdmin && <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                                <tr key={book.MaDauSach} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={td}><code>{book.MaDauSach}</code></td>
                                    <td style={td}><strong>{book.TenSach}</strong></td>
                                    <td style={td}>{book.WritingBooks?.[0]?.Author?.TenTacGia || <em style={{ color: '#bbb', fontSize: '13px' }}>Chưa cập nhật</em>}</td>
                                    <td style={td}>{book.Category?.TenTheLoai || <span>Trống</span>}</td>
                                    <td style={td}>{book.Publisher?.TenNXB || <em style={{ color: '#bbb', fontSize: '13px' }}>Trống</em>}</td>
                                    <td style={td}>{book.NamXB}</td>
                                    <td style={{ ...td, textAlign: 'center', fontWeight: 'bold', color: book.SoLuong === 0 ? '#c62828' : '#333' }}>
                                        {book.SoLuong} {book.SoLuong === 0 && '⚠️'}
                                    </td>
                                    {isAdmin && (
                                        <td style={{ ...td, textAlign: 'center' }}>
                                            <button title="Sửa thông tin" onClick={() => handleOpenEditModal(book)}
                                                style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}>✏️</button>
                                            <button title="Xóa đầu sách" onClick={() => handleDeleteBook(book.MaDauSach, book.TenSach)}
                                                style={{ marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}>🗑️</button>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        ❌ Không tìm thấy đầu sách phù hợp!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL THÊM MỚI */}
            {isAddModalOpen && isAdmin && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>➕ Thêm đầu sách mới</h3>
                        <form onSubmit={handleAddBook}>
                            {[['TenSach','Tên sách'],['TenTacGia','Tác giả'],['TenTheLoai','Thể loại'],['TenNXB','Nhà xuất bản']].map(([name, label]) => (
                                <div key={name} style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>{label}:</label>
                                    <input type="text" name={name} value={newBook[name]} onChange={handleAddInputChange}
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                                </div>
                            ))}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Năm XB:</label>
                                <input type="number" name="NamXB" value={newBook.NamXB} onChange={handleAddInputChange}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                            </div>
                            <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>* Số lượng ban đầu mặc định là 0. Hãy sang trang Bản Sao để nhập kho.</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy bỏ</button>
                                <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL CHỈNH SỬA */}
            {isEditModalOpen && editingBook && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>
                            ✏️ Chỉnh sửa: {editingBook.MaDauSach}
                        </h3>
                        <form onSubmit={handleSaveEdit}>
                            {[['TenSach','Tên sách'],['TenTacGia','Tác giả'],['TenTheLoai','Thể loại'],['TenNXB','Nhà xuất bản']].map(([name, label]) => (
                                <div key={name} style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>{label}:</label>
                                    <input type="text" name={name} value={editingBook[name] || ''} onChange={handleInputChange}
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                                </div>
                            ))}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Năm XB:</label>
                                <input type="number" name="NamXB" value={editingBook.NamXB || ''} onChange={handleInputChange}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd' }} required />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy bỏ</button>
                                <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const th = { padding: '10px 12px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #ddd' };
const td = { padding: '10px 12px' };

export default BookManagement;
