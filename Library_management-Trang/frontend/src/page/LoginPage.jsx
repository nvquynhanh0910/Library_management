import React, { useState } from 'react';
import { mockUsers } from '../data/mockdata'; // Sử dụng tài khoản mẫu để test

const LoginPage = ({ onLogin }) => {
    // State quản lý chế độ hiển thị: 'login' (Đăng nhập) hoặc 'signup' (Đăng ký)
    const [mode, setMode] = useState('login');

    // State nhận dữ liệu từ các ô Input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState(''); // Thêm khi đăng ký
    const [email, setEmail] = useState('');    // Thêm khi đăng ký

    const [error, setError] = useState('');

    // Xử lý khi nhấn nút Đăng Nhập
    const handleSignInSubmit = (e) => {
        e.preventDefault();
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setError('❌ Tài khoản hoặc mật khẩu không chính xác!');
        }
    };

    // Xử lý khi nhấn nút Đăng Ký (Tạm thời ở Frontend)
    const handleSignUpSubmit = (e) => {
        e.preventDefault();

        // Giả lập đưa tài khoản mới vào hệ thống Mock Data
        const newUser = {
            username: username,
            password: password,
            role: 'guest', // Mặc định tự đăng ký là Độc giả
            name: fullName
        };

        mockUsers.push(newUser);
        alert('🎉 Đăng ký tài khoản Độc giả thành công! Hãy đăng nhập lại.');
        setMode('login'); // Đăng ký xong tự động chuyển về form Đăng Nhập
        setError('');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '360px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>

                {/* TIÊU ĐỀ THAY ĐỔI THEO MODE */}
                <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>
                    {mode === 'login' ? '🔑 ĐĂNG NHẬP WINX' : '📝 ĐĂNG KÝ ĐỘC GIẢ'}
                </h2>

                {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

                {/* --- FORM ĐĂNG NHẬP --- */}
                {mode === 'login' && (
                    <form onSubmit={handleSignInSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tài khoản:</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Mật khẩu:</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#7DA78C', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Đăng nhập</button>

                        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                            Chưa có tài khoản? <span onClick={() => { setMode('signup'); setError(''); }} style={{ color: '#7DA78C', cursor: 'pointer', fontWeight: 'bold' }}>Đăng ký ngay</span>
                        </p>
                    </form>
                )}

                {/* --- FORM ĐĂNG KÝ --- */}
                {mode === 'signup' && (
                    <form onSubmit={handleSignUpSubmit}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Họ và tên:</label>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tên đăng nhập (Username):</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Mật khẩu:</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Tạo tài khoản</button>

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