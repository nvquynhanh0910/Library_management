import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const GREEN = '#7DA78C';
const LIGHT = '#e8f5ec';

const hinhPhatStyle = {
    'Hỏng': { bg: '#fff3e0', color: '#e65100' },
    'Mất':  { bg: '#ffebee', color: '#c62828' },
};
const ttStyle = {
    'Chưa thanh toán': { bg: '#ffebee', color: '#c62828' },
    'Đã thanh toán':   { bg: LIGHT,     color: '#2e7d32' },
};

const PhieuPhatManagement = ({ user }) => {
    const [list,    setList]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');
    const [filter,  setFilter]  = useState('');
    const [search,  setSearch]  = useState('');
    const isAdmin = user?.role === 'admin';

    const fetchList = useCallback(async () => {
        try {
            setLoading(true);
            // Nhân viên xem tất cả, độc giả xem của mình
            const endpoint = isAdmin ? '/punishment-slips' : '/punishment-slips/my';
            const res = await api.get(endpoint);
            setList(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách phiếu phạt');
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => { fetchList(); }, [fetchList]);

    const handleThanhToan = async (maPhieuPhat) => {
        if (!window.confirm('Xác nhận đánh dấu phiếu phạt này là Đã thanh toán?')) return;
        try {
            await api.put(`/punishment-slips/${maPhieuPhat}/pay`);
            fetchList();
        } catch (err) {
            alert(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const handleDelete = async (maPhieuPhat) => {
        if (!window.confirm('Xác nhận xóa phiếu phạt này?')) return;
        try {
            await api.delete(`/punishment-slips/${maPhieuPhat}`);
            fetchList();
        } catch (err) {
            alert(err.response?.data?.message || 'Xóa thất bại');
        }
    };

    const filtered = list.filter(f => {
        const matchFilter = !filter || f.TrangThaiThanhToan === filter;
        const q = search.toLowerCase();
        const hoTen = f.BorrowingSlip?.Member?.HoTen || '';
        const matchSearch = !search ||
            f.MaPhieuPhat?.toLowerCase().includes(q) ||
            f.MaPhieu?.toLowerCase().includes(q) ||
            hoTen.toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    const tongChuaThanhToan = list
        .filter(f => f.TrangThaiThanhToan === 'Chưa thanh toán')
        .reduce((s, f) => s + (f.TongTienPhat || 0), 0);

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>⏳ Đang tải...</div>;
    if (error)   return <div style={{ padding: 40, textAlign: 'center', color: '#d9534f' }}>❌ {error}</div>;

    return (
        <div>
            {/* Tiêu đề + tổng tiền chưa thu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>💳 Quản lý Phiếu phạt</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Tổng: {list.length} phiếu phạt</p>
                </div>
                {isAdmin && (
                    <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '10px', padding: '12px 20px', textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#c62828' }}>Tổng tiền chưa thu</div>
                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#c62828' }}>
                            {tongChuaThanhToan.toLocaleString('vi-VN')} đ
                        </div>
                    </div>
                )}
            </div>

            {/* Filter + Search */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" placeholder="🔍  Tìm mã phiếu, độc giả..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', width: '260px' }} />
                {['', 'Chưa thanh toán', 'Đã thanh toán'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        border: `1px solid ${filter === s ? GREEN : '#ddd'}`,
                        background: filter === s ? GREEN : 'white',
                        color: filter === s ? 'white' : '#666'
                    }}>
                        {s || 'Tất cả'} ({s ? list.filter(f => f.TrangThaiThanhToan === s).length : list.length})
                    </button>
                ))}
            </div>

            {/* Bảng */}
            <div className="table-container">
                <table>
                    <thead><tr>
                        <th>Mã phiếu phạt</th>
                        <th>Ngày lập</th>
                        <th>Độc giả</th>
                        <th>Mã phiếu mượn</th>
                        <th>Cuốn sách</th>
                        <th>Hình phạt</th>
                        <th style={{ textAlign: 'right' }}>Số tiền</th>
                        <th style={{ textAlign: 'center' }}>Trạng thái</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr></thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(f => {
                            const hoTen = f.BorrowingSlip?.Member?.HoTen || '—';
                            const hs = hinhPhatStyle[f.TenHinhPhat] || { bg: '#eee', color: '#333' };
                            const ts = ttStyle[f.TrangThaiThanhToan] || { bg: '#eee', color: '#333' };
                            return (
                                <tr key={f.MaPhieuPhat}>
                                    <td><code style={{ background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{f.MaPhieuPhat}</code></td>
                                    <td style={{ color: '#777' }}>{f.NgayLapPhieu?.slice(0, 10)}</td>
                                    <td><strong>{hoTen}</strong></td>
                                    <td><code style={{ background: LIGHT, color: GREEN, padding: '2px 6px', borderRadius: '4px' }}>{f.MaPhieu}</code></td>
                                    <td><code style={{ fontSize: '12px', color: '#777' }}>{f.MaCuonSach}</code></td>
                                    <td><span style={{ background: hs.bg, color: hs.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{f.TenHinhPhat}</span></td>
                                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#c62828' }}>
                                        {(f.TongTienPhat || 0).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ background: ts.bg, color: ts.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                            {f.TrangThaiThanhToan}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'center' }}>
                                            {f.TrangThaiThanhToan === 'Chưa thanh toán' ? (
                                                <button onClick={() => handleThanhToan(f.MaPhieuPhat)} style={{
                                                    padding: '5px 12px', background: GREEN, color: 'white', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
                                                }}>
                                                    ✅ Thu tiền
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                    <span style={{ color: '#bbb', fontSize: '12px' }}>Đã xong</span>
                                                    <button onClick={() => handleDelete(f.MaPhieuPhat)} style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: '#e53935' }} title="Xóa">🗑️</button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={isAdmin ? 9 : 8} style={{ textAlign: 'center', padding: '32px', color: '#bbb' }}>Không có phiếu phạt nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PhieuPhatManagement;
