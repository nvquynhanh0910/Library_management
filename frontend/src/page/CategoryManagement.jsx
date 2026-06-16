import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CategoryManagement = ({ user }) => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const isAdmin = user?.role === 'admin';

    const fetchCategories = async () => {
        try {
            setLoading(true); setError('');
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            setError('Không thể tải danh sách thể loại: ' + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async (maTL, tenTL) => {
        if (!window.confirm(`Xóa thể loại "${tenTL}" sẽ ảnh hưởng đến các đầu sách liên quan. Bạn vẫn muốn xóa?`)) return;
        try {
            await api.delete(`/categories/${maTL}`);
            alert('Xóa thể loại thành công!');
            fetchCategories();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Xóa thất bại!')); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/categories/${editingCategory.MaTheLoai}`, { TenTheLoai: editingCategory.TenTheLoai });
            alert('Cập nhật thể loại thành công!');
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Cập nhật thất bại!')); }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { TenTheLoai: newCategoryName });
            alert('🎉 Thêm thể loại thành công!');
            setIsAddModalOpen(false);
            setNewCategoryName("");
            fetchCategories();
        } catch (err) { alert('❌ ' + (err.response?.data?.message || 'Thêm thất bại!')); }
    };

    const filtered = categories.filter(cat =>
        (cat.TenTheLoai || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.MaTheLoai  || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🏷️ Quản lý Danh mục Thể loại</h2>
                {isAdmin && <button onClick={() => setIsAddModalOpen(true)} style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>+ Thêm thể loại</button>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Tìm theo mã hoặc tên thể loại..." value={searchTerm}
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
                                <th style={th}>Mã Thể Loại</th>
                                <th style={th}>Tên Thể Loại</th>
                                {isAdmin && <th style={{ ...th, textAlign: 'center' }}>Thao tác</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 3 : 2} style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Không có dữ liệu</td></tr>
                            ) : filtered.map(cat => (
                                <tr key={cat.MaTheLoai} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={td}><code>{cat.MaTheLoai}</code></td>
                                    <td style={td}><strong>{cat.TenTheLoai}</strong></td>
                                    {isAdmin && (
                                        <td style={{ ...td, textAlign: 'center' }}>
                                            <button onClick={() => { setEditingCategory({...cat}); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                            <button onClick={() => handleDelete(cat.MaTheLoai, cat.TenTheLoai)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
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
                        <h3>➕ Thêm Thể Loại</h3>
                        <form onSubmit={handleAddCategory}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={label}>Tên thể loại mới:</label>
                                <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} style={input} required />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} style={btnCancel}>Hủy</button>
                                <button type="submit" style={btnSave}>Thêm mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL SỬA */}
            {isModalOpen && editingCategory && (
                <div style={overlay}>
                    <div style={modal}>
                        <h3>✏️ Sửa Thể Loại: {editingCategory.MaTheLoai}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={label}>Tên thể loại:</label>
                                <input type="text" value={editingCategory.TenTheLoai} onChange={e => setEditingCategory({...editingCategory, TenTheLoai: e.target.value})} style={input} required />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={btnCancel}>Hủy</button>
                                <button type="submit" style={btnSave}>Lưu</button>
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

export default CategoryManagement;
