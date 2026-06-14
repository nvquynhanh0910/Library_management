const { PunishmentSlip, PenaltyRule, BorrowingSlip, Member } = require('../models');
const { Op } = require('sequelize');

const includeDetail = [
    { model: PenaltyRule, attributes: ['TenHinhPhat', 'MucPhat'] },
    {
        model: BorrowingSlip,
        attributes: ['MaPhieu', 'NgayLapPhieu', 'MaThanhVien'],
        include: [{ model: Member, attributes: ['HoTen', 'SoDienThoai'] }]
    }
];

// GET /api/punishment-slips
const getAllPunishmentSlips = async (req, res) => {
    try {
        res.json(await PunishmentSlip.findAll({ include: includeDetail }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/punishment-slips/:id
const getPunishmentSlipById = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id, { include: includeDetail });
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        res.json(slip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/punishment-slips/my
const getMyPunishmentSlips = async (req, res) => {
    try {
        const slips = await PunishmentSlip.findAll({
            where: { MaPhieu: { [Op.in]: 
                // lấy các MaPhieu thuộc về độc giả này
                require('sequelize').literal(
                    `(SELECT MaPhieu FROM PhieuMuon WHERE MaThanhVien = '${req.user.MaThanhVien}')`
                )
            }},
            include: includeDetail
        });
        res.json(slips);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/punishment-slips/search?trangthaithanhtoan=&maphieu=&tungay=&denngay=
const searchPunishmentSlips = async (req, res) => {
    try {
        const { trangthaithanhtoan, maphieu, tungay, denngay } = req.query;
        const where = {};
        if (trangthaithanhtoan) where.TrangThaiThanhToan = trangthaithanhtoan;
        if (maphieu)            where.MaPhieu            = maphieu;
        if (tungay || denngay) {
            where.NgayLapPhieu = {};
            if (tungay)  where.NgayLapPhieu[Op.gte] = new Date(tungay);
            if (denngay) where.NgayLapPhieu[Op.lte] = new Date(denngay);
        }
        res.json(await PunishmentSlip.findAll({ where, include: includeDetail }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/punishment-slips
const createPunishmentSlip = async (req, res) => {
    try {
        const { MaPhieuPhat, NgayLapPhieu, TongTienPhat, TenHinhPhat, MaPhieu, MaCuonSach } = req.body;
        if (!MaPhieuPhat || !NgayLapPhieu || TongTienPhat === undefined)
            return res.status(400).json({ message: 'Thiếu thông tin phiếu phạt' });

        const slip = await PunishmentSlip.create({
            MaPhieuPhat,
            NgayLapPhieu,
            TongTienPhat,
            TrangThaiThanhToan: 'Chưa thanh toán',
            TenHinhPhat,
            MaPhieu,
            MaCuonSach
        });
        res.status(201).json(slip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/punishment-slips/:id/pay — đánh dấu đã thanh toán
const markAsPaid = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        await slip.update({ TrangThaiThanhToan: 'Đã thanh toán' });
        res.json(slip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/punishment-slips/:id
const updatePunishmentSlip = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        const { TongTienPhat, TrangThaiThanhToan, TenHinhPhat } = req.body;
        await slip.update({ TongTienPhat, TrangThaiThanhToan, TenHinhPhat });
        res.json(slip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/punishment-slips/:id
const deletePunishmentSlip = async (req, res) => {
    try {
        const slip = await PunishmentSlip.findByPk(req.params.id);
        if (!slip) return res.status(404).json({ message: 'Không tìm thấy phiếu phạt' });
        await slip.destroy();
        res.json({ message: 'Xóa phiếu phạt thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllPunishmentSlips,getMyPunishmentSlips, getPunishmentSlipById, searchPunishmentSlips, createPunishmentSlip, markAsPaid, updatePunishmentSlip, deletePunishmentSlip };