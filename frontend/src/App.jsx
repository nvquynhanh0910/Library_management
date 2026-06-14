import React, { useState } from 'react';
import MainLayout from './component/MainLayout';
import LoginPage from './page/LoginPage';

import Dashboard1 from './page/Dashboard1';
import BookManagement from './page/BookManagement';
import BookItemsManagement from './page/BookItemsManagement';
import CategoryManagement from './page/CategoryManagement';
import AuthorManagement from './page/AuthorManagement';
import PublisherManagement from './page/PublisherManagement';
import DocGiaManagement from './page/DocGiaManagement';
import MuonSachManagement from './page/MuonSachManagement';
import NhanVienManagement from './page/NhanVienManagement';
import PhieuPhatManagement from './page/PhieuPhatManagement';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState("dausach"); // Mặc định hiển thị trang Đầu sách

    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    // 1. Kiểm tra đăng nhập
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // 2. HÀM ĐIỀU PHỐI MÀN HÌNH - KHỚP TỪ KHÓA VỚI SIDEBAR
    const renderMainContent = () => {
        switch (currentView) {
            case "dashboard":
                return <Dashboard1 user={currentUser} />;
            case "dausach":
                return <BookManagement user={currentUser} />;
            case "cuonsach":
                return <BookItemsManagement user={currentUser} />;
            case "theloai":
                return <CategoryManagement user={currentUser} />;
            case "tacgia":
                return <AuthorManagement user={currentUser} />;
            case "nxb":
                return <PublisherManagement user={currentUser} />;
            case "muonsach":
                return <MuonSachManagement user={currentUser} />;
            case "phieuphat":
                return <PhieuPhatManagement user={currentUser} />;
            case "docgia":
                return <DocGiaManagement user={currentUser} />;
            case "nhanvien":
                return <NhanVienManagement user={currentUser} />;
            default:
                return <BookManagement user={currentUser} />;
        }
    };

    // 3. TRUYỀN THUỘC TÍNH SANG MAINLAYOUT
    return (
        <MainLayout
            user={currentUser}
            onLogout={handleLogout}
            onViewChange={setCurrentView}
            currentView={currentView}
        >
            {renderMainContent()}
        </MainLayout>
    );
}

export default App;