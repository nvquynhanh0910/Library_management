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
    // Khởi tạo trạng thái view mặc định là trang quản lý đầu sách
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [currentView, setCurrentView] = useState("dausach");

    //xử lý đăng nhập
    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user)); // thêm dòng này
        if (user?.role === 'admin') {
            setCurrentView("dashboard"); //admin đăng nhập -> mặc định là trang dashboard
        } else {
            setCurrentView("dausach");// Độc giả đăng nhập -> mặc định là trang Đầu sách
        }
    };
    //XỬ LÝ ĐĂNG XUẤT: reset state trạng thái cũ
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');   // thêm dòng này
        localStorage.removeItem('token');  // thêm dòng này
        setCurrentView("dausach");
    };

    // Kiểm tra trạng thái đăng nhập
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // HÀM ĐIỀU PHỐI MÀN HÌNH
    const renderMainContent = () => {
    const isAdmin = currentUser?.role === 'admin';

    switch (currentView) {
        case "dashboard":
            return isAdmin ? <Dashboard1 key={currentView} user={currentUser} /> : <BookManagement key={currentView} user={currentUser} />;
        case "dausach":
            return <BookManagement key={currentView} user={currentUser} />;
        case "cuonsach":
            return <BookItemsManagement key={currentView} user={currentUser} />;
        case "theloai":
            return <CategoryManagement key={currentView} user={currentUser} />;
        case "tacgia":
            return <AuthorManagement key={currentView} user={currentUser} />;
        case "nxb":
            return <PublisherManagement key={currentView} user={currentUser} />;
        case "muonsach":
            return <MuonSachManagement key={currentView} user={currentUser} />;
        case "phieuphat":
            return <PhieuPhatManagement key={currentView} user={currentUser} />;
        case "docgia":
            return isAdmin ? <DocGiaManagement key={currentView} user={currentUser} /> : <BookManagement key={currentView} user={currentUser} />;
        case "nhanvien":
            return isAdmin ? <NhanVienManagement key={currentView} user={currentUser} /> : <BookManagement key={currentView} user={currentUser} />;
        default:
            return <BookManagement key={currentView} user={currentUser} />;
    }
};

    // RENDER LAYOUT CHÍNH
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