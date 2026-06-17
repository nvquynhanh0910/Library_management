import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const G   = '#7DA78C';
const GL  = '#e8f5ec';
const TODAY = new Date().toISOString().split('T')[0];

const TINH_TRANG_OPTIONS = [
    { label: 'Tốt',            value: 'Tốt' },
    { label: 'Có hư hỏng nhẹ', value: 'Có hư hỏng nhẹ' },
    { label: 'Hỏng nặng',      value: 'Hỏng' },
    { label: 'Mất sách',       value: 'Mất' },
];

const TT_STYLE = {
    'Đang mượn': { background: '#fff3e0', color: '#e65100' },
    'Đã trả':    { background: '#e8f5e9', color: '#2e7d32' },
    'Trả muộn':  { background: '#ffebee', color: '#c62828' },
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

// ── LỊCH SỬ MƯỢN CÁ NHÂN (độc giả) ────────────────────────────────────────
const LichSuMuonCaNhan = ({ user }) => {
    const [phieuList, setPhieuList] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [filter, setFilter]       = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await api.get('/borrowing-slips/my');
                setPhieuList(res.data);
            } catch (err) {
                setError('Không thể tải lịch sử mượn: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered   = phieuList.filter(p => !filter || p.TrangThai === filter);
    const dangMuon   = phieuList.filter(p => p.TrangThai === 'Đang mượn').length;
    const quaHan     = phieuList.filter(p => p.TrangThai === 'Trả muộn').length;
    const daTra      = phieuList.filter(p => p.TrangThai === 'Đã trả').length;

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#222' }}>📋 Lịch sử mượn sách của tôi</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#999' }}>
                    Xin chào, <strong>{user?.name}</strong> — Tổng cộng {phieuList.length} giao dịch mượn sách.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Đang mượn', value: dangMuon, color: '#e65100', bg: '#fff3e0', icon: '🔄' },
                    { label: 'Quá hạn',   value: quaHan,   color: '#c62828', bg: '#ffebee', icon: '⚠️' },
                    { label: 'Đã trả',    value: daTra,    color: '#2e7d32', bg: GL,        icon: '✅' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'white', borderRadius: '8px', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderLeft: `4px solid ${c.color}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '8px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{c.icon}</div>
                        <div>
                            <div style={{ fontSize: '22px', fontWeight: '700', color: c.color, lineHeight: 1 }}>{c.value}</div>
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {quaHan > 0 && (
                <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#c62828', fontWeight: '500' }}>
                    ⚠️ Bạn đang có <strong>{quaHan}</strong> sách mượn quá hạn. Vui lòng mang sách qua quầy thư viện để hoàn trả!
                </div>
            )}

            <div style={{ display: 'flex', gap: '7px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {['', 'Đang mượn', 'Đã trả', 'Trả muộn'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                        border:     `1px solid ${filter === s ? G : '#ddd'}`,
                        background: filter === s ? G : 'white',
                        color:      filter === s ? 'white' : '#777',
                    }}>
                        {s || 'Tất cả'} ({s ? phieuList.filter(p => p.TrangThai === s).length : phieuList.length})
                    </button>
                ))}
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#888' }}>⏳ Đang tải...</p>}
            {error   && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {!loading && !error && (
                filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#ccc', background: 'white', borderRadius: '10px' }}>
                        Không có phiếu mượn nào.
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
                                <th>Tiền phạt</th>
                                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(p => {
                                const chiTiet = p.Borrowings || [];
                                const tongPhat = chiTiet.reduce((s, m) => s + (m.TienPhatPhatSinh || 0), 0);
                                const ts = TT_STYLE[p.TrangThai] || { background: '#eee', color: '#555' };
                                return (
                                    <tr key={p.MaPhieu}>
                                        <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{p.MaPhieu}</code></td>
                                        <td style={{ color: '#777' }}>{p.NgayLapPhieu}</td>
                                        <td>
                                            {chiTiet.map((m, i) => (
                                                <div key={i} style={{ marginBottom: '4px', fontSize: '13px' }}>
                                                    <span style={{ fontWeight: '500' }}>{m.Book?.BookTitle?.TenSach || '—'}</span>
                                                    <code style={{ marginLeft: '6px', fontSize: '11px', color: '#aaa' }}>{m.MaCuonSach}</code>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {chiTiet.map((m, i) => (
                                                <div key={i} style={{ marginBottom: '4px', color: TODAY > m.HanTra && p.TrangThai !== 'Đã trả' ? '#c62828' : '#777', fontWeight: TODAY > m.HanTra && p.TrangThai !== 'Đã trả' ? '600' : '400' }}>
                                                    📅 {m.HanTra}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {chiTiet.map((m, i) => (
                                                <div key={i} style={{ marginBottom: '4px', color: '#555' }}>
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
                )
            )}
        </div>
    );
};

// ── LẬP PHIẾU MƯỢN ────────────────────────────────────────────────────────
const LapPhieuMuon = ({ onRefresh }) => {
    const [docGiaList, setDocGiaList] = useState([]);
    const [docGiaId,   setDocGiaId]   = useState('');
    const [hanTra,     setHanTra]     = useState('');
    const [sachs,      setSachs]      = useState(['']);
    const [msg,        setMsg]        = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get('/members').then(res => setDocGiaList(res.data)).catch(() => {});
    }, []);

    const addRow    = () => setSachs(p => [...p, '']);
    const removeRow = (i) => setSachs(p => p.filter((_, idx) => idx !== i));
    const setRow    = (i, v) => setSachs(p => p.map((s, idx) => idx === i ? v : s));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!docGiaId)              { setMsg({ type: 'error', text: 'Vui lòng chọn độc giả!' }); return; }
        if (!hanTra || hanTra <= TODAY) { setMsg({ type: 'error', text: 'Ngày hẹn trả phải sau hôm nay!' }); return; }
        const validSachs = sachs.filter(s => s.trim());
        if (!validSachs.length)     { setMsg({ type: 'error', text: 'Vui lòng nhập ít nhất 1 mã cuốn sách!' }); return; }

        setSubmitting(true);
        try {
            await api.post('/borrowing-slips', {
                MaThanhVien: docGiaId,
                HanTra:      hanTra,
                MaCuonSach:  validSachs,
            });
            setMsg({ type: 'success', text: `✅ Tạo phiếu mượn thành công! (${validSachs.length} cuốn sách)` });
            setDocGiaId(''); setHanTra(''); setSachs(['']);
            onRefresh && onRefresh();
        } catch (err) {
            setMsg({ type: 'error', text: '❌ ' + (err.response?.data?.message || err.message) });
        } finally {
            setSubmitting(false);
        }
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
                        {docGiaList.map(d => <option key={d.MaThanhVien} value={d.MaThanhVien}>{d.MaThanhVien} — {d.HoTen}</option>)}
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
                                <input value={s} onChange={e => setRow(i, e.target.value)} style={{ ...I, flex: 1 }} placeholder="VD: CS001_1" />
                                {sachs.length > 1 && <button type="button" onClick={() => removeRow(i)} style={{ padding: '0 10px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>✕</button>}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addRow} style={{ marginTop: '7px', padding: '6px 13px', background: GL, color: G, border: `1px dashed ${G}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>+ Thêm sách</button>
                </div>
                <button type="submit" disabled={submitting} style={{ width: '100%', padding: '11px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                    {submitting ? 'Đang tạo phiếu...' : '📄 Tạo phiếu mượn'}
                </button>
            </form>
        </div>
    );
};

// ── TRẢ SÁCH ───────────────────────────────────────────────────────────────
const TraSach = ({ onRefresh }) => {
    const [keyword,   setKeyword]   = useState('');
    const [found,     setFound]     = useState(null);
    const [selected,  setSelected]  = useState([]);
    const [tinhTrang, setTinhTrang] = useState('Tốt');
    const [msg,       setMsg]       = useState(null);
    const [searching, setSearching] = useState(false);
    const [submitting,setSubmitting]= useState(false);

    const doSearch = async (e) => {
        e.preventDefault();
        const q = keyword.trim().toUpperCase();
        if (!q) return;
        setSearching(true);
        setFound(null);
        setMsg(null);
        try {
            const res = await api.get(`/borrowing-slips/${q}`);
            const phieu = res.data;
            const details = (phieu.Borrowings || []).filter(d => !d.NgayTraThucTe);
            setFound({ phieu, details });
            setSelected(details.map(d => d.MaCuonSach));
        } catch (err) {
            setMsg({ type: 'error', text: `Không tìm thấy phiếu mượn "${q}"` });
        } finally {
            setSearching(false);
        }
    };

    const toggle = (ma) => setSelected(p => p.includes(ma) ? p.filter(x => x !== ma) : [...p, ma]);

    const doReturn = async () => {
        if (!selected.length) { setMsg({ type: 'error', text: 'Chưa chọn cuốn sách nào!' }); return; }

        // Cảnh báo nếu có sách quá hạn hoặc hư hỏng
        const hasLate    = selected.some(ma => found.details.find(d => d.MaCuonSach === ma && TODAY > d.HanTra));
        const hasDamage  = ['Có hư hỏng nhẹ', 'Hỏng', 'Mất'].includes(tinhTrang);
        if ((hasLate || hasDamage) && !window.confirm(
            `⚠️ Lưu ý:\n` +
            (hasLate   ? `• Có sách trả quá hạn — sẽ phát sinh phiếu phạt quá hạn.\n` : '') +
            (hasDamage ? `• Tình trạng "${tinhTrang}" — sẽ phát sinh phiếu phạt hư hỏng/mất.\n` : '') +
            `\nXác nhận tiếp tục?`
        )) return;

        setSubmitting(true);
        try {
            const res = await api.put(`/borrowing-slips/${found.phieu.MaPhieu}/return`, {
                DanhSachSach:    selected.map(ma => ({ MaCuonSach: ma })),
                TinhTrangKhiTra: tinhTrang
            });
            const trangThai = res.data?.TrangThai || '';
            const suffix = trangThai === 'Trả muộn'
                ? ' — Phiếu phạt quá hạn đã được tạo tự động!'
                : hasDamage ? ' — Phiếu phạt hư hỏng đã được tạo tự động!' : '';
            setMsg({ type: 'success', text: `✅ Trả thành công ${selected.length} cuốn sách!${suffix}` });
            setFound(null); setKeyword(''); setSelected([]);
            onRefresh && onRefresh();
        } catch (err) {
            setMsg({ type: 'error', text: '❌ ' + (err.response?.data?.message || err.message) });
        } finally {
            setSubmitting(false);
        }
    };

    const I = { padding: '9px 11px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' };

    return (
        <div style={{ maxWidth: '640px' }}>
            <h3 style={{ margin: '0 0 16px', borderBottom: `2px solid ${G}`, paddingBottom: '8px', fontSize: '15px' }}>↩️ Xử lý Trả sách</h3>
            <Alert msg={msg} />
            <form onSubmit={doSearch} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} style={{ ...I, width: '220px' }} placeholder="Nhập mã phiếu (VD: PM001)" />
                <button type="submit" disabled={searching} style={{ padding: '9px 18px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    {searching ? '...' : '🔍 Tra cứu'}
                </button>
            </form>

            {found && (
                <div style={{ background: 'white', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                        {[['Mã phiếu', found.phieu.MaPhieu], ['Độc giả', found.phieu.HoTenDocGia || found.phieu.Member?.HoTen], ['Ngày lập', found.phieu.NgayLapPhieu]].map(([k, v]) => (
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
                                            <strong style={{ fontSize: '13px' }}>{d.Book?.BookTitle?.TenSach || '—'}</strong>
                                            <div style={{ fontSize: '12px', color: '#999' }}>Mã: {d.MaCuonSach} · Hạn: {d.HanTra}</div>
                                        </div>
                                        {TODAY > d.HanTra && <span style={{ background: '#ffebee', color: '#c62828', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>⚠️ Quá hạn</span>}
                                    </div>
                                ))}
                                <div style={{ marginTop: '12px', marginBottom: '14px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#555', marginBottom: '5px' }}>Tình trạng sách khi trả:</label>
                                    <select value={tinhTrang} onChange={e => setTinhTrang(e.target.value)} style={{ padding: '8px 11px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: 'white', width: '220px' }}>
                                        {TINH_TRANG_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <button onClick={doReturn} disabled={submitting} style={{ width: '100%', padding: '11px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                                    {submitting ? 'Đang xử lý...' : `✅ Xác nhận trả ${selected.length} cuốn sách`}
                                </button>
                            </>
                        )
                    }
                </div>
            )}
        </div>
    );
};

// ── DANH SÁCH PHIẾU MƯỢN ──────────────────────────────────────────────────
const DanhSachPhieu = ({ isAdmin }) => {
    const [phieuList, setPhieuList] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [filter, setFilter]       = useState('');
    const [search, setSearch]       = useState('');

    const fetchSlips = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/borrowing-slips');
            setPhieuList(res.data);
        } catch (err) {
            setError('Không thể tải danh sách phiếu: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSlips(); }, [fetchSlips]);

    const handleDelete = async (maPhieu) => {
        if (!window.confirm(`Xác nhận xóa phiếu mượn ${maPhieu}?`)) return;
        try {
            await api.delete(`/borrowing-slips/${maPhieu}`);
            fetchSlips();
        } catch (err) {
            alert('❌ ' + (err.response?.data?.message || 'Xóa thất bại!'));
        }
    };

    const filtered = phieuList.filter(p => {
        const matchFilter = !filter || p.TrangThai === filter;
        const matchSearch = !search ||
            p.MaPhieu?.toLowerCase().includes(search.toLowerCase()) ||
            (p.HoTenDocGia || p.Member?.HoTen || '').toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" placeholder="🔍 Tìm mã phiếu, tên độc giả..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', width: '240px' }} />
                {['', 'Đang mượn', 'Đã trả', 'Trả muộn'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', border: `1px solid ${filter === s ? G : '#ddd'}`, background: filter === s ? G : 'white', color: filter === s ? 'white' : '#777' }}>
                        {s || 'Tất cả'} ({s ? phieuList.filter(p => p.TrangThai === s).length : phieuList.length})
                    </button>
                ))}
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#888' }}>⏳ Đang tải...</p>}
            {error   && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            {!loading && !error && (
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
                            {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(p => {
                            const s = TT_STYLE[p.TrangThai] || { background: '#eee', color: '#555' };
                            const chiTiet = p.Borrowings || [];
                            const canDelete = p.TrangThai === 'Đã trả' || p.TrangThai === 'Trả muộn';
                            return (
                                <tr key={p.MaPhieu}>
                                    <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{p.MaPhieu}</code></td>
                                    <td style={{ color: '#777' }}>{p.NgayLapPhieu}</td>
                                    <td><strong>{p.HoTenDocGia || p.Member?.HoTen}</strong></td>
                                    <td style={{ fontSize: '12px', color: '#555' }}>
                                        {chiTiet.map((m, i) => (
                                            <div key={i} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                                                <code style={{ fontSize: '11px', color: '#999' }}>{m.MaCuonSach}</code>
                                                <span style={{ marginLeft: '5px', maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={m.TenSach}>
                                                    {m.Book?.BookTitle?.TenSach}
                                                </span>
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ fontSize: '13px' }}>
                                        {chiTiet.map((m, i) => (
                                            <div key={i} style={{ marginBottom: '4px', color: TODAY > m.HanTra && p.TrangThai !== 'Đã trả' ? '#c62828' : '#555' }}>
                                                📅 {m.HanTra}
                                            </div>
                                        ))}
                                    </td>
                                    <td><span style={{ ...s, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{p.TrangThai}</span></td>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'center' }}>
                                            {canDelete
                                                ? <button onClick={() => handleDelete(p.MaPhieu)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }} title="Xóa phiếu mượn">🗑️</button>
                                                : <span style={{ color: '#ddd', fontSize: '13px' }}>—</span>
                                            }
                                        </td>
                                    )}
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

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
const MuonSachManagement = ({ user }) => {
    const isAdmin = user?.role === 'admin';
    const [tab, setTab] = useState('lap');
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => setRefreshKey(k => k + 1);

    if (!isAdmin) {
        return <LichSuMuonCaNhan user={user} key={refreshKey} />;
    }

    const TABS = [
        { key: 'lap',      label: '📋 Lập phiếu mượn' },
        { key: 'tra',      label: '↩️ Trả sách'        },
        { key: 'danhsach', label: '📃 Danh sách phiếu' },
    ];

    return (
        <div>
            <h2 style={{ margin: '0 0 18px', color: '#222' }}>📦 Quản lý Mượn - Trả sách</h2>
            <div style={{ display: 'flex', gap: '0', marginBottom: '22px', borderBottom: '2px solid #eee' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '9px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.key ? '700' : '400', color: tab === t.key ? G : '#888', borderBottom: tab === t.key ? `3px solid ${G}` : '3px solid transparent', marginBottom: '-2px' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            {tab === 'lap'      && <LapPhieuMuon onRefresh={refresh} />}
            {tab === 'tra'      && <TraSach       onRefresh={refresh} />}
            {tab === 'danhsach' && <DanhSachPhieu key={refreshKey} isAdmin={isAdmin} />}
        </div>
    );
};

export default MuonSachManagement;
