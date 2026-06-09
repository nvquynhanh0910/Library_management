import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const G  = '#7DA78C';
const GL = '#e8f5ec';
const CHUC_VU = ['Thủ thư', 'Nhân viên', 'Quản lý'];

const CV_STYLE = {
    'Quản lý':   { background: '#e3f2fd', color: '#1565c0' },
    'Thủ thư':   { background: GL,        color: G          },
    'Nhân viên': { background: '#fff8e1', color: '#e65100'  },
};

const validate = (f) => {
    const e = {};
    if (!f.TenNhanVien.trim()) e.TenNhanVien = 'Tên không được để trống';
    if (!f.ChucVu)             e.ChucVu      = 'Vui lòng chọn chức vụ';
    if (!f.Username.trim())    e.Username    = 'Username không được để trống';
    else if (f.Username.length < 4) e.Username = 'Username tối thiểu 4 ký tự';
    return e;
};

const Modal = ({ mode, data, onSave, onClose }) => {
    const init = mode === 'edit'
        ? { TenNhanVien: data.TenNhanVien, ChucVu: data.ChucVu, Username: data.Username }
        : { TenNhanVien: '', ChucVu: '', Username: '' };
    const [form, setForm]     = useState(init);
    const [errors, setErrors] = useState({});

    const onChange = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); setErrors(p => ({ ...p, [name]: '' })); };
    const onSubmit = (e) => { e.preventDefault(); const errs = validate(form); if (Object.keys(errs).length) { setErrors(errs); return; } onSave(form); };

    const inp = (field) => ({ width: '100%', padding: '9px 11px', borderRadius: '6px', boxSizing: 'border-box', border: `1px solid ${errors[field] ? '#e53935' : '#ddd'}`, fontSize: '14px', marginTop: '5px' });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '28px', borderRadius: '10px', width: '420px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
                <h3 style={{ margin: '0 0 18px', borderBottom: `2px solid ${G}`, paddingBottom: '10px', fontSize: '15px' }}>
                    {mode === 'add' ? '➕ Thêm Nhân viên mới' : `✏️ Sửa: ${data?.MaNhanVien}`}
                </h3>
                <form onSubmit={onSubmit}>
                    <div style={{ marginBottom: '13px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#444' }}>Tên nhân viên <span style={{ color: 'red' }}>*</span></label>
                        <input name="TenNhanVien" value={form.TenNhanVien} onChange={onChange} placeholder="Nguyễn Thị Trang" style={inp('TenNhanVien')} />
                        {errors.TenNhanVien && <p style={{ color: '#e53935', fontSize: '11px', margin: '3px 0 0' }}>⚠ {errors.TenNhanVien}</p>}
                    </div>
                    <div style={{ marginBottom: '13px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#444' }}>Chức vụ <span style={{ color: 'red' }}>*</span></label>
                        <select name="ChucVu" value={form.ChucVu} onChange={onChange} style={{ ...inp('ChucVu'), background: 'white' }}>
                            <option value="">-- Chọn chức vụ --</option>
                            {CHUC_VU.map(cv => <option key={cv}>{cv}</option>)}
                        </select>
                        {errors.ChucVu && <p style={{ color: '#e53935', fontSize: '11px', margin: '3px 0 0' }}>⚠ {errors.ChucVu}</p>}
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#444' }}>Username <span style={{ color: 'red' }}>*</span></label>
                        <input name="Username" value={form.Username} onChange={onChange} placeholder="nhanvien01" style={inp('Username')} />
                        {errors.Username && <p style={{ color: '#e53935', fontSize: '11px', margin: '3px 0 0' }}>⚠ {errors.Username}</p>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 18px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                        <button type="submit" style={{ padding: '8px 20px', background: G, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                            {mode === 'add' ? '✅ Thêm mới' : '💾 Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const NhanVienManagement = ({ user }) => {
    const [list, setList]     = useState(mockData.nhanvien);
    const [search, setSearch] = useState('');
    const [modal, setModal]   = useState(null);
    const isAdmin = user?.role === 'admin';

    const nextMa = () => { const max = list.reduce((m, d) => Math.max(m, parseInt(d.MaNhanVien.replace('NV', ''))), 0); return `NV${String(max + 1).padStart(3, '0')}`; };

    const onSave = (form) => {
        if (modal.mode === 'add') setList(p => [...p, { MaNhanVien: nextMa(), ...form }]);
        else setList(p => p.map(d => d.MaNhanVien === modal.data.MaNhanVien ? { ...d, ...form } : d));
        setModal(null);
    };

    const onDelete = (ma, ten) => {
        if (window.confirm(`Xác nhận xóa nhân viên "${ten}" (${ma})?`)) setList(p => p.filter(d => d.MaNhanVien !== ma));
    };

    const filtered = list.filter(d => [d.TenNhanVien, d.Username, d.MaNhanVien, d.ChucVu].some(s => s.toLowerCase().includes(search.toLowerCase())));

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>🧑‍💼 Quản lý Nhân viên</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#999' }}>Tổng: {list.length} nhân viên</p>
                </div>
                {isAdmin && <button onClick={() => setModal({ mode: 'add', data: null })} style={{ background: G, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>+ Thêm nhân viên</button>}
            </div>

            <div style={{ marginBottom: '14px' }}>
                <input type="text" placeholder="🔍  Tìm theo tên, username hoặc chức vụ..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '320px', padding: '9px 13px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            </div>

            <div className="table-container">
                <table>
                    <thead><tr>
                        <th>Mã NV</th><th>Tên nhân viên</th><th>Chức vụ</th><th>Username</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr></thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(d => {
                            const cs = CV_STYLE[d.ChucVu] || { background: '#eee', color: '#555' };
                            return (
                                <tr key={d.MaNhanVien}>
                                    <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{d.MaNhanVien}</code></td>
                                    <td><strong>{d.TenNhanVien}</strong></td>
                                    <td><span style={{ ...cs, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{d.ChucVu}</span></td>
                                    <td><code style={{ color: '#777' }}>{d.Username}</code></td>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'center' }}>
                                            <button onClick={() => setModal({ mode: 'edit', data: d })} className="btn-icon" title="Sửa">✏️</button>
                                            <button onClick={() => onDelete(d.MaNhanVien, d.TenNhanVien)} className="btn-icon delete" title="Xóa">🗑️</button>
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '28px', color: '#ccc' }}>Không tìm thấy kết quả nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {modal && <Modal mode={modal.mode} data={modal.data} onSave={onSave} onClose={() => setModal(null)} />}
        </div>
    );
};

export default NhanVienManagement;
