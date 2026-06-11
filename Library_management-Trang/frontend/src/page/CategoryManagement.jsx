import React, { useState } from 'react';
import {mockData} from "../data/mockdata.js";

const CategoryManagement = ({ user }) => {
    const [categories, setCategories] = useState(mockData.theloai);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const isAdmin = user?.role === 'admin';

    // Xử lý xóa
    const handleDelete = (maTL) => {
        if (window.confirm(`Xóa thể loại này sẽ ảnh hưởng đến các đầu sách liên quan. Bạn vẫn muốn xóa?`)) {
            setCategories(categories.filter(cat => cat.MaTheLoai !== maTL));
        }
    };

    // Mở form sửa
    const handleOpenModal = (cat) => {
        setEditingCategory({ ...cat });
        setIsModalOpen(true);
    };

    // Lưu sửa đổi
    const handleSave = (e) => {
        e.preventDefault();
        setCategories(categories.map(cat => cat.MaTheLoai === editingCategory.MaTheLoai ? editingCategory : cat));
        setIsModalOpen(false);
    };

    // Lọc tìm kiếm
    const filtered = categories.filter(cat =>
        cat.TenTheLoai.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.MaTheLoai.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🏷️ Quản lý Danh mục Thể loại</h2>
                {isAdmin && <button className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>+ Thêm thể loại</button>}
            </div>

            <div className="filter-bar" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Tìm theo mã hoặc tên thể loại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Mã Thể Loại</th>
                        <th>Tên Thể Loại</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(cat => (
                        <tr key={cat.MaTheLoai}>
                            <td><code>{cat.MaTheLoai}</code></td>
                            <td><strong>{cat.TenTheLoai}</strong></td>
                            {isAdmin && (
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => handleOpenModal(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => handleDelete(cat.MaTheLoai)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL SỬA */}
            {isModalOpen && editingCategory && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
                        <h3>✏️ Sửa Thể Loại: {editingCategory.MaTheLoai}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên thể loại:</label>
                                <input type="text" value={editingCategory.TenTheLoai} onChange={e => setEditingCategory({...editingCategory, TenTheLoai: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px' }}>Hủy</button>
                                <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px' }}>Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;