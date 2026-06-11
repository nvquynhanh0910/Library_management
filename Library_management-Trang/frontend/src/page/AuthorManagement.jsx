import React, { useState } from 'react';
import {mockData} from "../data/mockdata.js";

const AuthorManagement = ({ user }) => {
    const [authors, setAuthors] = useState(mockData.tacgia);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);

    const isAdmin = user?.role === 'admin';

    const handleDelete = (maTG) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tác giả này khỏi hệ thống danh mục không?")) {
            setAuthors(authors.filter(a => a.MaTacGia !== maTG));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setAuthors(authors.map(a => a.MaTacGia === editingAuthor.MaTacGia ? editingAuthor : a));
        setIsModalOpen(false);
    };

    const filtered = authors.filter(a =>
        a.TenTacGia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.QuocTich.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>✍️ Quản lý Danh mục Tác giả</h2>
                {isAdmin && <button className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>+ Thêm tác giả</button>}
            </div>

            <div className="filter-bar" style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Tìm kiếm tác giả hoặc quốc tịch..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Mã Tác Giả</th>
                        <th>Tên Tác Giả</th>
                        <th>Quốc Tịch</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(a => (
                        <tr key={a.MaTacGia}>
                            <td><code>{a.MaTacGia}</code></td>
                            <td><strong>{a.TenTacGia}</strong></td>
                            <td>{a.QuocTich}</td>
                            {isAdmin && (
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => { setEditingAuthor({...a}); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => handleDelete(a.MaTacGia)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL SỬA TÁC GIẢ */}
            {isModalOpen && editingAuthor && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
                        <h3>✏️ Sửa Tác Giả: {editingAuthor.MaTacGia}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên tác giả:</label>
                                <input type="text" value={editingAuthor.TenTacGia} onChange={e => setEditingAuthor({...editingAuthor, TenTacGia: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quốc tịch:</label>
                                <input type="text" value={editingAuthor.QuocTich} onChange={e => setEditingAuthor({...editingAuthor, QuocTich: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px' }}>Hủy</button>
                                <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px' }}>Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorManagement;