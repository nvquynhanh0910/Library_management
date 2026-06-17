# Library Management System (Hệ Thống Quản Lý Thư Viện)

Dự án Quản lý Thư viện là hệ thống số hóa quy trình quản lý kho sách, độc giả và nghiệp vụ mượn - trả. Hệ thống giúp tối ưu hóa việc tra cứu, kiểm soát chặt chẽ tình trạng sách, tự động tính toán phí phạt và hỗ trợ nhân viên vận hành thư viện một cách khoa học, chính xác.

---

## Công Nghệ Sử Dụng

* **Frontend:** React.js, HTML5, CSS3, Axios
* **Backend:** Node.js, Express.js, Sequelize ORM
* **Database:** Microsoft SQL Server (Bản SQLEXPRESS)

---

## Kiến Trúc Hệ Thống & Phân Quyền

Hệ thống được thiết kế theo mô hình Client-Server độc lập, phân quyền nghiêm ngặt dựa trên cơ chế JWT:

* **User (Chung):** Đăng nhập, Đăng xuất, Tra cứu danh mục công khai (Đầu sách, Cuốn sách, Tác giả, Nhà xuất bản).
* **Độc giả:** Xem lịch sử mượn trả cá nhân, kiểm tra danh sách phiếu phạt của bản thân.
* **Admin (Thủ thư):** Toàn quyền quản trị hệ thống (CRUD Đầu sách, Nhập lô cuốn sách, Quản lý tài khoản Độc giả/Nhân viên, Lập phiếu mượn/trả, Xử lý vi phạm/Phạt tiền và Xem trang thống kê Dashboard tổng quan).

---

