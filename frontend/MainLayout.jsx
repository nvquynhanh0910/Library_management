import React, { useState } from 'react';
import './MainLayout.css';

const MainLayout = ({ children, user, onLogout, onViewChange, currentView }) => {
  const isAdmin = user?.role === 'admin';

  const [openGroups, setOpenGroups] = useState({
    thongKe: true,
    khoSach: true,
    dichVu:  true,
    heThong: true,
  });

  const toggle = (key) =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const NavItem = ({ viewKey, icon, label }) => (
    <li
      onClick={() => onViewChange(viewKey)}
      style={{ cursor: 'pointer', paddingLeft: '20px' }}
      className={currentView === viewKey ? 'active' : ''}
    >
      {icon}&nbsp; {label}
    </li>
  );

  return (
    <div className="admin-container">
      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="logo-section">
          <span className="logo-text">🌺 Winx Enchantix LIBRARY</span>
        </div>
        <div className="user-profile">
          <span className="notification">🔔 <small>3</small></span>
          <span className="avatar">👤</span>
          <span className="username">{user?.name || 'Ẩn danh'}</span>
        </div>
      </header>

      <div className="body-wrapper">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <nav>
            <ul>

              {/* ─── THỐNG KÊ ─── */}
              <li className="menu-group" onClick={() => toggle('thongKe')}>
                THỐNG KÊ {openGroups.thongKe ? '▾' : '▸'}
              </li>
              {openGroups.thongKe && (
                <NavItem viewKey="dashboard" icon="📊" label="Dashboard" />
              )}

              {/* ─── KHO SÁCH ─── */}
              <li className="menu-group" onClick={() => toggle('khoSach')}>
                QUẢN LÝ KHO SÁCH {openGroups.khoSach ? '▾' : '▸'}
              </li>
              {openGroups.khoSach && (
                <>
                  <NavItem viewKey="dausach"  icon="📚" label="Danh mục Đầu sách" />
                  {isAdmin && (
                    <>
                      <NavItem viewKey="cuonsach" icon="📖" label="Quản lý Cuốn sách" />
                      <NavItem viewKey="theloai"  icon="🏷️" label="Thể loại"          />
                      <NavItem viewKey="tacgia"   icon="✍️" label="Tác giả"           />
                      <NavItem viewKey="nxb"      icon="🏢" label="Nhà xuất bản"      />
                    </>
                  )}
                </>
              )}

              {/* ─── DỊCH VỤ ─── */}
              <li className="menu-group" onClick={() => toggle('dichVu')}>
                DỊCH VỤ {openGroups.dichVu ? '▾' : '▸'}
              </li>
              {openGroups.dichVu && (
                <>
                  {isAdmin ? (
                    <>
                      <NavItem viewKey="muonsach"  icon="🔄" label="Mượn & Trả sách"    />
                      <NavItem viewKey="phieuPhat" icon="💳" label="Phiếu phạt"          />
                    </>
                  ) : (
                    <NavItem viewKey="muonsach" icon="📋" label="Lịch sử mượn của tôi" />
                  )}
                </>
              )}

              {/* ─── HỆ THỐNG (admin only) ─── */}
              {isAdmin && (
                <>
                  <li className="menu-group" onClick={() => toggle('heThong')}>
                    HỆ THỐNG {openGroups.heThong ? '▾' : '▸'}
                  </li>
                  {openGroups.heThong && (
                    <>
                      <NavItem viewKey="docgia"   icon="👤" label="Quản lý Độc giả"   />
                      <NavItem viewKey="nhanvien" icon="🧑‍💼" label="Quản lý Nhân viên" />
                    </>
                  )}
                </>
              )}

              <li className="logout" onClick={onLogout}>🚪 Đăng xuất</li>
            </ul>
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
