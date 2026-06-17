import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const GREEN = '#7DA78C';
const LIGHT = '#e8f5ec';

const CHUC_VU_LIST = ['Thủ thư', 'Nhân viên', 'Quản lý'];

const validate = (form, isAdd) => {
    const e = {};
    if (!form.TenNhanVien.trim()) e.TenNhanVien = 'Tên nhân viên không được để trống';
    if (!form.ChucVu)             e.ChucVu      = 'Vui lòng chọn chức vụ';
    if (isAdd) {
        if (!form.Username.trim())     e.Username = 'Username không được để trống';
        else if (form.Username.length < 4) e.Username = 'Username tối thiểu 4 ký tự';
        if (!form.Password.trim())     e.Password = 'Mật khẩu không được để trống';
        else if (form.Password.length < 6) e.Password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    return e;
};

const NhanVienModal = ({ mode, data, onSave, onClose }) => {
    const initForm = mode === 'edit'
        ? { TenNhanVien: data.TenNhanVien, ChucVu: data.ChucVu, Username: data.Username }
        : { TenNhanVien: '', ChucVu: '', Username: '', Password: '' };

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

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '10px', width: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                <h3 style={{ margin: '0 0 20px', borderBottom: `2px solid ${GREEN}`, paddingBottom: '10px', fontSize: '16px' }}>
                    {mode === 'add' ? '➕ Thêm Nhân viên mới' : `✏️ Sửa nhân viên: ${data?.MaNhanVien}`}
                </h3>
                <form onSubmit={submit}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={lbl}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                        <input name="TenNhanVien" value={form.TenNhanVien} onChange={handle} style={inp('TenNhanVien')} placeholder="Nguyễn Thị Trang" />
                        {errors.TenNhanVien && <p style={err}>⚠ {errors.TenNhanVien}</p>}
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={lbl}>Chức vụ <span style={{ color: 'red' }}>*</span></label>
                        <select name="ChucVu" value={form.ChucVu} onChange={handle} style={{ ...inp('ChucVu'), background: 'white' }}>
                            <option value="">-- Chọn chức vụ --</option>
                            {CHUC_VU_LIST.map(cv => <option key={cv} value={cv}>{cv}</option>)}
                        </select>
                        {errors.ChucVu && <p style={err}>⚠ {errors.ChucVu}</p>}
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={lbl}>Username <span style={{ color: 'red' }}>*</span></label>
                        <input name="Username" value={form.Username} onChange={handle}
                            style={inp('Username')} placeholder="nhanvien01"
                            disabled={mode === 'edit'} />
                        {errors.Username && <p style={err}>⚠ {errors.Username}</p>}
                    </div>
                    {mode === 'add' && (
                        <div style={{ marginBottom: '22px' }}>
                            <label style={lbl}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                            <input name="Password" type="password" value={form.Password} onChange={handle} style={inp('Password')} placeholder="Tối thiểu 6 ký tự" />
                            {errors.Password && <p style={err}>⚠ {errors.Password}</p>}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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

const NhanVienManagement = ({ user }) => {
    const [list, setList]     = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState('');
    const [search, setSearch] = useState('');
    const [modal, setModal]   = useState(null);
    const isAdmin = user?.role === 'admin';

    // ── Fetch danh sách nhân viên ──────────────────────────────
    const fetchList = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setList(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    // ── Thêm / Sửa ────────────────────────────────────────────
    const handleSave = async (form) => {
        try {
            if (modal.mode === 'add') {
                // POST /api/auth/register
                await api.post('/auth/register', form);
            } else {
                // PUT /api/users/:id
                await api.put(`/users/${modal.data.MaNhanVien}`, {
                    TenNhanVien: form.TenNhanVien,
                    ChucVu: form.ChucVu,
                });
            }
            setModal(null);
            fetchList();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    // ── Xóa ───────────────────────────────────────────────────
    const handleDelete = async (ma, ten) => {
        if (!window.confirm(`Xác nhận xóa nhân viên "${ten}" (${ma})?`)) return;
        try {
            await api.delete(`/users/${ma}`);
            fetchList();
        } catch (err) {
            alert(err.response?.data?.message || 'Xóa thất bại');
        }
    };

    const filtered = list.filter(d =>
        [d.TenNhanVien, d.Username, d.MaNhanVien, d.ChucVu]
            .some(s => s?.toLowerCase().includes(search.toLowerCase()))
    );

    const chucVuStyle = {
        'Quản lý':  { bg: '#e3f2fd', color: '#1565c0' },
        'Thủ thư':  { bg: LIGHT, color: GREEN },
        'Nhân viên':{ bg: '#fff8e1', color: '#e65100' }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>⏳ Đang tải...</div>;
    if (error)   return <div style={{ padding: 40, textAlign: 'center', color: '#d9534f' }}>❌ {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#222' }}>🏢 Quản lý Nhân viên</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Tổng: {list.length} nhân viên trong hệ thống</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setModal({ mode: 'add', data: null })}
                        style={{ background: GREEN, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                        + Thêm nhân viên
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '16px' }}>
                <input type="text" placeholder="🔍  Tìm theo tên, username hoặc chức vụ..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '340px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            </div>

            <div className="table-container">
                <table>
                    <thead><tr>
                        <th>Mã NV</th><th>Tên nhân viên</th><th>Chức vụ</th><th>Username</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                    </tr></thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(d => {
                            const cvStyle = chucVuStyle[d.ChucVu] || { bg: '#eee', color: '#333' };
                            return (
                                <tr key={d.MaNhanVien}>
                                    <td><code style={{ background: LIGHT, color: GREEN, padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{d.MaNhanVien}</code></td>
                                    <td><strong>{d.TenNhanVien}</strong></td>
                                    <td><span style={{ background: cvStyle.bg, color: cvStyle.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{d.ChucVu}</span></td>
                                    <td><code style={{ color: '#555' }}>{d.Username}</code></td>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'center' }}>
                                            <button onClick={() => setModal({ mode: 'edit', data: d })} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>✏️</button>
                                            <button onClick={() => handleDelete(d.MaNhanVien, d.TenNhanVien)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', marginLeft: '8px' }}>🗑️</button>
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '32px', color: '#bbb' }}>Không tìm thấy nhân viên nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && <NhanVienModal mode={modal.mode} data={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}
        </div>
    );
};

export default NhanVienManagement;
