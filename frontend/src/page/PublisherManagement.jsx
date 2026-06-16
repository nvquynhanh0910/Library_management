import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PublisherManagement = ({ user }) => {
    const [publishers, setPublishers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPub, setEditingPub] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPublisher, setNewPublisher] = useState({ TenNXB: '', DiaChi: '', SoDienThoai: '' });

    const isAdmin = user?.role === 'admin';

    const fetchPublishers = async () => {
        try {
            setLoading(true); setError('');
            const res = await api.get('/publishers');
            setPublishers(res.data);
        } catch (err) {
            setError('Không thể tải danh sách NXB: ' + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchPublishers(); }, []);

    const handleDelete = async (maNXB, tenNXB) => {
        if (!window.confirm(`Xác nhận xóa NXB "${tenNXB}"? Thông tin NXB của đầu sách liên quan sẽ về 'Trống'.`)) return;
        try {
            await api.delete(`/publishers/${maNXB}`);
            alert('Xóa NXB thành công!');
            fetchPublishers();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Xóa thất bại!')); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/publishers/${editingPub.MaNXB}`, {
                TenNXB: editingPub.TenNXB,
                DiaChi: editingPub.DiaChi,
                SoDienThoai: editingPub.SoDienThoai
            });
            alert('Cập nhật NXB thành công!');
            setIsModalOpen(false);
            fetchPublishers();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Cập nhật thất bại!')); }
    };

    const handleAddPublisher = async (e) => {
        e.preventDefault();
        try {
            await api.post('/publishers', newPublisher);
            alert('🎉 Thêm NXB thành công!');
            setIsAddModalOpen(false);
            setNewPublisher({ TenNXB: '', DiaChi: '', SoDienThoai: '' });
            fetchPublishers();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Thêm thất bại!')); }
    };

    const filtered = publishers.filter(p =>
        (p.TenNXB || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.DiaChi  || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🏢 Quản lý Danh mục Nhà xuất bản</h2>
                {isAdmin && <button onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>+ Thêm NXB</button>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Tìm theo tên hoặc địa chỉ NXB..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#888' }}>⏳ Đang tải dữ liệu...</p>}
            {error   && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={th}>Mã NXB</th>
                                <th style={th}>Tên Nhà Xuất Bản</th>
                                <th style={th}>Địa Chỉ</th>
                                <th style={th}>Số Điện Thoại</th>
                                {isAdmin && <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu</td></tr>
                            ) : filtered.map(p => (
                                <tr key={p.MaNXB} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={td}><code>{p.MaNXB}</code></td>
                                    <td style={td}><strong>{p.TenNXB}</strong></td>
                                    <td style={td}>{p.DiaChi || <em style={{ color: '#bbb' }}>Trống</em>}</td>
                                    <td style={td}>{p.SoDienThoai || <em style={{ color: '#bbb' }}>Trống</em>}</td>
                                    {isAdmin && (
                                        <td style={{ ...td, textAlign: 'center' }}>
                                            <button onClick={() => { setEditingPub({...p}); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                            <button onClick={() => handleDelete(p.MaNXB, p.TenNXB)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL THÊM */}
            {isAddModalOpen && isAdmin && (
                <div style={overlay}>
                    <div style={modal}>
                        <h3>➕ Thêm Nhà xuất bản</h3>
                        <form onSubmit={handleAddPublisher}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={label}>Tên NXB:</label>
                                <input type="text" value={newPublisher.TenNXB} onChange={e => setNewPublisher({...newPublisher, TenNXB: e.target.value})} style={input} required />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={label}>Địa chỉ:</label>
                                <input type="text" value={newPublisher.DiaChi} onChange={e => setNewPublisher({...newPublisher, DiaChi: e.target.value})} style={input} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={label}>Số điện thoại:</label>
                                <input type="text" value={newPublisher.SoDienThoai} onChange={e => setNewPublisher({...newPublisher, SoDienThoai: e.target.value})} style={input} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} style={btnCancel}>Hủy</button>
                                <button type="submit" style={btnSave}>Lưu thông tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL SỬA */}
            {isModalOpen && editingPub && (
                <div style={overlay}>
                    <div style={modal}>
                        <h3>✏️ Sửa NXB: {editingPub.MaNXB}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={label}>Tên NXB:</label>
                                <input type="text" value={editingPub.TenNXB} onChange={e => setEditingPub({...editingPub, TenNXB: e.target.value})} style={input} required />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={label}>Địa chỉ:</label>
                                <input type="text" value={editingPub.DiaChi || ''} onChange={e => setEditingPub({...editingPub, DiaChi: e.target.value})} style={input} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={label}>Số điện thoại:</label>
                                <input type="text" value={editingPub.SoDienThoai || ''} onChange={e => setEditingPub({...editingPub, SoDienThoai: e.target.value})} style={input} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={btnCancel}>Hủy</button>
                                <button type="submit" style={btnSave}>Lưu thay đổi</button>
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
const overlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modal = { background: 'white', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const label = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const input = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnCancel = { padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnSave = { padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default PublisherManagement;
