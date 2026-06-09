import React, { useState } from 'react';
import MainLayout from './component/MainLayout';
import LoginPage from './page/LoginPage';

import BookManagement from './page/BookManagement';
import BookItemsManagement from './page/BookItemsManagement';
import CategoryManagement from './page/CategoryManagement';
import AuthorManagement from './page/AuthorManagement';
import PublisherManagement from './page/PublisherManagement';

import Dashboard from './page/Dashboard';
import DocGiaManagement from './page/DocGiaManagement';
import NhanVienManagement from './page/NhanVienManagement';
import MuonSachManagement from './page/MuonSachManagement';
import PhieuPhatManagement from './page/PhieuPhatManagement';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState("dashboard");

    const handleLogin = (user) => {
        setCurrentUser(user);
        setCurrentView("dashboard"); 
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderMainContent = () => {
        switch (currentView) {
            case "dausach":   return <BookManagement user={currentUser} />;
            case "cuonsach":  return <BookItemsManagement user={currentUser} />;
            case "theloai":   return <CategoryManagement user={currentUser} />;
            case "tacgia":    return <AuthorManagement user={currentUser} />;
            case "nxb":       return <PublisherManagement user={currentUser} />;
            case "dashboard": return <Dashboard user={currentUser} />;
            case "docgia":    return <DocGiaManagement user={currentUser} />;
            case "nhanvien":  return <NhanVienManagement user={currentUser} />;
            case "muonsach":  return <MuonSachManagement user={currentUser} />;
            case "phieuPhat": return <PhieuPhatManagement user={currentUser} />;
            default:          return <Dashboard user={currentUser} />;
        }
    };

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
