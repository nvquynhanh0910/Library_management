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
    // Khởi tạo trạng thái view mặc định là trang quản lý đầu sách
    const [currentView, setCurrentView] = useState("dausach");

    //xử lý đăng nhập
    const handleLogin = (user) => {
        setCurrentUser(user);

        if (user?.role === 'admin') {
            setCurrentView("dashboard"); //admin đăng nhập -> mặc định là trang dashboard
        } else {
            setCurrentView("dausach");    // Độc giả đăng nhập -> mặc định là trang Đầu sách
        }
    };

    //XỬ LÝ ĐĂNG XUẤT: reset state trạng thái cũ
    const handleLogout = () => {
        setCurrentUser(null);
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
                //kiểm tra admin
                return isAdmin ? <Dashboard1 user={currentUser} /> : <BookManagement user={currentUser} />;

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

            //CÁC TAB HỆ THỐNG CHỈ ADMIN ĐƯỢC PHÉP TRUY CẬP
            case "docgia":
                return isAdmin ? <DocGiaManagement user={currentUser} /> : <BookManagement user={currentUser} />;

            case "nhanvien":
                return isAdmin ? <NhanVienManagement user={currentUser} /> : <BookManagement user={currentUser} />;

            default:
                return <BookManagement user={currentUser} />;
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