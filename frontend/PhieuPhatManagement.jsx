import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const G  = '#7DA78C';
const GL = '#e8f5ec';

const HP_STYLE = {
    'Phạt quá hạn': { background: '#fff3e0', color: '#e65100' },
    'Phạt hư hỏng': { background: '#ffebee', color: '#c62828' },
};
const TT_STYLE = {
    'Chưa thanh toán': { background: '#ffebee', color: '#c62828' },
    'Đã thanh toán':   { background: GL,        color: '#2e7d32' },
};

const PhieuPhatManagement = ({ user }) => {
    const [list,   setList]   = useState(mockData.phieuPhat);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const isAdmin = user?.role === 'admin';

    const doThanhToan = (ma) => {
        if (window.confirm('Xác nhận đánh dấu phiếu phạt này là Đã thanh toán?'))
            setList(p => p.map(f => f.MaPhieuPhat === ma ? { ...f, TrangThaiThanhToan: 'Đã thanh toán' } : f));
    };

    const filtered = list.filter(f => {
        const matchFilter = !filter || f.TrangThaiThanhToan === filter;
        const matchSearch = !search || [f.MaPhieuPhat, f.HoTenDocGia, f.MaPhieu].some(s => s.toLowerCase().includes(search.toLowerCase()));
        return matchFilter && matchSearch;
    });

    const tongChuaThu = list.filter(f => f.TrangThaiThanhToan === 'Chưa thanh toán').reduce((s, f) => s + f.TongTienPhat, 0);

    return (
        <div>
            {/* Tiêu đề + tổng tiền */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>💳 Quản lý Phiếu phạt</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#999' }}>Tổng: {list.length} phiếu</p>
                </div>
                <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '10px', padding: '10px 18px', textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#c62828', marginBottom: '2px' }}>Tổng tiền chưa thu</div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#c62828' }}>{tongChuaThu.toLocaleString('vi-VN')} đ</div>
                </div>
            </div>

            {/* Tìm kiếm + bộ lọc */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" placeholder="🔍  Tìm mã phiếu, độc giả..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ padding: '9px 13px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', width: '240px' }} />
                {['', 'Chưa thanh toán', 'Đã thanh toán'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: `1px solid ${filter === s ? G : '#ddd'}`, background: filter === s ? G : 'white', color: filter === s ? 'white' : '#777' }}>
                        {s || 'Tất cả'}
                    </button>
                ))}
            </div>

            {/* Bảng */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã phiếu phạt</th>
                            <th>Ngày lập</th>
                            <th>Độc giả</th>
                            <th>Phiếu mượn</th>
                            <th>Hình phạt</th>
                            <th style={{ textAlign: 'right' }}>Số tiền</th>
                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                            {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(f => {
                            const hs = HP_STYLE[f.TenHinhPhat] || { background: '#eee', color: '#555' };
                            const ts = TT_STYLE[f.TrangThaiThanhToan] || { background: '#eee', color: '#555' };
                            return (
                                <tr key={f.MaPhieuPhat}>
                                    <td><code style={{ background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{f.MaPhieuPhat}</code></td>
                                    <td style={{ color: '#777' }}>{f.NgayLapPhieu}</td>
                                    <td><strong>{f.HoTenDocGia}</strong></td>
                                    <td><code style={{ background: GL, color: G, padding: '2px 6px', borderRadius: '4px' }}>{f.MaPhieu}</code></td>
                                    <td><span style={{ ...hs, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{f.TenHinhPhat}</span></td>
                                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#c62828' }}>{f.TongTienPhat.toLocaleString('vi-VN')} đ</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ ...ts, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{f.TrangThaiThanhToan}</span>
                                    </td>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'center' }}>
                                            {f.TrangThaiThanhToan === 'Chưa thanh toán'
                                                ? <button onClick={() => doThanhToan(f.MaPhieuPhat)} style={{ padding: '5px 12px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✅ Thu tiền</button>
                                                : <span style={{ color: '#ccc', fontSize: '12px' }}>Đã xong</span>
                                            }
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '28px', color: '#ccc' }}>Không có phiếu phạt nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PhieuPhatManagement;
