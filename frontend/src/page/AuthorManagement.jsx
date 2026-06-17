import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AuthorManagement = ({ user }) => {
    const [authors, setAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAuthor, setNewAuthor] = useState({ TenTacGia: '', QuocTich: '' });

    const isAdmin = user?.role === 'admin';

    const fetchAuthors = async () => {
        try {
            setLoading(true); setError('');
            const res = await api.get('/authors');
            setAuthors(res.data);
        } catch (err) {
            setError('Không thể tải danh sách tác giả: ' + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchAuthors(); }, []);

    const handleDelete = async (maTG, tenTG) => {
        if (!window.confirm(`Xác nhận xóa tác giả "${tenTG}"? Toàn bộ đầu sách liên quan sẽ được cập nhật.`)) return;
        try {
            await api.delete(`/authors/${maTG}`);
            alert('Xóa tác giả thành công!');
            fetchAuthors();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Xóa thất bại!')); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/authors/${editingAuthor.MaTacGia}`, {
                TenTacGia: editingAuthor.TenTacGia,
                QuocTich: editingAuthor.QuocTich
            });
            alert('Cập nhật tác giả thành công!');
            setIsModalOpen(false);
            fetchAuthors();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Cập nhật thất bại!')); }
    };

    const handleAddAuthor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/authors', newAuthor);
            alert('🎉 Thêm tác giả thành công!');
            setIsAddModalOpen(false);
            setNewAuthor({ TenTacGia: '', QuocTich: '' });
            fetchAuthors();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Thêm thất bại!')); }
    };

    const filtered = authors.filter(a =>
        (a.TenTacGia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.QuocTich  || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>✍️ Quản lý Danh mục Tác giả</h2>
                {isAdmin && <button onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>+ Thêm tác giả</button>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Tìm kiếm tác giả hoặc quốc tịch..." value={searchTerm}
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
                                <th style={th}>Mã Tác Giả</th>
                                <th style={th}>Tên Tác Giả</th>
                                <th style={th}>Quốc Tịch</th>
                                {isAdmin && <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 4 : 3} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu</td></tr>
                            ) : filtered.map(a => (
                                <tr key={a.MaTacGia} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={td}><code>{a.MaTacGia}</code></td>
                                    <td style={td}><strong>{a.TenTacGia}</strong></td>
                                    <td style={td}>{a.QuocTich || <em style={{ color: '#bbb' }}>Trống</em>}</td>
                                    {isAdmin && (
                                        <td style={{ ...td, textAlign: 'center' }}>
                                            <button onClick={() => { setEditingAuthor({...a}); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                            <button onClick={() => handleDelete(a.MaTacGia, a.TenTacGia)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
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
                        <h3>➕ Thêm Hồ Sơ Tác Giả</h3>
                        <form onSubmit={handleAddAuthor}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={label}>Tên tác giả:</label>
                                <input type="text" value={newAuthor.TenTacGia} onChange={e => setNewAuthor({...newAuthor, TenTacGia: e.target.value})} style={input} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={label}>Quốc tịch:</label>
                                <input type="text" value={newAuthor.QuocTich} onChange={e => setNewAuthor({...newAuthor, QuocTich: e.target.value})} style={input} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} style={btnCancel}>Hủy</button>
                                <button type="submit" style={btnSave}>Lưu dữ liệu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL SỬA */}
            {isModalOpen && editingAuthor && (
                <div style={overlay}>
                    <div style={modal}>
                        <h3>✏️ Sửa Tác Giả: {editingAuthor.MaTacGia}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={label}>Tên tác giả:</label>
                                <input type="text" value={editingAuthor.TenTacGia} onChange={e => setEditingAuthor({...editingAuthor, TenTacGia: e.target.value})} style={input} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={label}>Quốc tịch:</label>
                                <input type="text" value={editingAuthor.QuocTich || ''} onChange={e => setEditingAuthor({...editingAuthor, QuocTich: e.target.value})} style={input} />
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
const modal = { background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };
const label = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const input = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnCancel = { padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnSave = { padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default AuthorManagement;
