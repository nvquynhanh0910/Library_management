import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const GREEN = '#7DA78C';
const LIGHT = '#e8f5ec';

const validate = (form) => {
    const e = {};
    if (!form.HoTen.trim()) e.HoTen = 'Họ tên không được để trống';
    if (!form.Email.trim()) e.Email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) e.Email = 'Email không hợp lệ';
    if (!form.SoDienThoai.trim()) e.SoDienThoai = 'Số điện thoại không được để trống';
    else if (!/^0\d{9}$/.test(form.SoDienThoai)) e.SoDienThoai = 'SĐT phải 10 số, bắt đầu bằng 0';
    return e;
};

const EMPTY = { HoTen: '', Email: '', SoDienThoai: '' };

const DocGiaModal = ({ mode, data, onSave, onClose }) => {
    const [form, setForm]     = useState(mode === 'edit' ? { HoTen: data.HoTen, Email: data.Email, SoDienThoai: data.SoDienThoai } : EMPTY);
    const [errors, setErrors] = useState({});

    const handle = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); setErrors(p => ({ ...p, [name]: '' })); };

    const submit = (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave(form);
    };

    const inp = (field) => ({ width: '100%', padding: '9px 12px', borderRadius: '6px', boxSizing: 'border-box', border: `1px solid ${errors[field] ? '#e53935' : '#ddd'}`, fontSize: '14px', marginTop: '5px' });
    const lbl = { display: 'block', fontWeight: '600', fontSize: '13px', color: '#444' };
    const err = { color: '#e53935', fontSize: '11px', marginTop: '3px' };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '10px', width: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                <h3 style={{ margin: '0 0 20px', borderBottom: `2px solid ${GREEN}`, paddingBottom: '10px', fontSize: '16px' }}>
                    {mode === 'add' ? '➕ Thêm Độc giả mới' : `✏️ Sửa thông tin: ${data?.MaThanhVien}`}
                </h3>
                <form onSubmit={submit}>
                    {[['HoTen','Họ và tên','Nguyễn Văn A'],['Email','Email','example@email.com'],['SoDienThoai','Số điện thoại','0901234567']].map(([name, label, ph]) => (
                        <div key={name} style={{ marginBottom: '14px' }}>
                            <label style={lbl}>{label} <span style={{ color: 'red' }}>*</span></label>
                            <input name={name} value={form[name]} onChange={handle} style={inp(name)} placeholder={ph} />
                            {errors[name] && <p style={err}>⚠ {errors[name]}</p>}
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '9px 18px', background: '#e0e0e0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Hủy bỏ</button>
                        <button type="submit" style={{ padding: '9px 20px', background: GREEN, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                            {mode === 'add' ? '✅ Thêm mới' : '💾 Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DocGiaManagement = ({ user }) => {
    const [list, setList]           = useState(mockData.docgia);
    const [search, setSearch]       = useState('');
    const [modal, setModal]         = useState(null);
    const isAdmin = user?.role === 'admin';

    const genMa = () => { const max = list.reduce((m, d) => Math.max(m, parseInt(d.MaThanhVien.replace('DG',''))), 0); return `DG${String(max+1).padStart(3,'0')}`; };

    const handleSave = (form) => {
        if (modal.mode === 'add') setList(p => [...p, { MaThanhVien: genMa(), ...form }]);
        else setList(p => p.map(d => d.MaThanhVien === modal.data.MaThanhVien ? { ...d, ...form } : d));
        setModal(null);
    };

    const handleDelete = (ma, ten) => {
        if (window.confirm(`Xác nhận xóa độc giả "${ten}" (${ma})?`)) setList(p => p.filter(d => d.MaThanhVien !== ma));
    };

    const filtered = list.filter(d => [d.HoTen, d.Email, d.MaThanhVien].some(s => s.toLowerCase().includes(search.toLowerCase())));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>👤 Quản lý Độc giả</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Tổng: {list.length} độc giả trong hệ thống</p>
                </div>
                {isAdmin && <button onClick={() => setModal({ mode: 'add', data: null })} style={{ background: GREEN, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>+ Thêm độc giả</button>}
            </div>

            <div style={{ marginBottom: '16px' }}>
                <input type="text" placeholder="🔍  Tìm theo tên, email hoặc mã thẻ..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '320px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            </div>

            <div className="table-container">
                <table>
                    <thead><tr>
                        <th>Mã thẻ</th><th>Họ và tên</th><th>Email</th><th>Số điện thoại</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr></thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(d => (
                            <tr key={d.MaThanhVien}>
                                <td><code style={{ background: LIGHT, color: GREEN, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{d.MaThanhVien}</code></td>
                                <td><strong>{d.HoTen}</strong></td>
                                <td style={{ color: '#555' }}>{d.Email}</td>
                                <td>{d.SoDienThoai}</td>
                                {isAdmin && (
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => setModal({ mode: 'edit', data: d })} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>✏️</button>
                                        <button onClick={() => handleDelete(d.MaThanhVien, d.HoTen)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', marginLeft: '8px' }}>🗑️</button>
                                    </td>
                                )}
                            </tr>
                        )) : <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '32px', color: '#bbb' }}>Không tìm thấy độc giả nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {modal && <DocGiaModal mode={modal.mode} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        </div>
    );
};

export default DocGiaManagement;
