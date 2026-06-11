import React, { useState } from 'react';
import {mockData} from '../data/mockdata';

const BookItemsManagement = ({user}) => {
    // Các state quản lý
    const [bookItems, setBookItems] = useState(mockData.cuonsach);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    //State phục vụ sửa thông tin cuốn sách
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const isAdmin = user?.role === 'admin';

    //Xử lý xóa sách
    const handleDeleteItem = (maCuonSach) => {
        const confirm = window.confirm(`Xác nhận xóa cuốn sách m [${maCuonSach}] không?`);
        if (confirm) {
            setBookItems((bookItems.filter(item => item.MaCuonSach !== maCuonSach)));
            alert("Xóa cuốn sách thành công!");
        }
    };

    // Xử lý sửa sách
    const handleOpenModal = (item) => {
        setEditingItem ({...item});
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditingItem(prev => ({...prev, [name]: value}));
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setBookItems(bookItems.map (item =>
            item.MaCuonSach === editingItem.MaCuonSach ? editingItem : item));
        setIsModalOpen(false);
        alert("Cập nhập trạng thái thành công!");
    };

    // --- LOGIC TÌM KIẾM ĐÃ ĐƯỢC NÂNG CẤP (TÌM ĐƯỢC CẢ THEO TÊN SÁCH) ---
    const filteredItems = bookItems.filter(item => {
        const matchesSearch =
            item.MaCuonSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.MaDauSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.TenSach && item.TenSach.toLowerCase().includes(searchTerm.toLowerCase())); // Tìm theo tên sách an toàn
        const matchesStatus = statusFilter === "" || item.TrangThai === statusFilter;
        return matchesStatus && matchesSearch;
    });

    //hàm helper gán màu sắc cho trạng thái
    const getStatusStyle = (trangThai) => {
        switch(trangThai) {
            case "Sẵn sàng": return { background: '#e8f5e9', color: '#2e7d32' }; // Xanh lá
            case "Đang mượn": return { background: '#fff3e0', color: '#ef6c00' }; // Cam
            case "Đã mất": return { background: '#ffebee', color: '#c62828' };  // Đỏ
            default: return { background: '#eee', color: '#333' };
        }
    };

    return (
        <div className="book-item-page">
            {/* Tiêu đề */}
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>📖 Hệ thống Quản lý Cuốn sách (Bản sao)</h2>
                {isAdmin && (
                    <button className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                        + Thêm bản sao (Barcode)
                    </button>
                )}
            </div>

            {/* Thanh tìm kiếm & Bộ lọc trạng thái */}
            <div className="filter-bar" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Tìm mã cuốn, mã đầu sách hoặc tên sách..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}
                >
                    <option value="">Tất cả Trạng thái</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                    <option value="Đang mượn">Đang mượn</option>
                    <option value="Đã mất">Đã mất</option>
                </select>
            </div>

            {/* Bảng hiển thị cuốn sách */}
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Mã Cuốn Sách (Barcode)</th>
                        <th>Mã Đầu Sách</th>
                        <th>Tên sách</th> {/* Thêm cột tiêu đề */}
                        <th>Tình trạng vật lý</th>
                        <th>Trạng thái lưu thông</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <tr key={item.MaCuonSach}>
                                <td><code>{item.MaCuonSach}</code></td>
                                <td><strong>{item.MaDauSach}</strong></td>
                                <td>{item.TenSach || <em style={{color: '#bbb'}}>Chưa cập nhật</em>}</td> {/* Thêm trường TenSach an toàn */}
                                <td>{item.TinhTrang}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        ...getStatusStyle(item.TrangThai)
                                    }}>
                                      {item.TrangThai}
                                    </span>
                                </td>

                                {/* Quyền sửa/xóa dành cho Nhân viên */}
                                {isAdmin && (
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="btn-icon" title="Cập nhật trạng thái" onClick={() => handleOpenModal(item)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}>✏️</button>
                                        <button className="btn-icon delete" title="Xóa cuốn sách" onClick={() => handleDeleteItem(item.MaCuonSach)} style={{ marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '16px' }}>🗑️</button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            {/* SỬA: Tăng colSpan từ (5 : 4) lên (6 : 5) để vừa vặn với số cột mới thêm */}
                            <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                ❌ Không tìm thấy mã bản sao hoặc tên sách nào trùng khớp!
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* --- POPUP MODAL CHỈNH SỬA TRẠNG THÁI CUỐN SÁCH --- */}
            {isModalOpen && editingItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>✏️ Cập nhật Cuốn sách: {editingItem.MaCuonSach}</h3>

                        <form onSubmit={handleSaveEdit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Tình trạng chất lượng vật lý:</label>
                                <select name="TinhTrang" value={editingItem.TinhTrang} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                    <option value="Mới">Mới</option>
                                    <option value="Cũ">Cũ</option>
                                    <option value="Hỏng">Hỏng</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Trạng thái lưu thông:</label>
                                <select name="TrangThai" value={editingItem.TrangThai} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                    <option value="Sẵn sàng">Sẵn sàng</option>
                                    <option value="Đang mượn">Đang mượn</option>
                                    <option value="Đã mất">Đã mất</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                                <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu thông tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookItemsManagement;