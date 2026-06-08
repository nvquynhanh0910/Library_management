import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const GREEN = '#7DA78C';
const LIGHT = '#e8f5ec';

const trangThaiStyle = {
    'Đang mượn': { bg: '#fff3e0', color: '#e65100' },
    'Đã trả':    { bg: '#e8f5e9', color: '#2e7d32' },
    'Quá hạn':   { bg: '#ffebee', color: '#c62828' },
};

// ──────────────────────────────────────────────
// Tab 1: Lập phiếu mượn
// ──────────────────────────────────────────────
const LapPhieuMuon = ({ user, phieuMuonList, setPhieuMuonList, muonSachList, setMuonSachList }) => {
    const today = new Date().toISOString().split('T')[0];
    const [docGiaId, setDocGiaId]   = useState('');
    const [hanTra,   setHanTra]     = useState('');
    const [hinhThuc, setHinhThuc]   = useState('Mang về');
    const [sachs,    setSachs]      = useState([{ MaCuonSach: '' }]);
    const [msg,      setMsg]        = useState(null);

    const addSach  = () => setSachs(p => [...p, { MaCuonSach: '' }]);
    const removeSach = (i) => setSachs(p => p.filter((_, idx) => idx !== i));
    const updateSach = (i, val) => setSachs(p => p.map((s, idx) => idx === i ? { ...s, MaCuonSach: val } : s));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate
        if (!docGiaId) { setMsg({ type: 'error', text: 'Vui lòng chọn độc giả!' }); return; }
        if (!hanTra || hanTra <= today) { setMsg({ type: 'error', text: 'Ngày hẹn trả phải sau hôm nay!' }); return; }
        const validSachs = sachs.filter(s => s.MaCuonSach.trim());
        if (!validSachs.length) { setMsg({ type: 'error', text: 'Vui lòng nhập ít nhất 1 mã cuốn sách!' }); return; }

        // Kiểm tra mã cuốn sách có tồn tại và đang sẵn sàng
        for (const s of validSachs) {
            const found = mockData.cuonsach.find(c => c.MaCuonSach === s.MaCuonSach);
            if (!found) { setMsg({ type: 'error', text: `Mã cuốn sách "${s.MaCuonSach}" không tồn tại!` }); return; }
            if (found.TrangThai !== 'Sẵn sàng') { setMsg({ type: 'error', text: `Sách "${s.MaCuonSach}" đang không sẵn sàng (${found.TrangThai})!` }); return; }
        }

        const docGia = mockData.docgia.find(d => d.MaThanhVien === docGiaId);
        const maxId  = phieuMuonList.reduce((m, p) => Math.max(m, parseInt(p.MaPhieu.replace('PM',''))), 0);
        const newMa  = `PM${String(maxId + 1).padStart(3,'0')}`;

        const newPhieu = {
            MaPhieu: newMa, NgayLapPhieu: today,
            MaThanhVien: docGiaId, HoTenDocGia: docGia?.HoTen || docGiaId,
            MaNhanVienLap: 'NV001', MaNhanVienThu: null, TrangThai: 'Đang mượn'
        };
        const newDetails = validSachs.map(s => {
            const ds = mockData.dausach.find(b => mockData.cuonsach.find(c => c.MaCuonSach === s.MaCuonSach && c.MaDauSach === b.MaDauSach));
            return { MaPhieu: newMa, MaCuonSach: s.MaCuonSach, TenSach: ds?.TenSach || '—', HinhThucMuon: hinhThuc, HanTra: hanTra, NgayTraThucTe: null, TinhTrangKhiTra: null, TienPhatPhatSinh: 0 };
        });

        setPhieuMuonList(p => [...p, newPhieu]);
        setMuonSachList(p => [...p, ...newDetails]);
        setMsg({ type: 'success', text: `✅ Tạo phiếu mượn ${newMa} thành công! (${validSachs.length} cuốn)` });
        setDocGiaId(''); setHanTra(''); setSachs([{ MaCuonSach: '' }]);
    };

    const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
    const labelStyle = { display: 'block', fontWeight: '600', fontSize: '13px', color: '#555', marginBottom: '5px' };

    return (
        <div style={{ maxWidth: '640px' }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '16px', borderBottom: `2px solid ${GREEN}`, paddingBottom: '10px' }}>📋 Lập Phiếu Mượn mới</h3>

            {msg && (
                <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: '500',
                    background: msg.type === 'success' ? LIGHT : '#ffebee',
                    color:      msg.type === 'success' ? '#2e7d32' : '#c62828',
                    border:     `1px solid ${msg.type === 'success' ? '#a5d6a7' : '#ef9a9a'}` }}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                {/* Chọn độc giả */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>👤 Độc giả mượn sách <span style={{ color: 'red' }}>*</span></label>
                    <select value={docGiaId} onChange={e => setDocGiaId(e.target.value)} style={{ ...inputStyle, background: 'white' }} required>
                        <option value="">-- Chọn độc giả --</option>
                        {mockData.docgia.map(d => <option key={d.MaThanhVien} value={d.MaThanhVien}>{d.MaThanhVien} - {d.HoTen}</option>)}
                    </select>
                </div>

                {/* Hạn trả & Hình thức */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div>
                        <label style={labelStyle}>📅 Ngày hẹn trả <span style={{ color: 'red' }}>*</span></label>
                        <input type="date" value={hanTra} min={today} onChange={e => setHanTra(e.target.value)} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>🔖 Hình thức mượn</label>
                        <select value={hinhThuc} onChange={e => setHinhThuc(e.target.value)} style={{ ...inputStyle, background: 'white' }}>
                            <option>Mang về</option>
                            <option>Tại chỗ</option>
                        </select>
                    </div>
                </div>

                {/* Danh sách sách mượn */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>📚 Mã cuốn sách mượn <span style={{ color: 'red' }}>*</span></label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {sachs.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    value={s.MaCuonSach}
                                    onChange={e => updateSach(i, e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                    placeholder={`VD: CS001_1`}
                                />
                                {sachs.length > 1 && (
                                    <button type="button" onClick={() => removeSach(i)} style={{ padding: '6px 10px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addSach} style={{ marginTop: '8px', padding: '7px 14px', background: LIGHT, color: GREEN, border: `1px dashed ${GREEN}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                        + Thêm sách
                    </button>
                    <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#aaa' }}>Sách có sẵn: {mockData.cuonsach.filter(c => c.TrangThai === 'Sẵn sàng').map(c => c.MaCuonSach).join(', ')}</p>
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: GREEN, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                    📄 Tạo phiếu mượn
                </button>
            </form>
        </div>
    );
};

// ──────────────────────────────────────────────
// Tab 2: Xử lý trả sách
// ──────────────────────────────────────────────
const TraSach = ({ phieuMuonList, setPhieuMuonList, muonSachList, setMuonSachList }) => {
    const today = new Date().toISOString().split('T')[0];
    const [maPhieu,    setMaPhieu]    = useState('');
    const [found,      setFound]      = useState(null);
    const [tinhTrang,  setTinhTrang]  = useState('Tốt');
    const [selectedCs, setSelectedCs] = useState([]);
    const [msg,        setMsg]        = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const phieu = phieuMuonList.find(p => p.MaPhieu === maPhieu.trim().toUpperCase());
        if (!phieu) { setFound(null); setMsg({ type: 'error', text: 'Không tìm thấy phiếu mượn!' }); return; }
        const details = muonSachList.filter(m => m.MaPhieu === phieu.MaPhieu && !m.NgayTraThucTe);
        setFound({ phieu, details });
        setSelectedCs(details.map(d => d.MaCuonSach));
        setMsg(null);
    };

    const toggleSelect = (ma) => setSelectedCs(p => p.includes(ma) ? p.filter(x => x !== ma) : [...p, ma]);

    const handleConfirmReturn = () => {
        if (!selectedCs.length) { setMsg({ type: 'error', text: 'Chưa chọn cuốn sách nào để trả!' }); return; }
        const hanTra  = found.details[0]?.HanTra;
        const isLate  = today > hanTra;
        const dayLate = isLate ? Math.ceil((new Date(today) - new Date(hanTra)) / 86400000) : 0;
        const fine    = dayLate * 5000;

        setMuonSachList(p => p.map(m =>
            selectedCs.includes(m.MaCuonSach) && m.MaPhieu === found.phieu.MaPhieu
                ? { ...m, NgayTraThucTe: today, TinhTrangKhiTra: tinhTrang, TienPhatPhatSinh: fine }
                : m
        ));

        const allReturned = muonSachList.filter(m => m.MaPhieu === found.phieu.MaPhieu).every(m => selectedCs.includes(m.MaCuonSach) || m.NgayTraThucTe);
        if (allReturned) setPhieuMuonList(p => p.map(pm => pm.MaPhieu === found.phieu.MaPhieu ? { ...pm, TrangThai: isLate ? 'Quá hạn' : 'Đã trả' } : pm));

        setMsg({ type: 'success', text: `✅ Xác nhận trả thành công! ${isLate ? `Tiền phạt: ${fine.toLocaleString('vi-VN')}đ (${dayLate} ngày trễ)` : 'Trả đúng hạn.'}` });
        setFound(null); setMaPhieu(''); setSelectedCs([]);
    };

    const inputStyle = { padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' };

    return (
        <div style={{ maxWidth: '680px' }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '16px', borderBottom: `2px solid ${GREEN}`, paddingBottom: '10px' }}>↩️ Xử lý Trả sách</h3>

            {msg && (
                <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: '500',
                    background: msg.type === 'success' ? LIGHT : '#ffebee',
                    color:      msg.type === 'success' ? '#2e7d32' : '#c62828' }}>
                    {msg.text}
                </div>
            )}

            {/* Tìm phiếu mượn */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input value={maPhieu} onChange={e => setMaPhieu(e.target.value)} style={{ ...inputStyle, width: '220px' }} placeholder="Nhập mã phiếu (VD: PM001)" />
                <button type="submit" style={{ padding: '9px 20px', background: GREEN, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>🔍 Tra cứu</button>
            </form>

            {/* Kết quả */}
            {found && (
                <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                    {/* Thông tin phiếu */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px', padding: '14px', background: '#f9f9f9', borderRadius: '8px' }}>
                        {[['Mã phiếu', found.phieu.MaPhieu], ['Độc giả', found.phieu.HoTenDocGia], ['Ngày lập', found.phieu.NgayLapPhieu]].map(([k, v]) => (
                            <div key={k}>
                                <div style={{ fontSize: '11px', color: '#999', marginBottom: '2px' }}>{k}</div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{v}</div>
                            </div>
                        ))}
                    </div>

                    {/* Danh sách sách */}
                    <p style={{ fontWeight: '600', fontSize: '13px', color: '#555', marginBottom: '10px' }}>Chọn cuốn sách cần trả:</p>
                    {found.details.length === 0
                        ? <p style={{ color: '#aaa', textAlign: 'center', padding: '16px' }}>Tất cả sách trong phiếu đã được trả.</p>
                        : found.details.map(d => (
                            <div key={d.MaCuonSach} onClick={() => toggleSelect(d.MaCuonSach)} style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '6px',
                                border: `1px solid ${selectedCs.includes(d.MaCuonSach) ? GREEN : '#eee'}`,
                                background: selectedCs.includes(d.MaCuonSach) ? LIGHT : 'white'
                            }}>
                                <input type="checkbox" checked={selectedCs.includes(d.MaCuonSach)} onChange={() => {}} style={{ width: 16, height: 16, accentColor: GREEN }} />
                                <div style={{ flex: 1 }}>
                                    <strong style={{ fontSize: '14px' }}>{d.TenSach}</strong>
                                    <div style={{ fontSize: '12px', color: '#888' }}>Mã: {d.MaCuonSach} · Hạn trả: {d.HanTra} · Hình thức: {d.HinhThucMuon}</div>
                                </div>
                                {today > d.HanTra && <span style={{ background: '#ffebee', color: '#c62828', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>⚠️ Quá hạn</span>}
                            </div>
                        ))
                    }

                    {found.details.length > 0 && (
                        <>
                            <div style={{ marginTop: '14px', marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#555', marginBottom: '6px' }}>Tình trạng sách khi trả:</label>
                                <select value={tinhTrang} onChange={e => setTinhTrang(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: 'white', width: '200px' }}>
                                    {['Tốt', 'Có hư hỏng nhẹ', 'Hư hỏng nặng', 'Mất sách'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <button onClick={handleConfirmReturn} style={{ width: '100%', padding: '12px', background: GREEN, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                                ✅ Xác nhận trả sách ({selectedCs.length} cuốn)
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

// ──────────────────────────────────────────────
// Tab 3: Danh sách tất cả phiếu mượn
// ──────────────────────────────────────────────
const DanhSachPhieu = ({ phieuMuonList }) => {
    const [filter, setFilter] = useState('');

    const filtered = phieuMuonList.filter(p =>
        !filter || p.TrangThai === filter
    );

    return (
        <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['', 'Đang mượn', 'Đã trả', 'Quá hạn'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        border: `1px solid ${filter === s ? GREEN : '#ddd'}`,
                        background: filter === s ? GREEN : 'white',
                        color: filter === s ? 'white' : '#666'
                    }}>
                        {s || 'Tất cả'} ({s ? phieuMuonList.filter(p => p.TrangThai === s).length : phieuMuonList.length})
                    </button>
                ))}
            </div>

            <div className="table-container">
                <table>
                    <thead><tr>
                        <th>Mã phiếu</th><th>Ngày lập</th><th>Độc giả</th><th>NV lập</th><th>Trạng thái</th>
                    </tr></thead>
                    <tbody>
                        {filtered.map(p => {
                            const s = trangThaiStyle[p.TrangThai] || { bg: '#eee', color: '#333' };
                            return (
                                <tr key={p.MaPhieu}>
                                    <td><code style={{ background: LIGHT, color: GREEN, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{p.MaPhieu}</code></td>
                                    <td>{p.NgayLapPhieu}</td>
                                    <td><strong>{p.HoTenDocGia}</strong></td>
                                    <td style={{ color: '#777' }}>{p.MaNhanVienLap}</td>
                                    <td><span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{p.TrangThai}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════
const MuonSachManagement = ({ user }) => {
    const [tab,           setTab]           = useState('lap');
    const [phieuMuonList, setPhieuMuonList] = useState(mockData.phieumuon);
    const [muonSachList,  setMuonSachList]  = useState(mockData.muonsach);

    const tabs = [
        { key: 'lap',    label: '📋 Lập phiếu mượn' },
        { key: 'tra',    label: '↩️ Trả sách'       },
        { key: 'danhsach', label: '📃 Danh sách phiếu' },
    ];

    return (
        <div>
            <h2 style={{ margin: '0 0 20px', color: '#222' }}>📦 Quản lý Mượn - Trả sách</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid #eee' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.key ? '700' : '400',
                        color: tab === t.key ? GREEN : '#777',
                        borderBottom: tab === t.key ? `3px solid ${GREEN}` : '3px solid transparent',
                        marginBottom: '-2px', transition: 'all .15s'
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'lap'     && <LapPhieuMuon      user={user} phieuMuonList={phieuMuonList} setPhieuMuonList={setPhieuMuonList} muonSachList={muonSachList} setMuonSachList={setMuonSachList} />}
            {tab === 'tra'     && <TraSach            phieuMuonList={phieuMuonList} setPhieuMuonList={setPhieuMuonList} muonSachList={muonSachList} setMuonSachList={setMuonSachList} />}
            {tab === 'danhsach'&& <DanhSachPhieu      phieuMuonList={phieuMuonList} />}
        </div>
    );
};

export default MuonSachManagement;
