import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const GREEN = '#7DA78C';
const LIGHT = '#e8f5ec';

const validate = (form, isAdd) => {
    const e = {};
    if (!form.HoTen.trim()) e.HoTen = 'Họ tên không được để trống';
    if (!form.Email.trim()) e.Email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) e.Email = 'Email không hợp lệ';
    if (!form.SoDienThoai.trim()) e.SoDienThoai = 'Số điện thoại không được để trống';
    else if (!/^0\d{9}$/.test(form.SoDienThoai)) e.SoDienThoai = 'SĐT phải 10 số, bắt đầu bằng 0';
    if (isAdd) {
        if (!form.MatKhau.trim()) e.MatKhau = 'Mật khẩu không được để trống';
        else if (form.MatKhau.length < 6) e.MatKhau = 'Mật khẩu tối thiểu 6 ký tự';
    }
    return e;
};

const DocGiaModal = ({ mode, data, onSave, onClose }) => {
    const initForm = mode === 'edit'
        ? { HoTen: data.HoTen, Email: data.Email, SoDienThoai: data.SoDienThoai }
        : { HoTen: '', Email: '', SoDienThoai: '', MatKhau: '' };

    const [form, setForm]     = useState(initForm);
    const [errors, setErrors] = useState({});

    const handle = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: '' }));
    };

    const submit = (e) => {
        e.preventDefault();
        const errs = validate(form, mode === 'add');
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave(form);
    };

    const inp = (field) => ({
        width: '100%', padding: '9px 12px', borderRadius: '6px',
        boxSizing: 'border-box',
        border: `1px solid ${errors[field] ? '#e53935' : '#ddd'}`,
        fontSize: '14px', marginTop: '5px'
    });
    const lbl = { display: 'block', fontWeight: '600', fontSize: '13px', color: '#444' };
    const err = { color: '#e53935', fontSize: '11px', marginTop: '3px' };

    const fields = mode === 'add'
        ? [['HoTen', 'Họ và tên', 'Nguyễn Văn A', 'text'], ['Email', 'Email', 'example@email.com', 'email'], ['SoDienThoai', 'Số điện thoại', '0901234567', 'text'], ['MatKhau', 'Mật khẩu', 'Tối thiểu 6 ký tự', 'password']]
        : [['HoTen', 'Họ và tên', 'Nguyễn Văn A', 'text'], ['Email', 'Email', 'example@email.com', 'email'], ['SoDienThoai', 'Số điện thoại', '0901234567', 'text']];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '10px', width: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                <h3 style={{ margin: '0 0 20px', borderBottom: `2px solid ${GREEN}`, paddingBottom: '10px', fontSize: '16px' }}>
                    {mode === 'add' ? '➕ Thêm Độc giả mới' : `✏️ Sửa thông tin: ${data?.MaThanhVien}`}
                </h3>
                <form onSubmit={submit}>
                    {fields.map(([name, label, ph, type]) => (
                        <div key={name} style={{ marginBottom: '14px' }}>
                            <label style={lbl}>{label} <span style={{ color: 'red' }}>*</span></label>
                            <input name={name} type={type} value={form[name]} onChange={handle} style={inp(name)} placeholder={ph} />
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
    const [list, setList]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [search, setSearch]   = useState('');
    const [modal, setModal]     = useState(null);
    const isAdmin = user?.role === 'admin';

    const fetchList = async () => {
        try {
            setLoading(true);
            const res = await api.get('/members');
            setList(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách độc giả');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    const handleSave = async (form) => {
        try {
            if (modal.mode === 'add') {
                // POST /api/auth/member/register
                await api.post('/auth/member/register', form);
            } else {
                // PUT /api/members/:id
                await api.put(`/members/${modal.data.MaThanhVien}`, {
                    HoTen: form.HoTen,
                    Email: form.Email,
                    SoDienThoai: form.SoDienThoai,
                });
            }
            setModal(null);
            fetchList();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (ma, ten) => {
        if (!window.confirm(`Xác nhận xóa độc giả "${ten}" (${ma})?`)) return;
        try {
            await api.delete(`/members/${ma}`);
            fetchList();
        } catch (err) {
            alert(err.response?.data?.message || 'Xóa thất bại');
        }
    };

    const filtered = list.filter(d =>
        [d.HoTen, d.Email, d.MaThanhVien, d.SoDienThoai]
            .some(s => s?.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>⏳ Đang tải...</div>;
    if (error)   return <div style={{ padding: 40, textAlign: 'center', color: '#d9534f' }}>❌ {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>👤 Quản lý Độc giả</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Tổng: {list.length} độc giả trong hệ thống</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setModal({ mode: 'add', data: null })}
                        style={{ background: GREEN, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                        + Thêm độc giả
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '16px' }}>
                <input type="text" placeholder="🔍  Tìm theo tên, email hoặc mã thẻ..."
                    value={search} onChange={e => setSearch(e.target.value)}
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
                        )) : (
                            <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '32px', color: '#bbb' }}>Không tìm thấy độc giả nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && <DocGiaModal mode={modal.mode} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        </div>
    );
};

export default DocGiaManagement;
