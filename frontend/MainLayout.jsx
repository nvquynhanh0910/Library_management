import React, { useState } from 'react';
import './MainLayout.css';

const MainLayout = ({ children, user, onLogout, onViewChange, currentView }) => {
  const [openGroups, setOpenGroups] = useState({
    thongKe: true, khoSach: false, dichVu: false, heThong: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isAdmin = user?.role === 'admin';

  const NavItem = ({ viewKey, icon, label }) => (
    <li
      onClick={() => onViewChange(viewKey)}
      style={{ cursor: 'pointer', paddingLeft: '20px' }}
      className={currentView === viewKey ? 'active' : ''}
    >
      {icon} {label}
    </li>
  );

  return (
    <div className="admin-container">
      <header className="navbar">
        <div className="logo-section"><span className="logo-text">🌺 Winx Enchantix LIBRARY</span></div>
        <div className="user-profile">
          <span className="notification">🔔 <small>3</small></span>
          <span className="avatar">👤</span>
          <span className="username">{user?.name || 'Ẩn danh'}</span>
        </div>
      </header>

      <div className="body-wrapper">
        <aside className="sidebar">
          <nav>
            <ul>
              {/* THỐNG KÊ */}
              <li className="menu-group" onClick={() => toggleGroup('thongKe')}>
                THỐNG KÊ {openGroups.thongKe ? '▾' : '▸'}
              </li>
              {openGroups.thongKe && (
                <NavItem viewKey="dashboard" icon="📊" label="Dashboard" />
              )}

              {/* KHO SÁCH */}
              <li className="menu-group" onClick={() => toggleGroup('khoSach')}>
                QUẢN LÝ KHO SÁCH {openGroups.khoSach ? '▾' : '▸'}
              </li>
              {openGroups.khoSach && (
                <>
                  <NavItem viewKey="dausach" icon="📚" label="Danh mục Đầu sách" />
                  {isAdmin && (
                    <>
                      <NavItem viewKey="cuonsach" icon="📖" label="Quản lý Cuốn sách" />
                      <NavItem viewKey="theloai"  icon="🏷️"  label="Thể loại"          />
                      <NavItem viewKey="tacgia"   icon="✍️"  label="Tác giả"           />
                      <NavItem viewKey="nxb"      icon="🏢" label="Nhà xuất bản"       />
                    </>
                  )}
                </>
              )}

              {/* DỊCH VỤ */}
              <li className="menu-group" onClick={() => toggleGroup('dichVu')}>
                DỊCH VỤ {openGroups.dichVu ? '▾' : '▸'}
              </li>
              {openGroups.dichVu && (
                <>
                  {isAdmin ? (
                    <>
                      <NavItem viewKey="muonsach"  icon="🔄" label="Mượn & Trả sách"   />
                      <NavItem viewKey="phieuPhat" icon="💳" label="Quản lý Phiếu phạt" />
                    </>
                  ) : (
                    <NavItem viewKey="lichsumuan" icon="📋" label="Lịch sử mượn của tôi" />
                  )}
                </>
              )}

              {/* HỆ THỐNG - chỉ Admin */}
              {isAdmin && (
                <>
                  <li className="menu-group" onClick={() => toggleGroup('heThong')}>
                    HỆ THỐNG {openGroups.heThong ? '▾' : '▸'}
                  </li>
                  {openGroups.heThong && (
                    <>
                      <NavItem viewKey="docgia"    icon="👤" label="Quản lý Độc giả"  />
                      <NavItem viewKey="nhanvien"  icon="🧑‍💼" label="Quản lý Nhân viên" />
                    </>
                  )}
                </>
              )}

              <li className="logout" onClick={onLogout}>🚪 Đăng xuất</li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
