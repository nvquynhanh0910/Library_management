const { sequelize, BookTitle, Book, Member, User, Borrowing, BorrowingSlip, PunishmentSlip, Category } = require('../models');
const { Op } = require('sequelize');

const getDashboard = async (req, res) => {
    try {
        // ── 1. Thẻ tóm tắt ──────────────────────────────────────────
        const [tongDauSach, tongCuonSach, tongDocGia, tongNhanVien] = await Promise.all([
            BookTitle.count(),
            Book.count(),
            Member.count(),
            User.count(),
        ]);

        const dangMuon = await Book.count({ where: { TinhTrang: 'Đang mượn' } });

        const quaHan = await Borrowing.count({
            where: {
                HanTra: { [Op.lt]: new Date() },
                NgayTraThucTe: null
            }
        });

        // ── 2. Top 5 sách được mượn nhiều nhất (group theo đầu sách) ──
        const [topSachRaw] = await sequelize.query(`
            SELECT TOP 5 bt.MaDauSach, bt.TenSach, COUNT(ms.MaCuonSach) AS SoLanMuon
            FROM MuonSach ms
            JOIN CuonSach cs ON ms.MaCuonSach = cs.MaCuonSach
            JOIN DauSach bt  ON cs.MaDauSach  = bt.MaDauSach
            GROUP BY bt.MaDauSach, bt.TenSach
            ORDER BY SoLanMuon DESC
        `);

        const topSach = topSachRaw.map(r => ({
            TenSach:   r.TenSach || '—',
            SoLanMuon: parseInt(r.SoLanMuon)
        }));

        // ── 3. Tỉ lệ mượn theo thể loại ─────────────────────────────
        const COLORS = ['#7DA78C', '#f0ad4e', '#5bc0de', '#d9534f', '#9b59b6', '#1abc9c'];

        const [theoTheLoaiRaw] = await sequelize.query(`
            SELECT tl.MaTheLoai, tl.TenTheLoai, COUNT(ms.MaCuonSach) AS SoLanMuon
            FROM MuonSach ms
            JOIN CuonSach cs  ON ms.MaCuonSach = cs.MaCuonSach
            JOIN DauSach bt   ON cs.MaDauSach  = bt.MaDauSach
            JOIN TheLoai tl   ON bt.MaTheLoai  = tl.MaTheLoai
            GROUP BY tl.MaTheLoai, tl.TenTheLoai
            ORDER BY SoLanMuon DESC
        `);

        const theoTheLoai = theoTheLoaiRaw.map((r, i) => ({
            TenTheLoai: r.TenTheLoai || 'Khác',
            SoLanMuon:  parseInt(r.SoLanMuon),
            color:      COLORS[i % COLORS.length]
        }));

        // ── 4. Xu hướng mượn - trả theo tháng (12 tháng gần nhất) ──
        const now = new Date();
        const theoThang = [];

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            const endOfMonth   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

            const [muon, tra] = await Promise.all([
                BorrowingSlip.count({
                    where: { NgayLapPhieu: { [Op.between]: [startOfMonth, endOfMonth] } }
                }),
                Borrowing.count({
                    where: { NgayTraThucTe: { [Op.between]: [startOfMonth, endOfMonth] } }
                })
            ]);

            theoThang.push({
                thang: `T${d.getMonth() + 1}`,
                muon,
                tra
            });
        }

        res.json({
            tongDauSach,
            tongCuonSach,
            dangMuon,
            quaHan,
            tongDocGia,
            tongNhanVien,
            topSach,
            theoTheLoai,
            theoThang
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getDashboard };