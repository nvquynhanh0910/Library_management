import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const BookItemsManagement = ({ user }) => {
    const [bookItems, setBookItems] = useState(mockData.cuonsach);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [newItem, setNewItem] = useState({ MaDauSach: '', TinhTrang: 'Mới', TrangThai: 'Sẵn sàng' });
    const [soLuongThem, setSoLuongThem] = useState(1);

    const isAdmin = user?.role === 'admin';

    //  Hàm này sẽ bắn gói tin lô dữ liệu lên API
    const handleAddBookItem = (e) => {
        e.preventDefault();
        if (!newItem.MaDauSach) { alert("Vui lòng chọn Đầu sách!"); return; }

        const payloadToBackend = {
            maDauSach: newItem.MaDauSach,
            tinhTrangBanDau: newItem.TinhTrang,
            trangThaiBanDau: newItem.TrangThai,
            soLuongXuatBan: parseInt(soLuongThem, 10)
        };

        /* LUỒNG API THỰC TẾ:
        const response = await axios.post('http://localhost:5000/api/book-items/bulk', payloadToBackend);
        if(response.data.success) {
            setBookItems([...bookItems, ...response.data.listNewBarcode]); // Nhận mảng các mã đã tạo từ database đổ vào bảng
        }
        */

        // Giả lập chạy tạm ở Frontend cho đồ án mẫu:
        const targetedDauSach = mockData.dausach.find(b => b.MaDauSach === newItem.MaDauSach);
        const targetNumber = newItem.MaDauSach.replace('DS', '');
        let currentCopiesCount = bookItems.filter(item => item.MaDauSach === newItem.MaDauSach).length;
        const fakeNewItems = [];

        for (let i = 0; i < parseInt(soLuongThem, 10); i++) {
            currentCopiesCount++;
            const generatedBarcode = `CS${targetNumber}_${currentCopiesCount}`;
            fakeNewItems.push({
                MaCuonSach: generatedBarcode,
                MaDauSach: newItem.MaDauSach,
                TenSach: targetedDauSach ? targetedDauSach.TenSach : "Sách nhập lô bổ sung",
                TinhTrang: newItem.TinhTrang,
                TrangThai: newItem.TrangThai
            });
        }

        setBookItems([...bookItems, ...fakeNewItems]);
        setIsAddModalOpen(false);
        setSoLuongThem(1);
        //alert(`🎉 Frontend đã đóng gói yêu cầu gửi Backend tạo tự động ${soLuongThem} cuốn sách!`);
    };

    const filteredItems = bookItems.filter(item => {
        const matchesSearch =
            item.MaCuonSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.MaDauSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.TenSach && item.TenSach.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "" || item.TrangThai === statusFilter;
        return matchesStatus && matchesSearch;
    });

    const getStatusStyle = (trangThai) => {
        switch (trangThai) {
            case "Sẵn sàng": return { background: '#e8f5e9', color: '#2e7d32' };
            case "Đang mượn": return { background: '#fff3e0', color: '#ef6c00' };
            case "Đã mất": return { background: '#ffebee', color: '#c62828' };
            default: return { background: '#eee', color: '#333' };
        }
    };

    return (
        <div className="book-item-page">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>📖 Hệ thống Quản lý Cuốn sách (Bản sao)</h2>
                {isAdmin && (
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ backgroundColor: '#7DA78C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                        + Nhập lô bản sao mới
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="filter-bar" style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Tìm mã cuốn, mã đầu sách hoặc tên sách..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}>
                    <option value="">Tất cả Trạng thái</option>
                    <option value="Sẵn sàng">Sẵn sàng</option>
                    <option value="Đang mượn">Đang mượn</option>
                    <option value="Đã mất">Đã mất</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Mã Cuốn Sách (Barcode)</th><th>Mã Đầu Sách</th><th>Tên sách</th><th>Tình trạng vật lý</th><th>Trạng thái lưu thông</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map((item) => (
                        <tr key={item.MaCuonSach}>
                            <td><code>{item.MaCuonSach}</code></td>
                            <td><strong>{item.MaDauSach}</strong></td>
                            <td>{item.TenSach}</td>
                            <td>{item.TinhTrang}</td>
                            <td><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', ...getStatusStyle(item.TrangThai) }}>{item.TrangThai}</span></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isAddModalOpen && isAdmin && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '2px solid #7DA78C', paddingBottom: '10px' }}>📦 Nhập kho lô bản sao sách</h3>
                        <form onSubmit={handleAddBookItem}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Chọn đầu sách nhập bổ sung:</label>
                                <select value={newItem.MaDauSach} onChange={e => setNewItem({ ...newItem, MaDauSach: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }} required>
                                    <option value="">-- Chọn đầu sách nhận bản sao --</option>
                                    {mockData.dausach.map(b => (
                                        <option key={b.MaDauSach} value={b.MaDauSach}>{b.MaDauSach} - {b.TenSach}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Chất lượng:</label>
                                    <select value={newItem.TinhTrang} onChange={e => setNewItem({ ...newItem, TinhTrang: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <option value="Mới">Mới</option><option value="Cũ">Cũ</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Trạng thái:</label>
                                    <select value={newItem.TrangThai} onChange={e => setNewItem({ ...newItem, TrangThai: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <option value="Sẵn sàng">Sẵn sàng</option><option value="Đang mượn">Đang mượn</option>
                                    </select>
                                </div>
                            </div>

                            {/* Ô NHẬP SỐ LƯỢNG LÔ MỚI THÊM */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#2e7d32' }}>Số lượng bản sao nhập thêm:</label>
                                <input type="number" min="1" max="100" value={soLuongThem} onChange={e => setSoLuongThem(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #7DA78C', fontWeight: 'bold' }} required />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '4px' }}>Hủy</button>
                                <button type="submit" style={{ padding: '8px 15px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Xác nhận nhập kho</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookItemsManagement;