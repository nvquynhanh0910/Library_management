const { Publisher, BookTitle } = require('../models'); // thêm BookTitle

const getAllPublishers = async (req, res) => {
    try { res.json(await Publisher.findAll()); }
    catch (err) { res.status(500).json({ message: err.message }); }
};
 
const createPublisher = async (req, res) => {
    try {
        const { TenNXB, DiaChi, SoDienThoai } = req.body;
        if (!TenNXB) return res.status(400).json({ message: 'Thiếu tên NXB' });

        const exists = await Publisher.findOne({ where: { TenNXB } });
        if (exists) return res.status(400).json({ message: 'NXB đã tồn tại' });

        const lastPublisher = await Publisher.findOne({ order: [['MaNXB', 'DESC']] });
        const lastNum = lastPublisher ? parseInt(lastPublisher.MaNXB.replace('NXB', '')) : 0;
        const MaNXB = `NXB${String(lastNum + 1).padStart(4, '0')}`;

        res.status(201).json(await Publisher.create({ MaNXB, TenNXB, DiaChi, SoDienThoai }));
    } catch (err) { res.status(500).json({ message: err.message }); }
};
 
const updatePublisher = async (req, res) => {
    try {
        const p = await Publisher.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'Không tìm thấy NXB' });
        await p.update({ TenNXB: req.body.TenNXB, DiaChi: req.body.DiaChi, SoDienThoai: req.body.SoDienThoai });
        res.json(p);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const deletePublisher = async (req, res) => {
    try {
        const p = await Publisher.findByPk(req.params.id);
        if (!p) return res.status(404).json({ message: 'Không tìm thấy NXB' });

        await BookTitle.update({ MaNXB: null }, { where: { MaNXB: req.params.id } });
        await p.destroy();
        res.json({ message: 'Xóa NXB thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {getAllPublishers,createPublisher,updatePublisher,deletePublisher};