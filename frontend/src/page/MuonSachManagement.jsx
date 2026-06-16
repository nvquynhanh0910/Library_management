import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const G   = '#7DA78C';
const GL  = '#e8f5ec';
const TODAY = new Date().toISOString().split('T')[0];

const TT_STYLE = {
    'Đang mượn': { background: '#fff3e0', color: '#e65100' },
    'Đã trả':    { background: '#e8f5e9', color: '#2e7d32' },
    'Trả muộn':  { background: '#ffebee', color: '#c62828' },
};

// Thông báo hệ thống
const Alert = ({ msg }) => {
    if (!msg) return null;
    const ok = msg.type === 'success';
    return (
        <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: '500', border: `1px solid ${ok ? '#a5d6a7' : '#ef9a9a'}`, background: ok ? GL : '#ffebee', color: ok ? '#2e7d32' : '#c62828' }}>
            {msg.text}
        </div>
    );
};

const LichSuMuonCaNhan = ({ user, phieuList, muonList }) => {
    const [filter, setFilter] = useState('');

    const tenDocGia = user?.name || '';
    const maTV      = user?.maThanhVien || '';

    // Lọc ra danh sách những phiếu mượn thuộc về đúng tài khoản độc giả đang đăng nhập
    const myPhieu = phieuList.filter(p =>
        (maTV && p.MaThanhVien === maTV) || p.HoTenDocGia === tenDocGia
    );

    const filtered = myPhieu.filter(p => !filter || p.TrangThai === filter);

    const dangMuon = myPhieu.filter(p => p.TrangThai === 'Đang mượn').length;
    const quaHan   = myPhieu.filter(p => p.TrangThai === 'Trả muộn' || p.TrangThai === 'Quá hạn').length;
    const daTra    = myPhieu.filter(p => p.TrangThai === 'Đã trả').length;

    return (
        <div>
            {/* Tiêu đề góc cá nhân độc giả */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#222' }}>📋 Lịch sử mượn sách của tôi</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#999' }}>
                    Xin chào, <strong>{tenDocGia}</strong> — Bạn đang có tổng cộng {myPhieu.length} giao dịch mượn sách.
                </p>
            </div>

            {/* Khối thẻ tóm tắt trạng thái */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Đang mượn', value: dangMuon, color: '#e65100', bg: '#fff3e0' },
                    { label: 'Quá hạn',   value: quaHan,   color: '#c62828', bg: '#ffebee' },
                    { label: 'Đã trả',    value: daTra,    color: '#2e7d32', bg: GL      },
                ].map(c => (
                    <div key={c.label} style={{ background: 'white', borderRadius: '8px', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderLeft: `4px solid ${c.color}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '8px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                            {c.label === 'Đang mượn' ? '🔄' : c.label === 'Quá hạn' ? '⚠️' : '✅'}
                        </div>
                        <div>
                            <div style={{ fontSize: '22px', fontWeight: '700', color: c.color, lineHeight: 1 }}>{c.value}</div>
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cảnh báo đẩy màu đỏ nếu có sách giữ quá ngày */}
            {quaHan > 0 && (
                <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#c62828', fontWeight: '500' }}>
                    ⚠️ Bạn đang có <strong>{quaHan}</strong> sách mượn quá hạn. Vui lòng mang sách qua quầy thư viện để hoàn trả!
                </div>
            )}

            {/* Thanh Tab bộ lọc nhanh trạng thái */}
            <div style={{ display: 'flex', gap: '7px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {['', 'Đang mượn', 'Đã trả', 'Trả muộn'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: '500',
                        border:      `1px solid ${filter === s ? G : '#ddd'}`,
                        background:  filter === s ? G : 'white',
                        color:       filter === s ? 'white' : '#777',
                    }}>
                        {s || 'Tất cả'} ({s ? myPhieu.filter(p => p.TrangThai === s).length : myPhieu.length})
                    </button>
                ))}
            </div>

            {/* Bảng dữ liệu chi tiết */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ccc', background: 'white', borderRadius: '10px' }}>
                    Bạn chưa từng thực hiện mượn cuốn sách nào tại thư viện.
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Mã phiếu</th>
                            <th>Ngày mượn</th>
                            <th>Sách mượn</th>
                            <th>Hạn trả</th>
                            <th>Ngày trả thực tế</th>
                            <th>Tiền phạt phát sinh</th>
                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(p => {
                            const sachTrongPhieu = muonList.filter(m => m.MaPhieu === p.MaPhieu);
                            const tongPhat       = sachTrongPhieu.reduce((s, m) => s + (m.TienPhatPhatSinh || 0), 0);
                            const ts             = TT_STYLE[p.TrangThai] || { background: '#eee', color: '#555' };

                            return (
                                <tr key={p.MaPhieu}>
                                    <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{p.MaPhieu}</code></td>
                                    <td style={{ color: '#777' }}>{p.NgayLapPhieu}</td>
                                    <td>
                                        {sachTrongPhieu.map(m => (
                                            <div key={m.MaCuonSach} style={{ marginBottom: '4px', height: '18px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                                                <span style={{ fontWeight: '500' }}>{m.TenSach}</span>
                                                <code style={{ marginLeft: '6px', fontSize: '11px', color: '#aaa' }}>{m.MaCuonSach}</code>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {sachTrongPhieu.map(m => (
                                            <div key={m.MaCuonSach} style={{ marginBottom: '4px', height: '18px', display: 'flex', alignItems: 'center', color: TODAY > m.HanTra && p.TrangThai !== 'Đã trả' ? '#c62828' : '#777', fontWeight: TODAY > m.HanTra && p.TrangThai !== 'Đã trả' ? '600' : '400' }}>
                                                📅 {m.HanTra}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {sachTrongPhieu.map(m => (
                                            <div key={m.MaCuonSach} style={{ marginBottom: '4px', height: '18px', display: 'flex', alignItems: 'center', color: '#555' }}>
                                                {m.NgayTraThucTe ? `✓ ${m.NgayTraThucTe}` : <span style={{ color: '#bbb', fontStyle: 'italic' }}>Chưa hoàn trả</span>}
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ fontWeight: '600', color: tongPhat > 0 ? '#c62828' : '#aaa' }}>
                                        {tongPhat > 0 ? tongPhat.toLocaleString('vi-VN') + ' đ' : '—'}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                            <span style={{ ...ts, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                                {p.TrangThai}
                                            </span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const LapPhieuMuon = ({ phieuList, setPhieuList, muonList, setMuonList }) => {
    const [docGiaId, setDocGiaId] = useState('');
    const [hanTra,   setHanTra]   = useState('');
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
            const cuon = mockData.cuonsach.find(c => c.MaCuonSach === ma);
            const dauSach = mockData.dausach.find(b => b.MaDauSach === cuon?.MaDauSach);
            return { MaPhieu: newMa, MaCuonSach: ma, TenSach: dauSach?.TenSach || '—', HinhThucMuon: 'Mang về', HanTra: hanTra, NgayTraThucTe: null, TinhTrangKhiTra: null, TienPhatPhatSinh: 0 };
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
                <div style={{ marginBottom: '14px' }}>
                    <label style={L}>👤 Độc giả mượn sách <span style={{ color: 'red' }}>*</span></label>
                    <select value={docGiaId} onChange={e => setDocGiaId(e.target.value)} style={{ ...I, background: 'white' }}>
                        <option value="">-- Chọn độc giả --</option>
                        {mockData.docgia.map(d => <option key={d.MaThanhVien} value={d.MaThanhVien}>{d.MaThanhVien} — {d.HoTen}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '14px' }}>
                    <label style={L}>📅 Ngày hẹn trả <span style={{ color: 'red' }}>*</span></label>
                    <input type="date" value={hanTra} min={TODAY} onChange={e => setHanTra(e.target.value)} style={I} />
                </div>
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
            setPhieuList(p => p.map(pm => pm.MaPhieu === found.phieu.MaPhieu ? { ...pm, TrangThai: dayLate > 0 ? 'Trả muộn' : 'Đã trả' } : pm));
        }

        setMsg({ type: 'success', text: `✅ Trả thành công ${selected.length} cuốn!${dayLate > 0 ? ` Tiền phạt: ${fine.toLocaleString('vi-VN')}đ (${dayLate} ngày trễ)` : ' Đúng hạn, không phạt.'}` });
        setFound(null); setKeyword(''); setSelected([]);
    };

    const I = { padding: '9px 11px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' };

    return (
        <div style={{ maxWidth: '640px' }}>
            <h3 style={{ margin: '0 0 16px', borderBottom: `2px solid ${G}`, paddingBottom: '8px', fontSize: '15px' }}>↩️ Xử lý Trả sách</h3>
            <Alert msg={msg} />
            <form onSubmit={doSearch} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} style={{ ...I, width: '220px' }} placeholder="Nhập mã phiếu (VD: PM001)" />
                <button type="submit" style={{ padding: '9px 18px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>🔍 Tra cứu</button>
            </form>

            {found && (
                <div style={{ background: 'white', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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
                                            <div style={{ fontSize: '12px', color: '#999' }}>Mã: {d.MaCuonSach} · Hạn: {d.HanTra}</div>
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

const DanhSachPhieu = ({ phieuList, muonList }) => {
    const [filter, setFilter] = useState('');
    const filtered = phieuList.filter(p => !filter || p.TrangThai === filter);

    return (
        <div>
            <div style={{ display: 'flex', gap: '7px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {['', 'Đang mượn', 'Đã trả', 'Trả muộn'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: `1px solid ${filter === s ? G : '#ddd'}`, background: filter === s ? G : 'white', color: filter === s ? 'white' : '#777' }}>
                        {s || 'Tất cả'} ({s ? phieuList.filter(p => p.TrangThai === s).length : phieuList.length})
                    </button>
                ))}
            </div>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Mã phiếu</th>
                        <th>Ngày lập</th>
                        <th>Độc giả</th>
                        <th>Sách mượn</th>
                        <th>Ngày hẹn trả</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(p => {
                        const s = TT_STYLE[p.TrangThai] || { background: '#eee', color: '#555' };
                        const booksInPhieu = muonList.filter(m => m.MaPhieu === p.MaPhieu);

                        return (
                            <tr key={p.MaPhieu}>
                                <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{p.MaPhieu}</code></td>
                                <td style={{ color: '#777' }}>{p.NgayLapPhieu}</td>
                                <td><strong>{p.HoTenDocGia}</strong></td>

                                <td style={{ fontSize: '12px', color: '#555' }}>
                                    {booksInPhieu.map(m => (
                                        <div key={m.MaCuonSach} style={{ marginBottom: '4px', height: '18px', display: 'flex', alignItems: 'center' }}>
                                            <code style={{ fontSize: '11px', color: '#999' }}>{m.MaCuonSach}</code>
                                            <span style={{ marginLeft: '5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }} title={m.TenSach}>
                                                {m.TenSach}
                                            </span>
                                        </div>
                                    ))}
                                </td>

                                <td style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>
                                    {booksInPhieu.map(m => (
                                        <div key={m.MaCuonSach} style={{ marginBottom: '4px', height: '18px', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ color: TODAY > m.HanTra && p.TrangThai !== 'Đã trả' ? '#c62828' : '#555' }}>
                                                📅 {m.HanTra}
                                            </span>
                                        </div>
                                    ))}
                                </td>

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
    // 1. Phân loại vai trò tài khoản đăng nhập
    const isAdmin = user?.role === 'admin';

    // Các state dùng chung cho hệ thống dữ liệu mẫu (mockdata)
    const [tab,       setTab]       = useState('lap');
    const [phieuList, setPhieuList] = useState(mockData.phieumuon);
    const [muonList,  setMuonList]  = useState(mockData.muonsach);

    //CHẶN ĐIỀU HƯỚNG PHÂN QUYỀN: Nếu là độc giả, ép hiển thị luôn trang lịch sử của họ
    if (!isAdmin) {
        return (
            <LichSuMuonCaNhan
                user={user}
                phieuList={phieuList}
                muonList={muonList}
            />
        );
    }

    // Cấu hình các tab nghiệp vụ chỉ dành cho Nhân viên thư viện (Thủ thư)
    const TABS = [
        { key: 'lap',     label: '📋 Lập phiếu mượn'   },
        { key: 'tra',     label: '↩️ Trả sách'          },
        { key: 'danhsach',label: '📃 Danh sách phiếu'   },
    ];

    return (
        <div>
            <h2 style={{ margin: '0 0 18px', color: '#222' }}>📦 Quản lý Mượn - Trả sách</h2>

            {/* Thanh điều hướng Tab của Nhân viên */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '22px', borderBottom: '2px solid #eee' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '9px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.key ? '700' : '400', color: tab === t.key ? G : '#888', borderBottom: tab === t.key ? `3px solid ${G}` : '3px solid transparent', marginBottom: '-2px' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Nội dung render tương ứng theo từng tab nghiệp vụ của Nhân viên */}
            {tab === 'lap'      && <LapPhieuMuon phieuList={phieuList} setPhieuList={setPhieuList} muonList={muonList} setMuonList={setMuonList} />}
            {tab === 'tra'      && <TraSach       phieuList={phieuList} setPhieuList={setPhieuList} muonList={muonList} setMuonList={setMuonList} />}
            {tab === 'danhsach' && <DanhSachPhieu phieuList={phieuList} muonList={muonList} />}
        </div>
    );
};

export default MuonSachManagement;