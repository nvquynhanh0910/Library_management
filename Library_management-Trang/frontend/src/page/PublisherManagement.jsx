import React, { useState } from 'react';
import {mockData} from "../data/mockdata.js";

const PublisherManagement = ({ user }) => {
    const [publishers, setPublishers] = useState(mockData.nhaxuatban);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPub, setEditingPub] = useState(null);

    const isAdmin = user?.role === 'admin';

    const handleDelete = (maNXB) => {
        if (window.confirm("Xóa Nhà xuất bản có thể ảnh hưởng đến thông tin đầu sách. Bạn chắc chắn muốn xóa?")) {
            setPublishers(publishers.filter(p => p.MaNXB !== maNXB));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setPublishers(publishers.map(p => p.MaNXB === editingPub.MaNXB ? editingPub : p));
        setIsModalOpen(false);
    };

    const filtered = publishers.filter(p =>
        p.TenNXB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.DiaChi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="management-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🏢 Quản lý Danh mục Nhà xuất bản</h2>
                {isAdmin && <button className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>+ Thêm NXB</button>}
            </div>

            <div className="filter-bar" style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Tìm theo tên hoặc địa chỉ NXB..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Mã NXB</th>
                        <th>Tên Nhà Xuất Bản</th>
                        <th>Địa Chỉ</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(p => (
                        <tr key={p.MaNXB}>
                            <td><code>{p.MaNXB}</code></td>
                            <td><strong>{p.TenNXB}</strong></td>
                            <td>{p.DiaChi}</td>
                            {isAdmin && (
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => { setEditingPub({...p}); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                                    <button onClick={() => handleDelete(p.MaNXB)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>🗑️</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL SỬA NXB */}
            {isModalOpen && editingPub && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '450px' }}>
                        <h3>✏️ Sửa Nhà Xuất Bản: {editingPub.MaNXB}</h3>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên NXB:</label>
                                <input type="text" value={editingPub.TenNXB} onChange={e => setEditingPub({...editingPub, TenNXB: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Địa chỉ:</label>
                                <input type="text" value={editingPub.DiaChi} onChange={e => setEditingPub({...editingPub, DiaChi: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
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

export default PublisherManagement;