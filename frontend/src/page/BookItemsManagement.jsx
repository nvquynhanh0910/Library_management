import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const BookItemsManagement = ({ user }) => {
    const [bookItems, setBookItems] = useState([]);
    const [bookTitles, setBookTitles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ MaDauSach: '', TenSach: '', ChatLuong: 'Mới' });
    const [soLuongThem, setSoLuongThem] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin';

    // Lấy danh sách cuốn sách
    const fetchBookItems = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/book-titles/copies/search');
            setBookItems(res.data);
        } catch (err) {
            setError('Không thể tải danh sách cuốn sách: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách đầu sách cho dropdown
    const fetchBookTitles = async () => {
        try {
            const res = await api.get('/book-titles');
            setBookTitles(res.data);
        } catch (err) {
            console.error('Lỗi tải đầu sách:', err);
        }
    };

    useEffect(() => {
        fetchBookItems();
        fetchBookTitles();
    }, []);

    // Nhập lô bản sao - gửi TenSach theo đúng bookController
    const handleAddBookItem = async (e) => {
        e.preventDefault();
        if (!newItem.TenSach) { alert("Vui lòng chọn Đầu sách!"); return; }

        setSubmitting(true);
        try {
            await api.post('/book-titles/copies', {
                TenSach: newItem.TenSach,
                ChatLuong: newItem.ChatLuong,
                SoLuong: parseInt(soLuongThem, 10)
            });
            alert('✅ Nhập kho thành công!');
            setIsAddModalOpen(false);
            setSoLuongThem(1);
            setNewItem({ MaDauSach: '', TenSach: '', ChatLuong: 'Mới' });
            fetchBookItems();
        } catch (err) {
            alert('❌ Nhập kho thất bại: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = bookItems.filter(item => {
        const tenSach = item.BookTitle?.TenSach || '';
        const matchesSearch =
            (item.MaCuonSach || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.MaDauSach  || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenSach.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "" || item.TinhTrang === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (tinhTrang) => {
        switch (tinhTrang) {
            case "Sẵn sàng":  return { background: '#e8f5e9', color: '#2e7d32' };
            case "Đang mượn": return { background: '#fff3e0', color: '#ef6c00' };
            case "Mất":       return { background: '#ffebee', color: '#c62828' };
            case "Hỏng":      return { background: '#fff8e1', color: '#e65100' };
            default:          return { background: '#eee',    color: '#333' };
        }
    };

    return (
        <div className="book-item-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>📖 Hệ thống Quản lý Cuốn sách (Bản sao)</h2>
                {isAdmin && (
                    <button onClick={() => setIsAddModalOpen(true)}
                        style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                        + Nhập lô bản sao mới
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Tìm mã cuốn, mã đầu sách hoặc tên sách..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}>
                    <option value="">Tất cả Trạng thái</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                    <option value="Đang mượn">Đang mượn</option>
                    <option value="Hỏng">Hỏng</option>
                    <option value="Mất">Mất</option>
                </select>
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#888' }}>⏳ Đang tải dữ liệu...</p>}
            {error   && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={th}>Mã Cuốn Sách</th>
                                <th style={th}>Mã Đầu Sách</th>
                                <th style={th}>Tên sách</th>
                                <th style={th}>Chất lượng</th>
                                <th style={th}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Không có dữ liệu</td></tr>
                            ) : filteredItems.map((item) => (
                                <tr key={item.MaCuonSach} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={td}><code>{item.MaCuonSach}</code></td>
                                    <td style={td}><strong>{item.MaDauSach}</strong></td>
                                    <td style={td}>{item.BookTitle?.TenSach || '-'}</td>
                                    <td style={td}>{item.ChatLuong}</td>
                                    <td style={td}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...getStatusStyle(item.TinhTrang) }}>
                                            {item.TinhTrang}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL NHẬP KHO */}
            {isAddModalOpen && isAdmin && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>📦 Nhập kho lô bản sao sách</h3>
                        <form onSubmit={handleAddBookItem}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Chọn đầu sách:</label>
                                <select
                                    value={newItem.MaDauSach}
                                    onChange={e => {
                                        const selected = bookTitles.find(b => b.MaDauSach === e.target.value);
                                        setNewItem({ ...newItem, MaDauSach: e.target.value, TenSach: selected?.TenSach || '' });
                                    }}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}
                                    required>
                                    <option value="">-- Chọn đầu sách --</option>
                                    {bookTitles.map(b => (
                                        <option key={b.MaDauSach} value={b.MaDauSach}>{b.MaDauSach} - {b.TenSach}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Chất lượng vật lý:</label>
                                <select value={newItem.ChatLuong} onChange={e => setNewItem({ ...newItem, ChatLuong: e.target.value })}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}>
                                    <option value="Mới">Mới</option>
                                    <option value="Cũ">Cũ</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#2e7d32' }}>Số lượng bản sao nhập thêm:</label>
                                <input type="number" min="1" max="100" value={soLuongThem}
                                    onChange={e => setSoLuongThem(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #7DA78C', fontWeight: 'bold' }}
                                    required />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)}
                                    style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Hủy
                                </button>
                                <button type="submit" disabled={submitting}
                                    style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    {submitting ? 'Đang xử lý...' : 'Xác nhận nhập kho'}
                                </button>
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

export default BookItemsManagement;
