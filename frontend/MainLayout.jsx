import React, { useState } from 'react';
import './MainLayout.css';

const MainLayout = ({ children, user, onLogout, onViewChange, currentView }) => {
  const [openGroups, setOpenGroups] = useState({
    thongKe: true,   // Mở sẵn để thấy Dashboard ngay khi vào
    khoSach: false,
    dichVu:  false,
    heThong: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isAdmin = user?.role === 'admin';

  return (
      <div className="admin-container">
        <header className="navbar">
          <div className="logo-section">
            <span className="logo-text">🌺 Winx Enchantix LIBRARY</span>
          </div>
          <div className="user-profile">
            <span className="notification">🔔 <small>3</small></span>
            <span className="avatar">👤</span>
            <span className="username">{user?.name || "Ẩn danh"}</span>
          </div>
        </header>

        <div className="body-wrapper">
          <aside className="sidebar">
            <nav>
              <ul>

                {/* ── THỐNG KÊ ── */}
                <li className="menu-group" onClick={() => toggleGroup('thongKe')}>
                  THỐNG KÊ {openGroups.thongKe ? '▾' : '▸'}
                </li>
                {openGroups.thongKe && (
                  <li
                    onClick={() => onViewChange("dashboard")}
                    style={{ cursor: 'pointer', paddingLeft: '20px' }}
                    className={currentView === "dashboard" ? "active" : ""}
                  >
                    📊 Dashboard
                  </li>
                )}

                {/* ── QUẢN LÝ KHO SÁCH ── */}
                <li className="menu-group" onClick={() => toggleGroup('khoSach')}>
                  QUẢN LÝ KHO SÁCH {openGroups.khoSach ? '▾' : '▸'}
                </li>
                {openGroups.khoSach && (
                  <>
                    <li
                      onClick={() => onViewChange("dausach")}
                      style={{ cursor: 'pointer', paddingLeft: '20px' }}
                      className={currentView === "dausach" ? "active" : ""}
                    >
                      📚 Danh mục Đầu sách
                    </li>
                    {isAdmin && (
                      <>
                        <li
                          onClick={() => onViewChange("cuonsach")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "cuonsach" ? "active" : ""}
                        >
                          📖 Quản lý Cuốn sách
                        </li>
                        <li
                          onClick={() => onViewChange("theloai")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "theloai" ? "active" : ""}
                        >
                          🏷️ Thể loại
                        </li>
                        <li
                          onClick={() => onViewChange("tacgia")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "tacgia" ? "active" : ""}
                        >
                          ✍️ Tác giả
                        </li>
                        <li
                          onClick={() => onViewChange("nxb")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "nxb" ? "active" : ""}
                        >
                          🏢 Nhà xuất bản
                        </li>
                      </>
                    )}
                  </>
                )}

                {/* ── DỊCH VỤ ── */}
                <li className="menu-group" onClick={() => toggleGroup('dichVu')}>
                  DỊCH VỤ {openGroups.dichVu ? '▾' : '▸'}
                </li>
                {openGroups.dichVu && (
                  <>
                    {isAdmin ? (
                      <>
                        <li
                          onClick={() => onViewChange("muonsach")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "muonsach" ? "active" : ""}
                        >
                          🔄 Mượn & Trả sách
                        </li>
                        <li
                          onClick={() => onViewChange("phieuPhat")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "phieuPhat" ? "active" : ""}
                        >
                          💳 Phiếu phạt
                        </li>
                      </>
                    ) : (
                      <li
                        onClick={() => onViewChange("muonsach")}
                        style={{ cursor: 'pointer', paddingLeft: '20px' }}
                        className={currentView === "muonsach" ? "active" : ""}
                      >
                        📋 Lịch sử mượn của tôi
                      </li>
                    )}
                  </>
                )}

                {/* ── HỆ THỐNG (chỉ Admin) ── */}
                {isAdmin && (
                  <>
                    <li className="menu-group" onClick={() => toggleGroup('heThong')}>
                      HỆ THỐNG {openGroups.heThong ? '▾' : '▸'}
                    </li>
                    {openGroups.heThong && (
                      <>
                        <li
                          onClick={() => onViewChange("docgia")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "docgia" ? "active" : ""}
                        >
                          👤 Quản lý Độc giả
                        </li>
                        <li
                          onClick={() => onViewChange("nhanvien")}
                          style={{ cursor: 'pointer', paddingLeft: '20px' }}
                          className={currentView === "nhanvien" ? "active" : ""}
                        >
                          🧑‍💼 Quản lý Nhân viên
                        </li>
                      </>
                    )}
                  </>
                )}

                {/* ── ĐĂNG XUẤT ── */}
                <li className="logout" onClick={onLogout}>🚪 Đăng xuất</li>

              </ul>
            </nav>
          </aside>

          <main className="main-content">
            {children}
          </main>
        </div>
      </div>
  );
};

export default MainLayout;
