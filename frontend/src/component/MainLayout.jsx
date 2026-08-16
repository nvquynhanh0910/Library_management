import React, { useState } from 'react';
import './MainLayout.css';

const MainLayout = ({ children, user, onLogout, onViewChange, currentView }) => {
  const isAdmin = user?.role === 'admin';

  // --- CẬP NHẬT: Tự động mở nhóm phù hợp tùy theo vai trò tài khoản khi vừa đăng nhập ---
  const [openGroups, setOpenGroups] = useState({
    thongKe: isAdmin, // Nếu là Admin thì mở sẵn THỐNG KÊ, nếu là Độc giả thì đóng
    khoSach: false,
    dichVu: !isAdmin, // Nếu là Độc giả thì mở sẵn DỊCH VỤ để thấy Lịch sử mượn ngay
    heThong: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="admin-container">
      <header className="navbar">
        <div className="logo-section">
          <span className="logo-text">📖 HỆ THỐNG QUẢN LÝ THƯ VIỆN</span>
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

              {/* ── THỐNG KÊ (ĐÃ CẬP NHẬT: Chỉ hiển thị nếu là Admin) ── */}
              {isAdmin && (
                <>
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
                </>
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
                  <li
                    onClick={() => onViewChange("cuonsach")}
                    style={{ cursor: 'pointer', paddingLeft: '20px' }}
                    className={currentView === "cuonsach" ? "active" : ""}
                  >
                    📖 Danh mục cuốn sách
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
                        onClick={() => onViewChange("phieuphat")}
                        style={{ cursor: 'pointer', paddingLeft: '20px' }}
                        className={currentView === "phieuphat" ? "active" : ""}
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