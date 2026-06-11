import React, { useState } from 'react';
import { mockData } from '../data/mockdata';

const G  = '#7DA78C';
const GL = '#e8f5ec';

const validate = (f) => {
    const e = {};
    if (!f.HoTen.trim())         e.HoTen = 'Họ tên không được để trống';
    if (!f.Email.trim())         e.Email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.Email)) e.Email = 'Email không hợp lệ';
    if (!f.SoDienThoai.trim())   e.SoDienThoai = 'Số điện thoại không được để trống';
    else if (!/^0\d{9}$/.test(f.SoDienThoai)) e.SoDienThoai = 'SĐT phải 10 số, bắt đầu bằng 0';
    return e;
};

const Modal = ({ mode, data, onSave, onClose }) => {
    const init = mode === 'edit'
        ? { HoTen: data.HoTen, Email: data.Email, SoDienThoai: data.SoDienThoai }
        : { HoTen: '', Email: '', SoDienThoai: '' };
    const [form, setForm]     = useState(init);
    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: '' }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave(form);
    };

    const inp = (field) => ({
        width: '100%', padding: '9px 11px', borderRadius: '6px', boxSizing: 'border-box',
        border: `1px solid ${errors[field] ? '#e53935' : '#ddd'}`, fontSize: '14px', marginTop: '5px',
    });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '28px', borderRadius: '10px', width: '420px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
                <h3 style={{ margin: '0 0 18px', borderBottom: `2px solid ${G}`, paddingBottom: '10px', fontSize: '15px' }}>
                    {mode === 'add' ? '➕ Thêm Độc giả mới' : `✏️ Sửa: ${data?.MaThanhVien}`}
                </h3>
                <form onSubmit={onSubmit}>
                    {[['HoTen','Họ và tên','Nguyễn Văn A'],['Email','Email','example@email.com'],['SoDienThoai','Số điện thoại','0901234567']].map(([name,lbl,ph]) => (
                        <div key={name} style={{ marginBottom: '13px' }}>
                            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#444' }}>{lbl} <span style={{ color: 'red' }}>*</span></label>
                            <input name={name} value={form[name]} onChange={onChange} placeholder={ph} style={inp(name)} />
                            {errors[name] && <p style={{ color: '#e53935', fontSize: '11px', margin: '3px 0 0' }}>⚠ {errors[name]}</p>}
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
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

const DocGiaManagement = ({ user }) => {
    const [list, setList]     = useState(mockData.docgia);
    const [search, setSearch] = useState('');
    const [modal, setModal]   = useState(null);
    const isAdmin = user?.role === 'admin';

    const nextMa = () => {
        const max = list.reduce((m, d) => Math.max(m, parseInt(d.MaThanhVien.replace('DG', ''))), 0);
        return `DG${String(max + 1).padStart(3, '0')}`;
    };

    const onSave = (form) => {
        if (modal.mode === 'add') {
            setList(p => [...p, { MaThanhVien: nextMa(), ...form }]);
        } else {
            setList(p => p.map(d => d.MaThanhVien === modal.data.MaThanhVien ? { ...d, ...form } : d));
        }
        setModal(null);
    };

    const onDelete = (ma, ten) => {
        if (window.confirm(`Xác nhận xóa độc giả "${ten}" (${ma})?`))
            setList(p => p.filter(d => d.MaThanhVien !== ma));
    };

    const filtered = list.filter(d =>
        [d.HoTen, d.Email, d.MaThanhVien].some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>👤 Quản lý Độc giả</h2>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#999' }}>Tổng: {list.length} độc giả</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setModal({ mode: 'add', data: null })} style={{ background: G, color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                        + Thêm độc giả
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '14px' }}>
                <input type="text" placeholder="🔍  Tìm theo tên, email hoặc mã thẻ..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '300px', padding: '9px 13px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã thẻ</th><th>Họ và tên</th><th>Email</th><th>Số điện thoại</th>
                            {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(d => (
                            <tr key={d.MaThanhVien}>
                                <td><code style={{ background: GL, color: G, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{d.MaThanhVien}</code></td>
                                <td><strong>{d.HoTen}</strong></td>
                                <td style={{ color: '#666' }}>{d.Email}</td>
                                <td>{d.SoDienThoai}</td>
                                {isAdmin && (
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => setModal({ mode: 'edit', data: d })} className="btn-icon" title="Sửa">✏️</button>
                                        <button onClick={() => onDelete(d.MaThanhVien, d.HoTen)} className="btn-icon delete" title="Xóa">🗑️</button>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '28px', color: '#ccc' }}>Không tìm thấy kết quả nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && <Modal mode={modal.mode} data={modal.data} onSave={onSave} onClose={() => setModal(null)} />}
        </div>
    );
};

export default DocGiaManagement;
