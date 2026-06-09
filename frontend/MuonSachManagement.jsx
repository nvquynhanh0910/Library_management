import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const G  = '#7DA78C';
const GL = '#e8f5ec';
const TODAY = new Date().toISOString().split('T')[0];

const TT_STYLE = {
    'Đang mượn': { background: '#fff3e0', color: '#e65100' },
    'Đã trả':    { background: '#e8f5e9', color: '#2e7d32' },
    'Quá hạn':   { background: '#ffebee', color: '#c62828' },
};

const Alert = ({ msg }) => {
    if (!msg) return null;
    const ok = msg.type === 'success';
    return (
        <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: '500', border: `1px solid ${ok ? '#a5d6a7' : '#ef9a9a'}`, background: ok ? GL : '#ffebee', color: ok ? '#2e7d32' : '#c62828' }}>
            {msg.text}
        </div>
    );
};

const LapPhieuMuon = ({ phieuList, setPhieuList, muonList, setMuonList }) => {
    const [docGiaId, setDocGiaId] = useState('');
    const [hanTra,   setHanTra]   = useState('');
    const [hinhThuc, setHinhThuc] = useState('Mang về');
    const [sachs,    setSachs]    = useState(['']);
    const [msg,      setMsg]      = useState(null);

    const addRow    = () => setSachs(p => [...p, '']);
    const removeRow = (i) => setSachs(p => p.filter((_, idx) => idx !== i));
    const setRow    = (i, v) => setSachs(p => p.map((s, idx) => idx === i ? v : s));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!docGiaId) { setMsg({ type: 'error', text: 'Vui lòng chọn độc giả!' }); return; }
        if (!hanTra || hanTra <= TODAY) { setMsg({ type: 'error', text: 'Ngày hẹn trả phải sau hôm nay!' }); return; }

        const validSachs = sachs.filter(s => s.trim());
        if (!validSachs.length) { setMsg({ type: 'error', text: 'Vui lòng nhập ít nhất 1 mã cuốn sách!' }); return; }

        for (const ma of validSachs) {
            const cuon = mockData.cuonsach.find(c => c.MaCuonSach === ma);
            if (!cuon) { setMsg({ type: 'error', text: `Không tìm thấy cuốn sách: "${ma}"` }); return; }
            if (cuon.TrangThai !== 'Sẵn sàng') { setMsg({ type: 'error', text: `Sách "${ma}" đang ${cuon.TrangThai}, không thể mượn!` }); return; }
        }

        const docGia = mockData.docgia.find(d => d.MaThanhVien === docGiaId);
        const maxNum = phieuList.reduce((m, p) => Math.max(m, parseInt(p.MaPhieu.replace('PM', ''))), 0);
        const newMa  = `PM${String(maxNum + 1).padStart(3, '0')}`;

        setPhieuList(p => [...p, { MaPhieu: newMa, NgayLapPhieu: TODAY, MaThanhVien: docGiaId, HoTenDocGia: docGia?.HoTen || docGiaId, MaNhanVienLap: 'NV001', MaNhanVienThu: null, TrangThai: 'Đang mượn' }]);
        setMuonList(p => [...p, ...validSachs.map(ma => {
            const ds = mockData.dausach.find(b => mockData.cuonsach.find(c => c.MaCuonSach === ma && c.MaDauSach === b.MaDauSach));
            return { MaPhieu: newMa, MaCuonSach: ma, TenSach: ds?.TenSach || '—', HinhThucMuon: hinhThuc, HanTra: hanTra, NgayTraThucTe: null, TinhTrangKhiTra: null, TienPhatPhatSinh: 0 };
        })]);

        setMsg({ type: 'success', text: `✅ Tạo phiếu mượn ${newMa} thành công! (${validSachs.length} cuốn sách)` });
        setDocGiaId(''); setHanTra(''); setSachs(['']);
    };

    const I = { width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' };
    const L = { display: 'block', fontWeight: '600', fontSize: '13px', color: '#555', marginBottom: '5px' };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 16px', borderBottom: `2px solid ${G}`, paddingBottom: '8px', fontSize: '15px' }}>📋 Lập Phiếu Mượn mới</h3>
            <Alert msg={msg} />
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '22px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

                {/* Chọn độc giả */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={L}>👤 Độc giả mượn sách <span style={{ color: 'red' }}>*</span></label>
                    <select value={docGiaId} onChange={e => setDocGiaId(e.target.value)} style={{ ...I, background: 'white' }}>
                        <option value="">-- Chọn độc giả --</option>
                        {mockData.docgia.map(d => <option key={d.MaThanhVien} value={d.MaThanhVien}>{d.MaThanhVien} — {d.HoTen}</option>)}
                    </select>
                </div>

                {/* Ngày hẹn trả & Hình thức */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                        <label style={L}>📅 Ngày hẹn trả <span style={{ color: 'red' }}>*</span></label>
                        <input type="date" value={hanTra} min={TODAY} onChange={e => setHanTra(e.target.value)} style={I} />
                    </div>
                    <div>
                        <label style={L}>🔖 Hình thức mượn</label>
                        <select value={hinhThuc} onChange={e => setHinhThuc(e.target.value)} style={{ ...I, background: 'white' }}>
                            <option>Mang về</option>
                            <option>Tại chỗ</option>
                        </select>
                    </div>
                </div>

                {/* Danh sách mã sách */}
                <div style={{ marginBottom: '18px' }}>
                    <label style={L}>📚 Mã cuốn sách cần mượn <span style={{ color: 'red' }}>*</span></label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {sachs.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: '8px' }}>
                                <input value={s} onChange={e => setRow(i, e.target.value)} style={{ ...I, flex: 1 }} placeholder={`VD: CS001_1, CS002_1`} />
                                {sachs.length > 1 && <button type="button" onClick={() => removeRow(i)} style={{ padding: '0 10px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>✕</button>}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addRow} style={{ marginTop: '7px', padding: '6px 13px', background: GL, color: G, border: `1px dashed ${G}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>+ Thêm sách</button>
                    <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#bbb' }}>
                        Sách đang sẵn sàng: {mockData.cuonsach.filter(c => c.TrangThai === 'Sẵn sàng').map(c => c.MaCuonSach).join(' · ')}
                    </p>
                </div>

                <button type="submit" style={{ width: '100%', padding: '11px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                    📄 Tạo phiếu mượn
                </button>
            </form>
        </div>
    );
};

const TraSach = ({ phieuList, setPhieuList, muonList, setMuonList }) => {
    const [keyword,   setKeyword]   = useState('');
    const [found,     setFound]     = useState(null);
    const [selected,  setSelected]  = useState([]);
    const [tinhTrang, setTinhTrang] = useState('Tốt');
    const [msg,       setMsg]       = useState(null);

    const doSearch = (e) => {
        e.preventDefault();
        const q = keyword.trim().toUpperCase();
        const phieu = phieuList.find(p => p.MaPhieu === q);
        if (!phieu) { setFound(null); setMsg({ type: 'error', text: `Không tìm thấy phiếu mượn "${q}"` }); return; }
        const details = muonList.filter(m => m.MaPhieu === phieu.MaPhieu && !m.NgayTraThucTe);
        setFound({ phieu, details });
        setSelected(details.map(d => d.MaCuonSach));
        setMsg(null);
    };

    const toggle = (ma) => setSelected(p => p.includes(ma) ? p.filter(x => x !== ma) : [...p, ma]);

    const doReturn = () => {
        if (!selected.length) { setMsg({ type: 'error', text: 'Chưa chọn cuốn sách nào!' }); return; }
        const hanTra  = found.details[0]?.HanTra;
        const dayLate = TODAY > hanTra ? Math.ceil((new Date(TODAY) - new Date(hanTra)) / 86400000) : 0;
        const fine    = dayLate * 5000;

        setMuonList(p => p.map(m =>
            selected.includes(m.MaCuonSach) && m.MaPhieu === found.phieu.MaPhieu
                ? { ...m, NgayTraThucTe: TODAY, TinhTrangKhiTra: tinhTrang, TienPhatPhatSinh: fine }
                : m
        ));

        const remaining = muonList.filter(m => m.MaPhieu === found.phieu.MaPhieu && !selected.includes(m.MaCuonSach) && !m.NgayTraThucTe).length;
        if (remaining === 0) {
            setPhieuList(p => p.map(pm => pm.MaPhieu === found.phieu.MaPhieu ? { ...pm, TrangThai: dayLate > 0 ? 'Quá hạn' : 'Đã trả' } : pm));
        }

        setMsg({ type: 'success', text: `✅ Trả thành công ${selected.length} cuốn!${dayLate > 0 ? ` Tiền phạt: ${fine.toLocaleString('vi-VN')}đ (${dayLate} ngày trễ)` : ' Đúng hạn, không phạt.'}` });
        setFound(null); setKeyword(''); setSelected([]);
    };

    const I = { padding: '9px 11px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' };

    return (
        <div style={{ maxWidth: '640px' }}>
            <h3 style={{ margin: '0 0 16px', borderBottom: `2px solid ${G}`, paddingBottom: '8px', fontSize: '15px' }}>↩️ Xử lý Trả sách</h3>
            <Alert msg={msg} />

            {/* Tìm phiếu */}
            <form onSubmit={doSearch} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} style={{ ...I, width: '220px' }} placeholder="Nhập mã phiếu (VD: PM001)" />
                <button type="submit" style={{ padding: '9px 18px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>🔍 Tra cứu</button>
            </form>

            {/* Kết quả */}
            {found && (
                <div style={{ background: 'white', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    {/* Header phiếu */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                        {[['Mã phiếu', found.phieu.MaPhieu], ['Độc giả', found.phieu.HoTenDocGia], ['Ngày lập', found.phieu.NgayLapPhieu]].map(([k, v]) => (
                            <div key={k}><div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>{k}</div><div style={{ fontWeight: '600', fontSize: '14px' }}>{v}</div></div>
                        ))}
                    </div>

                    {found.details.length === 0
                        ? <p style={{ color: '#bbb', textAlign: 'center', padding: '14px' }}>Tất cả sách trong phiếu đã được trả.</p>
                        : (
                            <>
                                <p style={{ fontWeight: '600', fontSize: '13px', color: '#666', marginBottom: '8px' }}>Chọn cuốn sách cần trả:</p>
                                {found.details.map(d => (
                                    <div key={d.MaCuonSach} onClick={() => toggle(d.MaCuonSach)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '5px', border: `1px solid ${selected.includes(d.MaCuonSach) ? G : '#eee'}`, background: selected.includes(d.MaCuonSach) ? GL : 'white' }}>
                                        <input type="checkbox" checked={selected.includes(d.MaCuonSach)} onChange={() => {}} style={{ width: 16, height: 16, accentColor: G, cursor: 'pointer' }} />
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: '13px' }}>{d.TenSach}</strong>
                                            <div style={{ fontSize: '12px', color: '#999' }}>Mã: {d.MaCuonSach} · Hạn: {d.HanTra} · {d.HinhThucMuon}</div>
                                        </div>
                                        {TODAY > d.HanTra && <span style={{ background: '#ffebee', color: '#c62828', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>⚠️ Quá hạn</span>}
                                    </div>
                                ))}
                                <div style={{ marginTop: '12px', marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Tình trạng sách khi trả:</label>
                                    <select value={tinhTrang} onChange={e => setTinhTrang(e.target.value)} style={{ padding: '8px 11px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: 'white', width: '220px' }}>
                                        {['Tốt', 'Có hư hỏng nhẹ', 'Hư hỏng nặng', 'Mất sách'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <button onClick={doReturn} style={{ width: '100%', padding: '11px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                                    ✅ Xác nhận trả {selected.length} cuốn sách
                                </button>
                            </>
                        )
                    }
                </div>
            )}
        </div>
    );
};

const DanhSachPhieu = ({ phieuList }) => {
    const [filter, setFilter] = useState('');
    const filtered = phieuList.filter(p => !filter || p.TrangThai === filter);

    return (
        <div>
            <div style={{ display: 'flex', gap: '7px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {['', 'Đang mượn', 'Đã trả', 'Quá hạn'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: `1px solid ${filter === s ? G : '#ddd'}`, background: filter === s ? G : 'white', color: filter === s ? 'white' : '#777' }}>
                        {s || 'Tất cả'} ({s ? phieuList.filter(p => p.TrangThai === s).length : phieuList.length})
                    </button>
                ))}
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Mã phiếu</th><th>Ngày lập</th><th>Độc giả</th><th>NV lập phiếu</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                        {filtered.map(p => {
                            const s = TT_STYLE[p.TrangThai] || { background: '#eee', color: '#555' };
                            return (
                                <tr key={p.MaPhieu}>
                                    <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{p.MaPhieu}</code></td>
                                    <td style={{ color: '#777' }}>{p.NgayLapPhieu}</td>
                                    <td><strong>{p.HoTenDocGia}</strong></td>
                                    <td style={{ color: '#999' }}>{p.MaNhanVienLap}</td>
                                    <td><span style={{ ...s, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{p.TrangThai}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MuonSachManagement = ({ user }) => {
    const [tab,       setTab]       = useState('lap');
    const [phieuList, setPhieuList] = useState(mockData.phieumuon);
    const [muonList,  setMuonList]  = useState(mockData.muonsach);

    const TABS = [
        { key: 'lap',     label: '📋 Lập phiếu mượn'   },
        { key: 'tra',     label: '↩️ Trả sách'          },
        { key: 'danhsach',label: '📃 Danh sách phiếu'   },
    ];

    return (
        <div>
            <h2 style={{ margin: '0 0 18px', color: '#222' }}>📦 Quản lý Mượn - Trả sách</h2>

            {/* Tab buttons */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '22px', borderBottom: '2px solid #eee' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '9px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.key ? '700' : '400', color: tab === t.key ? G : '#888', borderBottom: tab === t.key ? `3px solid ${G}` : '3px solid transparent', marginBottom: '-2px' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'lap'      && <LapPhieuMuon phieuList={phieuList} setPhieuList={setPhieuList} muonList={muonList} setMuonList={setMuonList} />}
            {tab === 'tra'      && <TraSach       phieuList={phieuList} setPhieuList={setPhieuList} muonList={muonList} setMuonList={setMuonList} />}
            {tab === 'danhsach' && <DanhSachPhieu phieuList={phieuList} />}
        </div>
    );
};

export default MuonSachManagement;
