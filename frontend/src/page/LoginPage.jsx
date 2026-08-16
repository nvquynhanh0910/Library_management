import React, { useState } from 'react';
import api from '../api/axios';

const LoginPage = ({ onLogin }) => {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Đăng nhập nhân viên
    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { Username: username, Password: password });
            localStorage.setItem('token', res.data.token);
            onLogin(res.data.user);
        } catch (err) {
            // Thử login độc giả nếu nhân viên thất bại
            try {
                const res = await api.post('/auth/member/login', { Email: username, MatKhau: password });
                localStorage.setItem('token', res.data.token);
                onLogin(res.data.user);
            } catch {
                setError('❌ Tài khoản hoặc mật khẩu không chính xác!');
            }
        } finally {
            setLoading(false);
        }
    };

    // Đăng ký độc giả
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/member/register', {
                HoTen: fullName,
                Email: username,
                SoDienThoai: soDienThoai,
                MatKhau: password
            });
            alert('🎉 Đăng ký tài khoản Độc giả thành công! Hãy đăng nhập lại.');
            setMode('login');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || '❌ Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '360px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>

                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>
                    {mode === 'login' ? '🔑 ĐĂNG NHẬP HỆ THỐNG' : '📝 ĐĂNG KÝ ĐỘC GIẢ'}
                </h2>

                {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

                {mode === 'login' && (
                    <form onSubmit={handleSignInSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tài khoản / Email:</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Mật khẩu:</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                            Chưa có tài khoản? <span onClick={() => { setMode('signup'); setError(''); }} style={{ color: '#7DA78C', cursor: 'pointer', fontWeight: 'bold' }}>Đăng ký ngay</span>
                        </p>
                    </form>
                )}

                {mode === 'signup' && (
                    <form onSubmit={handleSignUpSubmit}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Họ và tên:</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email:</label>
                            <input type="email" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Số điện thoại:</label>
                            <input type="text" value={soDienThoai} onChange={e => setSoDienThoai(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Mật khẩu:</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                            Đã có tài khoản? <span onClick={() => { setMode('login'); setError(''); }} style={{ color: '#4A90E2', cursor: 'pointer', fontWeight: 'bold' }}>Quay lại Đăng nhập</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;